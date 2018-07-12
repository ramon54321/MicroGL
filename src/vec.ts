

export function squareMagnitude(vec3: number[]): number {
  const x = vec3[0] * vec3[0]
  const y = vec3[1] * vec3[1]
  const z = vec3[2] * vec3[2]
  return x + y + z
}

export function magnitude(vec3: number[]): number {
  return Math.sqrt(squareMagnitude(vec3))
}

export function normalized(vec3: number[]): number[] {
  const mag = magnitude(vec3)
  return [vec3[0] / mag, vec3[1] / mag, vec3[2] / mag]
}




