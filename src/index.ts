
import MGLContext, { MGLContextOptions } from './rendering/MGLContext';
import MGLRenderer, { MGLRendererOptions } from './rendering/MGLRenderer';
import MGLProgram, { MGLProgramOptions } from './rendering/MGLProgram';
import MGLMesh, { MGLMeshOptions } from './rendering/MGLMesh';
import MGLModel, { MGLModelOptions } from './rendering/MGLModel';
import MGLScene, { MGLSceneOptions } from './rendering/MGLScene';

// ------------------------

const mglContextOptions: MGLContextOptions = {
  id: 'canvas',
  width: 900,
  height: 900,
  multisample: true,
}
const mglContext: MGLContext = new MGLContext(mglContextOptions)


const mglRendererOptions: MGLRendererOptions = {
  mglContext: mglContext,
}
const mglRenderer: MGLRenderer = new MGLRenderer(mglRendererOptions)


const mglProgramOptions: MGLProgramOptions = {
  mglContext: mglContext,
  vertexSourceUrl: 'shaders/lambert.vertex',
  fragmentSourceUrl: 'shader/lambert.fragment',
}
const mglProgram: MGLProgram = new MGLProgram(mglProgramOptions)


const mglMeshOptions: MGLMeshOptions = {
  mglContext: mglContext,
  positionsData: [
    -0.5,   0,   0,
    -0.5,   0.5, 0,
    0.5, 0,   0,
  ],
  positionDimensions: 3
}
const mglMesh: MGLMesh = new MGLMesh(mglMeshOptions)


const mglModelOptions: MGLModelOptions = {
  mglContext: mglContext,
  mglProgram: mglProgram,
  mglMesh: mglMesh,
}
const mglModel: MGLModel = new MGLModel(mglModelOptions)

const mglSceneOptions: MGLSceneOptions = {

}
const mglScene: MGLScene = new MGLScene(mglSceneOptions)
mglScene.addModel(mglModel)


tick()
function tick() {
  requestAnimationFrame(tick)

  mglRenderer.render(mglScene)
  

}
