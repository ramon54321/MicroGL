import MGLWindow from "./MGLWindow";
import { CanvasInfo } from "../rendering";

export interface MGLRendererOptions {
  mglWindow: MGLWindow
  clearColor?: number[]
}

export default class MGLRenderer {
  mglWindow: MGLWindow

  constructor(mglRendererOptions: MGLRendererOptions) {
    const clearColor = mglRendererOptions.clearColor ? mglRendererOptions.clearColor : [0.440, 0.720, 0.860, 1.000]
    const gl = this.mglWindow.gl
    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3])
    gl.enable(gl.DEPTH_TEST)
  }

  render(/*mglScene: MGLScene*/) {
    const gl = this.mglWindow.gl
    
    // Set Viewport
    const canvasInfo: CanvasInfo = this.mglWindow.advancedCanvas.canvasInfo
    gl.viewport(0, 0, canvasInfo.drawWidth, canvasInfo.drawHeight);

    // Render Target
    gl.bindFramebuffer(gl.FRAMEBUFFER, 0)

    // Clear Buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Render each model
    //mglScene.models.forEach(model => model.render(gl, mglScene))

    // Potential post process
  }
}