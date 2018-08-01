import { MGLAdvancedCanvas } from "./rendering/MGLContext";


export function getMousePosition(canvas: MGLAdvancedCanvas, event) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: canvas.canvasInfo.styleHeight - (event.clientY - rect.top),
  }
}