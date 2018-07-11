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
//import { Shader, ShaderProgram, GridShaderProgram } from './shaders'
//import { GridMesh } from './mesh';

let canvas: Renderer.AdvancedCanvas = Renderer.createCanvas('canvas', 1200, 900)
let gl: WebGLRenderingContext = canvas.getContext('webgl')

// -- Temporary Input
var mouseX = 0
var mouseY = 0

canvas.addEventListener('mousemove', event => {
  var mousePosition = Input.getMousePosition(canvas, event)
  mouseX = mousePosition.x / (canvas.canvasInfo.styleWidth)
  mouseY = mousePosition.y / (canvas.canvasInfo.styleHeight)
})

if (!gl) {
  console.error('WebGL Not Supported')
}

// -- Init Setup
gl.clearColor(0, 0, 0, 0)
gl.enable(gl.DEPTH_TEST)

/*
const shaderProgram: ShaderProgram = new GridShaderProgram(gl,
   new Shader(gl, vertexShaderSource, gl.VERTEX_SHADER),
   new Shader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)
)

const mesh: GridMesh = new GridMesh(gl, 20)

let pm = mat4.create()
mat4.perspective(pm, 1, canvas.canvasInfo.aspectRatio, 0.1, 10000)
let vm = mat4.create()
let mm = mat4.create()

const objects = [
  {
    shaderProgram: shaderProgram,
    mesh: mesh,
    rotX: 0
  }
]

const texture = loadTexture(gl, 'envmap1.png');
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);

render(gl)

function render(gl: WebGLRenderingContext) {
  requestAnimationFrame(() => render(gl))
  
  gl.clear(gl.COLOR_BUFFER_BIT)

  mesh.bind()
  shaderProgram.bind()
  
  mat4.lookAt(
    vm,
    vec3.fromValues(mouseX * 4, mouseY * 4, 8 * 2),
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 1, 0),
  )

  objects.forEach(obj => {
    mat4.rotateX(mm, mat4.identity(mm), obj.rotX)

    gl.uniformMatrix4fv(obj.shaderProgram.u_ProjectionMatrix, false, pm)
    gl.uniformMatrix4fv(obj.shaderProgram.u_ViewMatrix, false, vm)
    gl.uniformMatrix4fv(obj.shaderProgram.u_ModelMatrix, false, mm)
    gl.uniform1i(obj.shaderProgram.u_Texture, 0)

    gl.drawElements(gl.TRIANGLES, obj.mesh.vertexIndicies.length, gl.UNSIGNED_SHORT, obj.mesh.indiciesBuffer as any)
  })
}
*/

// Vertex Shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertexShaderSource)
gl.compileShader(vertexShader)
if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  const error = gl.getShaderInfoLog(vertexShader)
  gl.deleteShader(vertexShader)
  throw new Error(error)
}

// Fragment Shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragmentShaderSource)
gl.compileShader(fragmentShader)
if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  const error = gl.getShaderInfoLog(fragmentShader)
  gl.deleteShader(fragmentShader)
  throw new Error(error)
}

// Shader Program
const shaderProgram = gl.createProgram()
gl.attachShader(shaderProgram, vertexShader)
gl.attachShader(shaderProgram, fragmentShader)
gl.linkProgram(shaderProgram)
if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  const error = gl.getProgramInfoLog(shaderProgram)
  gl.deleteProgram(shaderProgram)
  throw new Error(error)
}
gl.useProgram(shaderProgram) // When to use????""

// Uniform and Attribute Locations
const u_ProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'u_ProjectionMatrix')
const u_ViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'u_ViewMatrix')
const u_ModelMatrixLocation = gl.getUniformLocation(shaderProgram, 'u_ModelMatrix')
//const u_TextureLocation = gl.getUniformLocation(shaderProgram, 'U_Texture')
const a_Position = gl.getAttribLocation(shaderProgram, 'a_Position')

// Uniform and Attribute Data
const vertexPositions = [
  0, 0, 0,
  0, 0.5, 0,
  0.5, 0, 0,
]
const vertexPositionsBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionsBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW)
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(a_Position)

// Indicies
const vertexIndicies = [
  0, 1, 2,
]
const vertexIndiciesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndiciesBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndicies), gl.STATIC_DRAW)

// Matricies
let projectionMatrix = mat4.create()
let viewMatrix = mat4.create()
let modelMatrix = mat4.create()


mat4.perspective(projectionMatrix, 1, canvas.canvasInfo.aspectRatio, 0.1, 10000)

render(gl)
function render(gl: WebGLRenderingContext) {
  requestAnimationFrame(() => render(gl))
  
  gl.clear(gl.COLOR_BUFFER_BIT)
  
  // Set view matrix
  mat4.lookAt(
    viewMatrix,
    vec3.fromValues((mouseX - 0.5) * 10, (mouseY) * 2, 2),
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 1, 0),
  )

  // Some model transform
  mat4.rotateX(modelMatrix, mat4.identity(modelMatrix), 0)

  // Set uniforms
  gl.uniformMatrix4fv(u_ProjectionMatrixLocation, false, projectionMatrix)
  gl.uniformMatrix4fv(u_ViewMatrixLocation, false, viewMatrix)
  gl.uniformMatrix4fv(u_ModelMatrixLocation, false, modelMatrix)

  gl.drawElements(gl.TRIANGLES, vertexIndicies.length, gl.UNSIGNED_SHORT, vertexIndiciesBuffer as any)
}

































//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

