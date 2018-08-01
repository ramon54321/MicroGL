import MGLContext from './MGLContext'
import MGLProgram from './MGLProgram'
import MGLMesh from './MGLMesh'
import { mat4 } from 'gl-matrix'

export interface MGLModelOptions {
  mglContext: MGLContext
  mglProgram: MGLProgram
  mglMesh: MGLMesh
}

export default class MGLModel {
  options: MGLModelOptions

  constructor(mglModelOptions: MGLModelOptions) {
    this.options = mglModelOptions

    this.init()
  }

  u_modelMatrixLocation: WebGLUniformLocation

  private init() {
    const gl = this.options.mglContext.gl
    this.u_modelMatrixLocation = gl.getUniformLocation(
      this.options.mglProgram.program,
      'u_modelMatrix',
    )
  }

  private uploadUniforms() {
    const modelMatrix = mat4.create()
    mat4.identity(modelMatrix)
    
    const gl = this.options.mglContext.gl
    gl.uniformMatrix4fv(this.u_modelMatrixLocation, false, modelMatrix)
  }

  render() {
    this.options.mglProgram.bind()
    this.options.mglMesh.bind()
    this.uploadUniforms()

    const gl = this.options.mglContext.gl
    gl.drawArrays(gl.TRIANGLES, 0, this.options.mglMesh.elementCount)
  }
}
