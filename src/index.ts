
import { mat4, vec3 } from 'gl-matrix'
import * as Renderer from './rendering'
import * as Input from './input'
import * as Mesh from './mesh'

// -- Temporary Sources
var vertexShaderSource = (document.getElementById('shader-vertex-terrain') as any).text
var fragmentShaderSource = (document.getElementById('shader-fragment-terrain') as any).text

let canvas: Renderer.AdvancedCanvas = Renderer.createCanvas('canvas', 1200, 900)
let gl: WebGL2RenderingContext = canvas.getContext('webgl2', {antialias: false}) as WebGL2RenderingContext

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
const u_TextureLocation = gl.getUniformLocation(shaderProgram, 'u_Texture')
const a_Position = gl.getAttribLocation(shaderProgram, 'a_Position')
const a_Normal = gl.getAttribLocation(shaderProgram, 'a_Normal')

// Positions
const vertexPositions = Mesh.createGridVerticies(120)
const vertexPositionsBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionsBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW)
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(a_Position)

// Indicies
const vertexIndicies = Mesh.createGridIndexes(120)
const vertexIndiciesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndiciesBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndicies), gl.STATIC_DRAW)

// Normals
const vertexNormals = Mesh.calculateNormals(vertexPositions, vertexIndicies)
const vertexNormalsBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalsBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW)
gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(a_Normal)

// Matricies
let projectionMatrix = mat4.create()
let viewMatrix = mat4.create()
let modelMatrix = mat4.create()

// Texture
loadTexture(gl, 'envmap1.png')

// Framebuffers
const frameBuffer1 = gl.createFramebuffer()
gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer1)
const depthBuffer1 = gl.createRenderbuffer()
gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer1)
gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.DEPTH24_STENCIL8, canvas.canvasInfo.drawWidth, canvas.canvasInfo.drawHeight)
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer1)
const colorBuffer1 = gl.createRenderbuffer()
gl.bindRenderbuffer(gl.RENDERBUFFER, colorBuffer1)
gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.RGBA8, canvas.canvasInfo.drawWidth, canvas.canvasInfo.drawHeight)
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorBuffer1)
if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
  throw new Error('This combination of attachments do not work on the framebuffer')
}

mat4.perspective(projectionMatrix, 1, canvas.canvasInfo.aspectRatio, 0.1, 10000)

render(gl)
function render(gl: WebGL2RenderingContext) {
  requestAnimationFrame(() => render(gl))

  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer1)
  //gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer0)
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  
  // Set view matrix
  mat4.lookAt(
    viewMatrix,
    vec3.fromValues((mouseX - 0.5) * 80, (mouseY) * 80, 80),
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 1, 0),
  )

  // Some model transform
  mat4.rotateX(modelMatrix, mat4.identity(modelMatrix), 0)

  // Set uniforms
  gl.uniformMatrix4fv(u_ProjectionMatrixLocation, false, projectionMatrix)
  gl.uniformMatrix4fv(u_ViewMatrixLocation, false, viewMatrix)
  gl.uniformMatrix4fv(u_ModelMatrixLocation, false, modelMatrix)
  gl.uniform1i(u_TextureLocation, 0);

  gl.drawElements(gl.TRIANGLES, vertexIndicies.length, gl.UNSIGNED_SHORT, vertexIndiciesBuffer as any)

  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, frameBuffer1)
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null)
  gl.blitFramebuffer(0, 0,
    canvas.canvasInfo.drawWidth,
    canvas.canvasInfo.drawHeight, 0, 0,
    canvas.canvasInfo.drawWidth,
    canvas.canvasInfo.drawHeight, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, gl.NEAREST)  
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

