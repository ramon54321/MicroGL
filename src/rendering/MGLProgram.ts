import MGLContext from "./MGLContext";

export interface MGLProgramOptions {
  mglContext: MGLContext
  vertexSourceUrl: string
  fragmentSourceUrl: string
}

export default class MGLProgram {
  mglContext: MGLContext
  program: WebGLProgram

  constructor(mglProgramOptions: MGLProgramOptions) {
    this.mglContext = mglProgramOptions.mglContext

    // Get Source
    const vertexShaderSource = `#version 300 es
    
    uniform mat4 u_modelMatrix;

    layout(location = 0) in vec3 a_position;

    void main() {
      gl_Position = u_modelMatrix * vec4(a_position, 1.0);
    }

    `
    const fragmentShaderSource = `#version 300 es
    precision mediump float;

    out vec4 v_fragColor;

    void main() {
      v_fragColor = vec4(1.0, 0.5, 0.8, 1.0);
    }

    `

    const gl = this.mglContext.gl
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
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.bindAttribLocation(program, 0, "a_position")
    // gl.bindAttribLocation(program, 1, "a_texcoord")
    // gl.bindAttribLocation(program, 2, "a_normal")
    // gl.bindAttribLocation(program, 3, "a_color")
    gl.linkProgram(program)
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program)
      gl.deleteProgram(program)
      throw new Error(error)
    }
    this.program = program
  }

  bind() {
    this.mglContext.gl.useProgram(this.program)
  }

  unbind() {
    this.mglContext.gl.useProgram(null)
  }
}