// import * as Input from './input'
// import StepTerrainScene from './scenes/StepTerrainScene';
// import { StepTerrain } from './gridUtilities';
// import { AdvancedCanvas, createCanvas, Camera } from './rendering';
// import QuadScene from './scenes/QuadScene';
// import ObjectScene from './scenes/ObjectScene';
import MGLWindow, { MGLWindowOptions } from './rendering/MGLWindow';
import MGLRenderer, { MGLRendererOptions } from './rendering/MGLRenderer';
// import MGLScene from './rendering/MGLScene';
// import MGLModel from './rendering/MGLModel';


// ------------------------

const mglWindowOptions: MGLWindowOptions = {
  id: 'canvas',
  width: 900,
  height: 900,
  multisample: true,
}
const mglWindow: MGLWindow = new MGLWindow(mglWindowOptions)


const mglRendererOptions: MGLRendererOptions = {
  mglWindow: mglWindow,
}
const mglRenderer: MGLRenderer = new MGLRenderer(mglRendererOptions)




// const mglProgram: MGLProgram = new MGLProgram('shaders/lambert.vertex', 'shader/lambert.fragment')


// const mglMaterial: MGLMaterial = new MGLMaterial(mglProgram)


// const mglModel: MGLModel = new MGLModel(mglMaterial)


// const mglScene: MGLScene = new MGLScene()
// mglScene.addModel(mglModel)


tick()
function tick() {
  requestAnimationFrame(tick)

  mglRenderer.render()

}









// ------------------------

// // -- Initial required setup
// let canvas: AdvancedCanvas = createCanvas('canvas', 900, 900)
// let gl: WebGL2RenderingContext = canvas.getContext('webgl2', {
//   antialias: true,
// }) as WebGL2RenderingContext

// if (!gl) {
//   console.error('WebGL Not Supported')
// }

// // -- Game specific setup
// export class WorldState {
//   canvas: AdvancedCanvas
//   gl: WebGL2RenderingContext
//   mouseX: number
//   mouseY: number
//   mainCamera: Camera
//   stepTerrain: StepTerrain
//   keys: {
//     up: boolean
//     down: boolean
//     left: boolean
//     right: boolean
//   }

//   constructor() {
//     this.canvas = canvas
//     this.gl = gl
//     this.mouseX = 0
//     this.mouseY = 0
//     this.mainCamera = new Camera(this)
//     this.stepTerrain = new StepTerrain(24)
//     this.keys = {
//       up: false,
//       down: false,
//       left: false,
//       right: false,
//     }
//   }
// }

// const worldState: WorldState = new WorldState()

// canvas.addEventListener('mousemove', event => {
//   var mousePosition = Input.getMousePosition(canvas, event)
//   worldState.mouseX = mousePosition.x / canvas.canvasInfo.styleWidth
//   worldState.mouseY = mousePosition.y / canvas.canvasInfo.styleHeight
// })
// document.onkeydown = checkKeyDown
// document.onkeyup = checkKeyUp
// function checkKeyDown(e) {
//   handleKey(e, true)
// }
// function checkKeyUp(e) {
//   handleKey(e, false)
// }
// function handleKey(e, pressed: boolean) {
//   if (e.keyCode == '87') {
//     worldState.keys.up = pressed
//   }
//   else if (e.keyCode == '83') {
//     worldState.keys.down = pressed
//   }
//   else if (e.keyCode == '65') {
//     worldState.keys.left = pressed
//   }
//   else if (e.keyCode == '68') {
//     worldState.keys.right = pressed
//   }
// }

// // Init
// gl.clearColor(0.94, 0.94, 0.94, 1)
// gl.enable(gl.DEPTH_TEST)

// const n0 = worldState.stepTerrain.gridNodes[322]
// n0.nodeN.nodeE.data.height = 1
// n0.nodeN.nodeE.nodeN.nodeE.data.height = 0
// n0.nodeE.nodeE.data.height = 0
// n0.nodeE.nodeE.nodeN.data.height = 1
// n0.data.height = 0
// n0.nodeN.data.height = 1
// n0.nodeN.nodeN.data.height = 1
// n0.nodeN.nodeN.nodeE.data.height = 1
// n0.nodeW.data.height = 1
// n0.nodeW.nodeN.data.height = 1
// n0.nodeW.nodeN.nodeN.data.height = 1
// n0.nodeE.data.height = 1
// n0.nodeE.nodeN.data.height = 2
// const n1 = worldState.stepTerrain.gridNodes[77]
// n1.data.height = -1
// n1.nodeS.data.height = -1

// worldState.stepTerrain.calculate()

// const stepTerrainScene: StepTerrainScene = new StepTerrainScene(worldState, gl, null, worldState.mainCamera, worldState.stepTerrain)
// const objectScene: ObjectScene = new ObjectScene(worldState, gl, null, worldState.mainCamera)

// tick(gl)
// function tick(gl: WebGL2RenderingContext) {
//   requestAnimationFrame(() => tick(gl))

//   gl.bindFramebuffer(gl.FRAMEBUFFER, null)
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

//   stepTerrainScene.render()
//   objectScene.render()

// }
