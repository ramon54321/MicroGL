
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
  id: WebGLProgram
  vertexShader: Shader
  fragmentShader: Shader

  constructor(gl: WebGLRenderingContext, vertexShader: Shader, fragmentShader: Shader) {
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
  }
}

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