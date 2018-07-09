

/*
export interface Renderable {
  render(context: CanvasRenderingContext2D): void
}

export class Renderer {
  readonly renderables: Renderable[]
  readonly canvas: HTMLCanvasElement
  readonly context: CanvasRenderingContext2D
  readonly viewWidth: number
  readonly viewHeight: number

  constructor(canvasRootId: string, renderables: Renderable[]) {
    this.renderables = renderables

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    this.viewWidth = window.innerWidth
    this.viewHeight = window.innerHeight

    this.canvas.width = this.viewWidth * 2
    this.canvas.height = this.viewHeight * 2
    this.canvas.style.width = this.viewWidth + 'px'
    this.canvas.style.height = this.viewHeight + 'px'
    this.context.scale(2, 2)

    document.getElementById(canvasRootId).appendChild(this.canvas)

    this.tick()
  }

  tick() {
    requestAnimationFrame(() => this.tick())

    this.context.clearRect(0, 0, this.viewWidth, this.viewHeight);

    const renderablesCount = this.renderables.length
    for (let i = 0; i < renderablesCount; i++) {
      this.context.save()
      this.renderables[i].render(this.context)
      this.context.restore()
    }
  }
}
*/

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