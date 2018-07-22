
export function getGridIndexFromOffset(size: number, x0: number, y0: number, offsetX: number, offsetY: number): number | null {
  const x2 = x0 + offsetX
  const y2 = y0 + offsetY
  if(x2 < 0 || x2 >= size || y2 < 0 || y2 >= size) {
    return null
  }
  return x2 + y2 * size
}