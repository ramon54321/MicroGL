/*
import { Renderer, Renderable } from './rendering'

document.addEventListener('DOMContentLoaded', initialize, false);

class StaticEntity implements Renderable {
  x: number
  y: number

  svg: HTMLImageElement
  svgIsLoaded: boolean

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.svg = new Image()
    this.svg.src = './my4.svg'
    this.svgIsLoaded = false
    this.svg.onload = () => this.svgIsLoaded = true
  }
  render(context: CanvasRenderingContext2D): void {
    if (!this.svgIsLoaded) {
      return
    }
    context.translate(this.x, this.y)
    //context.rotate(r)
    //context.scale(s, s)
    context.drawImage(this.svg, -200, -200, 400, 400)
  }
}

function initialize() {
  const renderables: Renderable[] = new Array()
  renderables.push(new StaticEntity(200, 200))

  const renderer = new Renderer('drawroot', renderables)
}
*/

// -- Temporary Sources
var vertexShaderSource = (document.getElementById('2d-vertex-shader') as any).text
var fragmentShaderSource = (document.getElementById('2d-fragment-shader') as any).text

import { mat4, vec3 } from 'gl-matrix'
import * as Renderer from './rendering'
import * as Input from './input'
import { Shader, ShaderProgram } from './shaders'

let canvas: Renderer.AdvancedCanvas = Renderer.createCanvas('canvas', 800, 600)
let gl: WebGLRenderingContext = canvas.getContext('webgl')

// -- Temporary Input
var mouseX = 0
var mouseY = 0

canvas.addEventListener('mousemove', event => {
  var mousePosition = Input.getMousePosition(canvas, event)
  mouseX = mousePosition.x / (canvas.canvasInfo.styleWidth / 8)
  mouseY = mousePosition.y / (canvas.canvasInfo.styleHeight / 8)
})

if (!gl) {
  console.error('WebGL Not Supported')
}

let shaderProgram: ShaderProgram = new ShaderProgram(gl,
   new Shader(gl, vertexShaderSource, gl.VERTEX_SHADER),
   new Shader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)
)

var positionAttributeLocation = gl.getAttribLocation(shaderProgram.id, 'a_position')

var positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
// three 2d points
var positions = [0, 0, 0, 0, 0.5, 0, 1, 0, 0, 1, 0.5, 0]
function createGridVerticies(size: number) {
  const yStart = (size - 1) / 2
  const xStart = -yStart
  const verticies = []
  for (let y = yStart; y >= -yStart; y--) {
    for (let x = xStart; x <= -xStart; x++) {
      verticies.push(x)
      verticies.push(0)
      verticies.push(y)
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
positions = createGridVerticies(100)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

var indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
let indexes = [0, 1, 2, 2, 1, 3]
indexes = createGridIndexes(100)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW)

// -- Set up uniforms
let u_ProjectionMatrix = gl.getUniformLocation(shaderProgram.id, 'u_ProjectionMatrix')
let u_ViewMatrix = gl.getUniformLocation(shaderProgram.id, 'u_ViewMatrix')
let u_ModelMatrix = gl.getUniformLocation(shaderProgram.id, 'u_ModelMatrix')

render(gl)

let counter = 0
function render(gl: WebGLRenderingContext) {
  requestAnimationFrame(() => render(gl))

  counter += 1 / (60 * 4)

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Tell it to use our program (pair of shaders)
  gl.useProgram(shaderProgram.id)

  gl.enableVertexAttribArray(positionAttributeLocation)

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3 // 2 components per iteration
  var type = gl.FLOAT // the data is 32bit floats
  var normalize = false // don't normalize the data
  var stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0 // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

  let pm = mat4.create()
  let vm = mat4.create()
  let mm = mat4.create()

  pm = mat4.perspective(pm, 1, 800.0 / 600.0, 0.1, 100)
  vm = mat4.lookAt(
    vm,
    vec3.fromValues(mouseX, mouseY, 8),
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 1, 0),
  )
  mm = mat4.rotateX(mm, mm, 0)

  // console.log("PM:", pm)
  // console.log("VM:", vm)
  // console.log("MM:", mm)

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, pm)
  gl.uniformMatrix4fv(u_ViewMatrix, false, vm)
  gl.uniformMatrix4fv(u_ModelMatrix, false, mm)

  var primitiveType = gl.TRIANGLES
  var offset = 0
  var count = 3
  //gl.drawArrays(primitiveType, offset, count);
  gl.drawElements(gl.LINE_STRIP, indexes.length, gl.UNSIGNED_SHORT, indexBuffer as any)
}
//webglUtils.resizeCanvasToDisplaySize(gl.canvas);


