import Scene from './Scene'
import { createShaderProgram } from '../shaders'
// import { WorldState } from '..'
import { calculateNormals } from '../mesh'
import { Camera } from '../rendering'
import { mat4 } from 'gl-matrix';
import meshes from '../meshes';

export default class ObjectScene extends Scene {
  gl: WebGL2RenderingContext

  framebuffer: WebGLFramebuffer
  shaderProgram: WebGLProgram

  vertexArrayObject: WebGLVertexArrayObject

  vertexPositions: number[]
  vertexNormals: number[]
  vertexColors: number[]

  vertexPositionsBuffer: WebGLBuffer
  vertexNormalsBuffer: WebGLBuffer
  vertexColorsBuffer: WebGLBuffer

  u_ModelMatrixLocation: WebGLUniformLocation
  u_ViewMatrixLocation: WebGLUniformLocation
  u_ProjectionMatrixLocation: WebGLUniformLocation
  a_PositionLocation: number
  a_NormalLocation: number
  a_ColorLocation: number

  camera: Camera

  modelMatrix: mat4

  constructor(
    worldState: WorldState,
    gl: WebGL2RenderingContext,
    framebuffer: WebGLFramebuffer,
    camera: Camera
  ) {
    super(worldState)
    this.gl = gl
    this.framebuffer = framebuffer
    this.camera = camera

    this.init()
  }

  init() {
    // Shader Programs
    const vertexShaderSource = (document.getElementById('shader-vertex-diffuse') as any).text
    const fragmentShaderSource = (document.getElementById('shader-fragment-diffuse') as any)
      .text
    this.shaderProgram = createShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource)

    // Uniform and Attribute Locations
    this.u_ModelMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_ModelMatrix')
    this.u_ViewMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_ViewMatrix')
    this.u_ProjectionMatrixLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      'u_ProjectionMatrix',
    )
    this.a_PositionLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_Position')
    this.a_NormalLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_Normal')
    this.a_ColorLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_Color')

    this.modelMatrix = mat4.create()
    mat4.identity(this.modelMatrix)

    this.vertexArrayObject = this.gl.createVertexArray()
    this.gl.bindVertexArray(this.vertexArrayObject)

    // Attributes
    this.vertexPositions = this.generateVertexPositions()
    this.vertexPositionsBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionsBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertexPositions),
      this.gl.STATIC_DRAW,
    )
    this.gl.vertexAttribPointer(this.a_PositionLocation, 3, this.gl.FLOAT, false, 0, 0)

    this.vertexNormals = this.generateVertexNormals()
    this.vertexNormalsBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalsBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertexNormals),
      this.gl.STATIC_DRAW,
    )
    this.gl.vertexAttribPointer(this.a_NormalLocation, 3, this.gl.FLOAT, false, 0, 0)

    this.vertexColors = this.generateVertexColors()
    this.vertexColorsBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorsBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertexColors),
      this.gl.STATIC_DRAW,
    )
    this.gl.vertexAttribPointer(this.a_ColorLocation, 3, this.gl.FLOAT, false, 0, 0)
  }

  generateVertexPositions(): number[] {
    return meshes['tree']['positions']
  }

  generateVertexNormals(): number[] {
    return calculateNormals(this.vertexPositions)
  }

  generateVertexColors(): number[] {
    return meshes['tree']['colors']
  }

  render() {
    // Update
    this.camera.update()

    // Render
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)

    // Set shader program and uniforms
    this.gl.useProgram(this.shaderProgram)

    // Upload Uniforms
    this.gl.uniformMatrix4fv(this.u_ModelMatrixLocation, false, this.modelMatrix)
    this.gl.uniformMatrix4fv(this.u_ViewMatrixLocation, false, this.camera.viewMatrix)
    this.gl.uniformMatrix4fv(this.u_ProjectionMatrixLocation, false, this.camera.projectionMatrix)

    this.gl.bindVertexArray(this.vertexArrayObject)

    // Set buffers
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionsBuffer)
    this.gl.enableVertexAttribArray(this.a_PositionLocation)
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalsBuffer)
    this.gl.enableVertexAttribArray(this.a_NormalLocation)
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorsBuffer)
    this.gl.enableVertexAttribArray(this.a_ColorLocation)

    // Draw with current state
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexPositions.length / 3)

    this.gl.disableVertexAttribArray(this.a_PositionLocation)
    this.gl.disableVertexAttribArray(this.a_NormalLocation)
    this.gl.disableVertexAttribArray(this.a_ColorLocation)
  }
}
