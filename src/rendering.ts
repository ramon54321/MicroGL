import { WorldState } from ".";
import { mat4, vec3 } from "gl-matrix";

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

export class Camera {
  worldState: WorldState

  positionX: number = 0
  positionZ: number = 0
  distance: number = 6

  viewMatrix: mat4
  projectionMatrix: mat4

  constructor(worldState: WorldState) {
    this.worldState = worldState

    this.viewMatrix = mat4.create()
    this.projectionMatrix = mat4.create()
    mat4.perspective(this.projectionMatrix, 1, 1, 0.01, 100)
  }

  update() {
    const eyeXFactor = Math.sin(-this.worldState.mouseX * Math.PI * 2 + Math.PI)
    const eyeYFactor = Math.cos(-this.worldState.mouseX * Math.PI * 2 + Math.PI)

    if (this.worldState.keys.right) {
      this.positionZ += 0.1 * eyeXFactor * this.distance / 2
      this.positionX += 0.1 * eyeYFactor * this.distance / 2
    } else if (this.worldState.keys.left) {
      this.positionZ -= 0.1 * eyeXFactor * this.distance / 2
      this.positionX -= 0.1 * eyeYFactor * this.distance / 2
    }
    if (this.worldState.keys.up) {
      this.positionZ += 0.1 * eyeYFactor * this.distance / 2
      this.positionX -= 0.1 * eyeXFactor * this.distance / 2
    } else if (this.worldState.keys.down) {
      this.positionZ -= 0.1 * eyeYFactor * this.distance / 2
      this.positionX += 0.1 * eyeXFactor * this.distance / 2
    }

    mat4.identity(this.viewMatrix)
    const viewTarget = [this.positionX, 0, -this.positionZ]
    const eyeXOffset = eyeXFactor * 3 * this.distance
    const eyeZOffset = eyeYFactor * 3 * this.distance
    const viewEye = vec3.fromValues(
      viewTarget[0] + eyeXOffset,
      1 + (4 - this.worldState.mouseY * 4) * this.distance,
      viewTarget[2] + eyeZOffset,
    )
    mat4.lookAt(this.viewMatrix, viewEye, viewTarget, [0, 1, 0])
  }

}