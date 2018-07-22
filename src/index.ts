import * as Renderer from './rendering'
import * as Input from './input'
import { generateIsland } from './mapGenerator'
import TerrainScene from './scenes/TerrainScene';

let canvas: Renderer.AdvancedCanvas = Renderer.createCanvas('canvas', 900, 900)
let gl: WebGL2RenderingContext = canvas.getContext('webgl2', {
  antialias: false,
}) as WebGL2RenderingContext

const worldState: WorldState = {
  mouseX: 0,
  mouseY: 0,
}

canvas.addEventListener('mousemove', event => {
  var mousePosition = Input.getMousePosition(canvas, event)
  worldState.mouseX = mousePosition.x / canvas.canvasInfo.styleWidth
  worldState.mouseY = mousePosition.y / canvas.canvasInfo.styleHeight
})

if (!gl) {
  console.error('WebGL Not Supported')
}

// Init
gl.clearColor(0, 0, 0, 0)
gl.enable(gl.DEPTH_TEST)

const terrainScene: TerrainScene = new TerrainScene(worldState, gl, null)

generateIsland(terrainScene)

tick(gl)
function tick(gl: WebGL2RenderingContext) {
  requestAnimationFrame(() => tick(gl))

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  terrainScene.render()
}

export interface WorldState {
  mouseX: number
  mouseY: number
}
