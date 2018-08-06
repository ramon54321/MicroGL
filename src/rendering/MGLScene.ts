import MGLModel from "./MGLModel";

export interface MGLSceneOptions {

}

export default class MGLScene {
  options: MGLSceneOptions
  
  constructor(mglSceneOptions: MGLSceneOptions) {
    this.options = mglSceneOptions
  }

  models: MGLModel[] = []

  addModel(mglModel: MGLModel) {
    this.models.push(mglModel)
  }
}