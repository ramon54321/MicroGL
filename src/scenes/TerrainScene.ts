import Scene from './Scene'
import { createShaderProgram } from '../shaders'
import { mat4 } from 'gl-matrix';
import { WorldState } from '..';

export default class TerrainScene extends Scene {
  gl: WebGL2RenderingContext

  framebuffer: WebGLFramebuffer
  shaderProgram: WebGLProgram

  vertexPositions: number[]
  vertexUvs: number[]
  vertexIndicies: number[]

  vertexPositionsBuffer: WebGLBuffer
  vertexUvsBuffer: WebGLBuffer
  vertexIndiciesBuffer: WebGLBuffer

  u_ViewMatrixLocation: WebGLUniformLocation
  u_TextureColorLocation: WebGLUniformLocation
  u_TextureDetailLocation: WebGLUniformLocation
  u_Time: WebGLUniformLocation
  a_PositionLocation: number
  a_UvLocation: number

  viewMatrix: mat4
  time: number

  u_TextureColor: WebGLTexture
  u_TextureDetail: WebGLTexture

  constructor(worldState: WorldState, gl: WebGL2RenderingContext, framebuffer: WebGLFramebuffer) {
    super(worldState)
    this.gl = gl
    this.framebuffer = framebuffer

    this.init()
  }

  setTextureColorPixels(size: number, pixels: number[]) {
    const correctedPixels = []
    for (let i = 0; i < pixels.length; i++) {
      correctedPixels.push(Math.floor(pixels[i] * 255))
    }
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.u_TextureColor)
    const level = 0
    const internalFormat = this.gl.RGBA
    const width = size
    const height = size
    const border = 0
    const srcFormat = this.gl.RGBA
    const srcType = this.gl.UNSIGNED_BYTE
    const pixel = new Uint8Array(correctedPixels)
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel,
    )
    this.gl.generateMipmap(this.gl.TEXTURE_2D)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
  }
  setTextureDetailPixels(size: number, pixels: number[]) {
    const correctedPixels = []
    for (let i = 0; i < pixels.length; i++) {
      correctedPixels.push(Math.floor(pixels[i] * 255))
    }
    this.gl.activeTexture(this.gl.TEXTURE1)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.u_TextureDetail)
    const level = 0
    const internalFormat = this.gl.RGBA
    const width = size
    const height = size
    const border = 0
    const srcFormat = this.gl.RGBA
    const srcType = this.gl.UNSIGNED_BYTE
    const pixel = new Uint8Array(correctedPixels)
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel,
    )
    this.gl.generateMipmap(this.gl.TEXTURE_2D)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
  }

  init() {
    // Shader Programs
    const vertexShaderSource = (document.getElementById('shader-vertex-terrain') as any).text
    const fragmentShaderSource = (document.getElementById('shader-fragment-terrain') as any).text
    this.shaderProgram = createShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource)

    // Uniform and Attribute Locations
    this.u_ViewMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_ViewMatrix')
    this.u_TextureColorLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_TextureColor')
    this.u_TextureDetailLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_TextureDetail')
    this.u_Time = this.gl.getUniformLocation(this.shaderProgram, 'u_Time')
    this.a_PositionLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_Position')
    this.a_UvLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_Uv')

    // Create Local Data
    this.viewMatrix = mat4.create()
    this.time = 0

    // Upload Uniforms
    this.u_TextureColor = this.gl.createTexture()
    this.setTextureColorPixels(2, [0, 0, 1.0, 1.0, 0, 1.0, 1.0, 1.0, 0.5, 0, 1.0, 1.0, 1.0, 1.0, 0, 1.0])
    this.u_TextureDetail = this.gl.createTexture()
    this.setTextureDetailPixels(2, [0, 0, 1.0, 1.0, 0, 1.0, 1.0, 1.0, 0.5, 0, 1.0, 1.0, 1.0, 1.0, 0, 1.0])
    const textureDetailImage = new Image()
    textureDetailImage.onload = () => {
      this.gl.activeTexture(this.gl.TEXTURE1)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.u_TextureDetail)
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA,
                    this.gl.RGBA, this.gl.UNSIGNED_BYTE, textureDetailImage)
      
      //this.gl.generateMipmap(this.gl.TEXTURE_2D)
      // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
      // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
      // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    }
    textureDetailImage.src = 'grass.png'
    

    // Positions
    this.vertexPositions = [-1, -1, -1, 1, 1, 1, 1, -1]
    this.vertexPositionsBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionsBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertexPositions),
      this.gl.STATIC_DRAW,
    )
    this.gl.vertexAttribPointer(this.a_PositionLocation, 2, this.gl.FLOAT, false, 0, 0)

    // Uvs
    this.vertexUvs = [0, 0, 0, 1, 1, 1, 1, 0]
    this.vertexUvsBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexUvsBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexUvs), this.gl.STATIC_DRAW)
    this.gl.vertexAttribPointer(this.a_UvLocation, 2, this.gl.FLOAT, false, 0, 0)

    // Indicies
    this.vertexIndicies = [0, 1, 2, 0, 2, 3]
    this.vertexIndiciesBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndiciesBuffer)
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.vertexIndicies),
      this.gl.STATIC_DRAW,
    )
  }

  posX = 0
  zoom = 1
  render() {
    // Update
    mat4.identity(this.viewMatrix)
    const scaleDelta = (this.worldState.mouseY - 0.5) / 12.5
    this.zoom = this.zoom + scaleDelta
    mat4.scale(this.viewMatrix, this.viewMatrix, [this.zoom, this.zoom, this.zoom])
    
    const xDelta = (this.worldState.mouseX - 0.5) / -100
    this.posX = this.posX + xDelta
    mat4.translate(this.viewMatrix, this.viewMatrix, [this.posX, 0, 0])
    
    this.time += 0.02

    // Render
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)

    // Set shader program and uniforms
    this.gl.useProgram(this.shaderProgram)

    // Upload Uniforms
    this.gl.uniformMatrix4fv(this.u_ViewMatrixLocation, false, this.viewMatrix)
    this.gl.uniform1f(this.u_Time, this.time)

    // Set texture
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.u_TextureColor)
    this.gl.uniform1i(this.u_TextureColorLocation, 0)
    this.gl.activeTexture(this.gl.TEXTURE1)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.u_TextureDetail)
    this.gl.uniform1i(this.u_TextureDetailLocation, 1)

    // Set buffers
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionsBuffer)
    this.gl.enableVertexAttribArray(this.a_PositionLocation)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexUvsBuffer)
    this.gl.enableVertexAttribArray(this.a_UvLocation)

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndiciesBuffer)

    // Draw with current state
    this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndicies.length, this.gl.UNSIGNED_SHORT, this
      .vertexIndiciesBuffer as any)
  }
}