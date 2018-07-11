import { mat4 } from "gl-matrix";

export class Shader {
  id: WebGLShader

  constructor(gl: WebGLRenderingContext, source: string, type: number) {
    this.id = gl.createShader(type)
    
    gl.shaderSource(this.id, source)
    gl.compileShader(this.id)
    
    const success = gl.getShaderParameter(this.id, gl.COMPILE_STATUS) 
    if(!success) {
      const error = gl.getShaderInfoLog(this.id)
      gl.deleteShader(this.id)
      throw new Error(error)
    }
  }
}

export class ShaderProgram {
  gl: WebGLRenderingContext
  id: WebGLProgram
  vertexShader: Shader
  fragmentShader: Shader

  a_Position: number
  u_ProjectionMatrix: WebGLUniformLocation
  u_ViewMatrix: WebGLUniformLocation
  u_ModelMatrix: WebGLUniformLocation
  u_Texture: WebGLUniformLocation

  constructor(gl: WebGLRenderingContext, vertexShader: Shader, fragmentShader: Shader) {
    this.gl = gl
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader

    this.id = gl.createProgram()
    gl.attachShader(this.id, this.vertexShader.id)
    gl.attachShader(this.id, this.fragmentShader.id)
    gl.linkProgram(this.id)

    const success = gl.getProgramParameter(this.id, gl.LINK_STATUS) 
    if(!success) {
      const error = gl.getProgramInfoLog(this.id)
      gl.deleteProgram(this.id)
      throw new Error(error)
    }

    this.u_ProjectionMatrix = gl.getUniformLocation(this.id, 'u_ProjectionMatrix')
    this.u_ViewMatrix = gl.getUniformLocation(this.id, 'u_ViewMatrix')
    this.u_ModelMatrix = gl.getUniformLocation(this.id, 'u_ModelMatrix')
    this.u_Texture = gl.getUniformLocation(this.id, 'u_Texture')
    
    this.a_Position = gl.getAttribLocation(this.id, 'a_Position')
    this.gl.enableVertexAttribArray(this.a_Position)
  }

  bind() {
    this.gl.useProgram(this.id)
    this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, 0, 0)
  }
}

export class GridShaderProgram extends ShaderProgram {
  a_Temperature: number

  constructor(gl: WebGLRenderingContext, vertexShader: Shader, fragmentShader: Shader) {
    super(gl, vertexShader, fragmentShader)

    this.a_Temperature = gl.getAttribLocation(this.id, 'a_Temperature')
    this.gl.enableVertexAttribArray(this.a_Temperature)
  }

  bind() {
    this.gl.useProgram(this.id)
    this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, 16, 0)
    this.gl.vertexAttribPointer(this.a_Temperature, 1, this.gl.FLOAT, false, 16, 12)
  }
}

/*
var a_Position = gl.getAttribLocation(shaderProgram.id, 'a_Position')

// -- Set up uniforms
let u_ProjectionMatrix = gl.getUniformLocation(shaderProgram.id, 'u_ProjectionMatrix')
let u_ViewMatrix = gl.getUniformLocation(shaderProgram.id, 'u_ViewMatrix')
let u_ModelMatrix = gl.getUniformLocation(shaderProgram.id, 'u_ModelMatrix')
*/

/*

var vertexShaderSource = (document.getElementById('2d-vertex-shader') as any).text
var fragmentShaderSource = (document.getElementById('2d-fragment-shader') as any).text

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

var program = createProgram(gl, vertexShader, fragmentShader)


function createShader(gl, type, source) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  var success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

*/