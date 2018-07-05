
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