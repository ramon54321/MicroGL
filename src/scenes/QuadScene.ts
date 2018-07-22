import Scene from './Scene'
import { createShaderProgram } from '../shaders'
import { WorldState } from '..';

export default class QuadScene extends Scene {
  gl: WebGL2RenderingContext

  framebuffer: WebGLFramebuffer
  shaderProgram: WebGLProgram

  vertexPositions: number[]
  vertexUvs: number[]
  vertexIndicies: number[]

  vertexPositionsBuffer: WebGLBuffer
  vertexUvsBuffer: WebGLBuffer
  vertexIndiciesBuffer: WebGLBuffer

  u_TextureLocation: WebGLUniformLocation
  a_PositionLocation: number
  a_UvLocation: number

  u_Texture: WebGLTexture

  constructor(worldState: WorldState, gl: WebGL2RenderingContext, framebuffer: WebGLFramebuffer) {
    super(worldState)
    this.gl = gl
    this.framebuffer = framebuffer

    this.init()
  }

  setTexturePixels(size: number, pixels: number[]) {
    const correctedPixels = []
    for (let i = 0; i < pixels.length; i++) {
      correctedPixels.push(Math.floor(pixels[i] * 255))
    }
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.u_Texture)
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

  init() {
    // Shader Programs
    const vertexShaderSource = (document.getElementById('shader-vertex-quad') as any).text
    const fragmentShaderSource = (document.getElementById('shader-fragment-quad') as any).text
    this.shaderProgram = createShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource)

    // Uniform and Attribute Locations
    this.u_TextureLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_Texture')
    this.a_PositionLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_Position')
    this.a_UvLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_Uv')

    // Upload Uniforms ???
    this.u_Texture = this.gl.createTexture()
    this.setTexturePixels(2, [0, 0, 1.0, 1.0, 0, 1.0, 1.0, 1.0, 0.5, 0, 1.0, 1.0, 1.0, 1.0, 0, 1.0])

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

  render() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)

    // Set shader program and uniforms
    this.gl.useProgram(this.shaderProgram)

    // Set texture
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.u_Texture)
    this.gl.uniform1i(this.u_TextureLocation, 0)

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
