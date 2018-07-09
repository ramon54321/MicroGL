import { AdvancedCanvas } from "./rendering";

export function getMousePosition(canvas: AdvancedCanvas, event) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: canvas.canvasInfo.styleHeight - (event.clientY - rect.top),
  }
}