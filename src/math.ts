export function clamp(a: number, b: number, t: number): number {
  if (t < a) {
    t = a
  } else if (t > b) {
    t = b
  }
  return t
}

export function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b;
}

export function map(inputStart: number, inputEnd: number, outputStart: number, outputEnd: number, t: number): number {
  return (t - inputStart) / (inputEnd - inputStart) * (outputEnd - outputStart) + outputStart
}

export function normalize(outputStart: number, outputEnd: number, t: number[]): number[] {
  let min = 999999999999
  let max = -999999999999
  for (let i = 0; i < t.length; i++) {
    const b = t[i]
    if(b < min) {
      min = b
    } else if (b > max) {
      max = b
    }
  }
  const normalized = []
  for (let i = 0; i < t.length; i++) {
    const c = map(min, max, outputStart, outputEnd, t[i])
    normalized.push(c)
  }
  return normalized
}

export function operate(a: number[], b: number[], f: (a: number, b: number) => number) {
  if(a.length !== b.length) {
    throw new Error("Can't operate arrays with different lengths!")
  }
  const values = []
  for (let i = 0; i < a.length; i++) {
    values.push(f(a[i], b[i]))
  }
  return values
}

export function sum(a: number[]): number {
  let total = 0
  for (let i = 0; i < a.length; i++) {
    total += a[i]
  }
  return total
}

export function sigmoid(t: number, intensity: number) {
  if(intensity < 5 || intensity > 20) {
    console.warn("Sigmoid intensity clamped between 5 and 20")
  }
  const e = Math.E
  const a = Math.pow(e, clamp(5, 20, intensity) * (t - 0.5))
  const b = a + 1
  const c = a / b
  return c
}