
export interface AdvancedCanvas extends HTMLCanvasElement {
  canvasInfo: CanvasInfo
}

export interface CanvasInfo {
  styleWidth: number
  styleHeight: number
  drawWidth: number
  drawHeight: number
  devicePixelRatio: number
  aspectRatio: number
}

export function createCanvas(canvasId: string, width: number, height: number): AdvancedCanvas {
  const canvas: any = document.getElementById(canvasId);
  const desiredWidthInCSSPixels = width;
  const desiredHeightInCSSPixels = height;

  // -- Set display size of the canvas
  canvas.style.width = desiredWidthInCSSPixels + "px";
  canvas.style.height = desiredHeightInCSSPixels + "px";

  // -- Set draw buffer size
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = desiredWidthInCSSPixels * devicePixelRatio;
  canvas.height = desiredHeightInCSSPixels * devicePixelRatio;

  const canvasInfo: CanvasInfo = {
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

// export function blitFramebuffer(from: WebGLFramebuffer, to: WebGLFramebuffer) {

// }