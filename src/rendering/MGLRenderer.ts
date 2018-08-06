import MGLContext, { MGLCanvasInfo } from "./MGLContext";
import MGLModel from "./MGLModel";
import MGLScene from "./MGLScene";

export interface MGLRendererOptions {
  mglContext: MGLContext
  clearColor?: number[]
}

export default class MGLRenderer {
  mglWindow: MGLContext

  constructor(mglRendererOptions: MGLRendererOptions) {
    this.mglWindow = mglRendererOptions.mglContext
    const clearColor = mglRendererOptions.clearColor ? mglRendererOptions.clearColor : [0.440, 0.720, 0.860, 1.000]
    const gl = this.mglWindow.gl
    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3])
    gl.enable(gl.DEPTH_TEST)
  }

  render(mglScene: MGLScene) {
    const gl = this.mglWindow.gl
    
    // Render Target
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // Set Viewport
    const canvasInfo: MGLCanvasInfo = this.mglWindow.advancedCanvas.canvasInfo
    gl.viewport(0, 0, canvasInfo.drawWidth, canvasInfo.drawHeight)

    // Clear Buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Render each model
    mglScene.models.forEach(model => model.render())
  }
}
