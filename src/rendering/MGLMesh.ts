import MGLContext from './MGLContext'

export interface MGLMeshOptions {
  mglContext: MGLContext
  positionsData: number[]
  //normalsData: number[]
  positionDimensions: number
}

export default class MGLMesh {
  options: MGLMeshOptions

  vertexArray: WebGLVertexArrayObject
  positionsBuffer: WebGLBuffer

  elementCount: number

  constructor(mglMeshOptions: MGLMeshOptions) {
    this.options = mglMeshOptions

    const gl = this.options.mglContext.gl
    this.vertexArray = gl.createVertexArray()
    gl.bindVertexArray(this.vertexArray)

    gl.enableVertexAttribArray(0)
    this.positionsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.options.positionsData), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

    gl.bindVertexArray(null)

    this.elementCount = mglMeshOptions.positionsData.length / mglMeshOptions.positionDimensions
  }

  bind() {
    this.options.mglContext.gl.bindVertexArray(this.vertexArray)
  }

  unbind() {
    this.options.mglContext.gl.bindVertexArray(null)
  }
}
