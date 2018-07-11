import { gridNoise } from "./mapGenerator";

export class Mesh {
  gl: WebGLRenderingContext
  vertexPositions: number[]
  //vertexNormals: number[]
  vertexIndicies: number[]
  vertexPositionsData: Float32Array
  //vertexNormalsData: Float32Array
  vertexIndiciesData: Uint16Array
  positionsBuffer: WebGLBuffer
  //normalsBuffer: WebGLBuffer
  indiciesBuffer: WebGLBuffer

  constructor(gl: WebGLRenderingContext, vertexPositions: number[], indexPositions: number[]) {
    this.gl = gl
    this.vertexPositions = vertexPositions
    this.vertexIndicies = indexPositions

    //this.vertexNormals = this.calculateNormals()

    this.vertexPositionsData = new Float32Array(this.vertexPositions)
    //this.vertexNormalsData = new Float32Array(this.vertexNormals)
    this.vertexIndiciesData = new Uint16Array(this.vertexIndicies)

    this.positionsBuffer = gl.createBuffer()
    //this.normalsBuffer = gl.createBuffer()
    this.indiciesBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexPositionsData, gl.STATIC_DRAW)

    //gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer)
    //gl.bufferData(gl.ARRAY_BUFFER, this.vertexNormalsData, gl.STATIC_DRAW)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndiciesData, gl.STATIC_DRAW)
  }

  bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionsBuffer) 
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer)
  }
}

export class GridMesh extends Mesh {
  constructor(gl: WebGLRenderingContext, size: number) {
    super(gl, createGridVerticies(size), createGridIndexes(size))
  }
}

function createGridVerticies(size: number) {
  const yStart = (size - 1) / 2
  const xStart = -yStart
  const verticies = []
  const tempIncrement = 1 / size
  const heights = gridNoise(size)
  console.log(xStart)
  let count = 0
  for (let y = yStart; y >= -yStart; y--) {
    for (let x = xStart; x <= -xStart; x++) {
      verticies.push(x)
      //verticies.push(((-(y - yStart) * tempIncrement + (Math.random() * 0.1) - 0.05) * 10))
      verticies.push(heights[count])
      verticies.push(y)
      //verticies.push((x - xStart) * tempIncrement + (Math.random() * 0.2) - 0.1)
      verticies.push(0.4 + (Math.random() * 0.04) - 0.02)
      count++
    }
  }
  return verticies
}

function createGridIndexes(size: number) {
  const trianglesPerSide = size - 1
  const indexes = []
  for (let y = 0; y < trianglesPerSide; y++) {
    for (let x = 0; x < trianglesPerSide; x++) {
      const base = x + y * size
      indexes.push(base)
      indexes.push(base + (size + 1))
      indexes.push(base + size)
      indexes.push(base)
      indexes.push(base + 1)
      indexes.push(base + (size + 1))
    }
  }
  return indexes
}