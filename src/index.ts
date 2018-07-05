
import { Renderer, Renderable } from './rendering'

document.addEventListener('DOMContentLoaded', initialize, false);

class StaticEntity implements Renderable {
  x: number
  y: number

  svg: HTMLImageElement
  svgIsLoaded: boolean

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.svg = new Image()
    this.svg.src = './my2.svg'
    this.svgIsLoaded = false
    this.svg.onload = () => this.svgIsLoaded = true
  }
  render(context: CanvasRenderingContext2D): void {
    if (!this.svgIsLoaded) {
      return
    }
    context.translate(this.x, this.y)
    //context.rotate(r)
    //context.scale(s, s)
    context.drawImage(this.svg, -50, -50, 100, 100)
  }
}

function initialize() {
  const renderables: Renderable[] = new Array()
  renderables.push(new StaticEntity(150, 150))

  const renderer = new Renderer('drawroot', renderables)
}
