import { WorldState } from "..";

export default abstract class Scene {
  worldState: WorldState
  constructor(worldState: WorldState) {
    this.worldState = worldState
  }
  abstract init()
  abstract render()
}