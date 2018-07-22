import { normalize, map, clamp, sum } from "./math";
import { perlin } from "./noise";
import { getGridIndexFromOffset } from "./gridUtilities";

export interface FractalNoiseOptions {
  size: number
  octaves?: number
  octaveOffset?: number
  lacunarity?: number
  persistance?: number
}

export function fractalNoise(options: FractalNoiseOptions): number[] {
  const {
    size = 256,
    octaves = 8,
    octaveOffset = 0,
    lacunarity = 2,
    persistance = 0.65,
  } = options
  const octaveLayers = []
  for (let i = 0 + octaveOffset; i < octaves + octaveOffset; i++) {
    const octaveLayer = perlinNoise(size, Math.pow(lacunarity, i), Math.pow(persistance, i))
    octaveLayers.push(octaveLayer)
  }
  const total = []
  for (let i = 0; i < octaveLayers[0].length; i++) {
    let value = 0
    for (let oi = 0; oi < octaves; oi++) {
      value += octaveLayers[oi][i]
    }
    total.push(value)
  }
  return normalize(-1, 1, total)
}

export function perlinNoise(size: number, frequency: number, amplitude: number): number[] {
  const values = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const raw = perlin((x / size), (y / size), frequency)
      values.push(raw)
    }
  }
  return normalize(-1 * amplitude, 1 * amplitude, values)
}

export function falloffSquare(size: number, distance: number, f: (a: number) => number) {
  distance = distance * size / 2
  const values = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const x0 = Math.abs(x - size) 
      const x1 = size - x0
      const y0 = Math.abs(y - size) 
      const y1 = size - y0
      const xMin = Math.min(x0, x1)
      const yMin = Math.min(y0, y1)
      const min = Math.min(xMin, yMin)
      const scaled = map(0, distance, 0, 1, min)
      const clamped = clamp(0, 1, scaled)
      const processed = f(clamped)
      values.push(processed)
    }
  }
  return values
}

// function createFalloff(size: number) {
//   const values = []
//   for (let y = 0; y < size; y++) {
//     for (let x = 0; x < size; x++) {
//       const distFromCenter = magnitude([x - size / 2, y - size / 2, 0])
//       const dist = distFromCenter / (size / 2)
//       const val = clamp(1 - (Math.pow(dist, 1.8)), 0, 1)
//       values.push(val)
//     }
//   }
//   return values
// }

export function blurBox(size: number, blurSize: number, stride: number, values: number[]): number[] {
  const valuesOut = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const samples = []
      const startX = -Math.floor(blurSize / 2)
      const startY = -Math.floor(blurSize / 2)
      for (let xo = startX; xo < startX + blurSize; xo+=stride) {
        for (let yo = startY; yo < startY + blurSize; yo+=stride) {
          const index = getGridIndexFromOffset(size, x, y, xo, yo)
          // console.log("Sample for: (" + x + "," + y + ") sample: " + xo + "," + yo + " at index " + index)
          if (index !== null) {
            samples.push(values[index])
            // console.log("Sample for: (" + x + "," + y + ") " + values[index])
          }
        }
      }
      const average = sum(samples) / samples.length
      // console.log("Total: " + sum(samples) + " with length of " + samples.length + " = " + average)
      valuesOut.push(average)
    }
  }
  return valuesOut
}