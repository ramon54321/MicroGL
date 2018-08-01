export interface MGLContextOptions {
  id: string
  width: number
  height: number
  multisample: boolean
}

export default class MGLContext {
  advancedCanvas: MGLAdvancedCanvas
  gl: WebGL2RenderingContext

  constructor(mglContextOptions: MGLContextOptions) {
    this.advancedCanvas = mglCreateCanvas(
      mglContextOptions.id,
      mglContextOptions.width,
      mglContextOptions.height,
    )
    this.gl = this.advancedCanvas.getContext('webgl2', {
      antialias: mglContextOptions.multisample
    })
    if (!this.gl) {
      throw new Error('WebGL Not Supported')
    }
  }
}

export interface MGLAdvancedCanvas extends HTMLCanvasElement {
  canvasInfo: MGLCanvasInfo
}

export interface MGLCanvasInfo {
  styleWidth: number
  styleHeight: number
  drawWidth: number
  drawHeight: number
  devicePixelRatio: number
  aspectRatio: number
}

function mglCreateCanvas(canvasId: string, width: number, height: number): MGLAdvancedCanvas {
  const canvas: any = document.getElementById(canvasId)
  const desiredWidthInCSSPixels = width
  const desiredHeightInCSSPixels = height

  // -- Set display size of the canvas
  canvas.style.width = desiredWidthInCSSPixels + 'px'
  canvas.style.height = desiredHeightInCSSPixels + 'px'

  // -- Set draw buffer size
  const devicePixelRatio = window.devicePixelRatio || 1
  canvas.width = desiredWidthInCSSPixels * devicePixelRatio
  canvas.height = desiredHeightInCSSPixels * devicePixelRatio

  const canvasInfo: MGLCanvasInfo = {
    styleWidth: desiredWidthInCSSPixels,
    styleHeight: desiredHeightInCSSPixels,
    drawWidth: canvas.width,
    drawHeight: canvas.height,
    devicePixelRatio: devicePixelRatio,
    aspectRatio: canvas.width / canvas.height,
  }

  canvas.canvasInfo = canvasInfo

  return canvas
}
