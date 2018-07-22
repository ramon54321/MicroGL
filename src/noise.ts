
import { lerp } from './math'

class Gradient {
  x
  y

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  dot2(x, y) {
    return this.x * x + this.y * y
  }

  toString() {
    return "(" + this.x + "," + this.y + ")"
  }
}

var gradientTable = [
  new Gradient(1,1), new Gradient(-1,1), new Gradient(1,-1), new Gradient(-1,-1),
  new Gradient(0,1), new Gradient(0,-1), new Gradient(1,0), new Gradient(-1,0)
]

var permutationTable = [
  151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
]

var perms = []
var grads = []

export function seed(seed: number) {
  for (let i = 0; i < 256; i++) {
    perms[i] = permutationTable[(i + permutationTable[seed % 255]) % 255]
    perms[256 + i] = permutationTable[((seed % 255) + (i + permutationTable[seed % 255]) % 255) % 255]
  }
  for (let i = 0; i < 256; i++) {
    grads[i] = gradientTable[perms[(i + seed) % 511] % 7]
    grads[256 + i] = gradientTable[(perms[seed % 511] + perms[(i + perms[i]) % 255]) % 7]
  }
}

seed(56)

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

export function perlin(x: number, y: number, freq): number {
  x *= freq
  y *= freq

  const xi = Math.floor(x) & 255
  const yi = Math.floor(y) & 255

  const p1 = perms[perms[xi] + yi]
  const p2 = perms[perms[xi + 1] + yi]
  const p3 = perms[perms[xi] + yi + 1]
  const p4 = perms[perms[xi + 1] + yi + 1]

  const g1 = gradientTable[p1 & 7]
  const g2 = gradientTable[p2 & 7]
  const g3 = gradientTable[p3 & 7]
  const g4 = gradientTable[p4 & 7]

  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)

  const c1 = g1.dot2(xf, yf)
  const c2 = g2.dot2(xf - 1, yf)
  const c3 = g3.dot2(xf, yf - 1)
  const c4 = g4.dot2(xf - 1, yf - 1)

  const u = fade(xf)
  const v = fade(yf)

  const ix1 = lerp(c1, c2, u)
  const ix2 = lerp(c3, c4, u)
  const iy = lerp(ix1, ix2, v)
  
  return iy
}
