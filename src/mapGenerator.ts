import { seed } from './noise'
import { fractalNoise, falloffSquare, blurBox } from './generators';
import { sigmoid, normalize, operate } from './math';
import TerrainScene from './scenes/TerrainScene';

export function generateIsland(terrainScene: TerrainScene) {
  const size = 1024
  seed(14141)
  let layer0 = fractalNoise({
    size: size,
    octaves: 4,
    lacunarity: 1.8,
    persistance: 0.65,
    octaveOffset: 5,
  })
  layer0 = layer0.map(value => Math.abs(value))
  layer0 = layer0.map(value => sigmoid(value, 6))
  layer0 = normalize(0, 1, layer0)

  let layer1 = fractalNoise({
    size: size,
    octaves: 5,
    lacunarity: 1.6,
    persistance: 0.65,
    octaveOffset: 4,
  })
  layer1 = normalize(0, 1, layer1)
  layer1 = layer1.map(value => sigmoid(value, 7))
  layer1 = normalize(0, 1, layer1)

  let mix0 = operate(layer0, layer1, (a, b) => b - ((1 - a) * 0.4))
  mix0 = normalize(0, 1, mix0)
  mix0 = mix0.map(value => Math.pow(value, 1.3))
  mix0 = normalize(0, 1, mix0)

  let falloff = falloffSquare(size, 0.5, x => x)
  // falloff = blurBox(size, 50, 10, falloff)
  // falloff = blurBox(size, 10, 2, falloff)
  
  let mix1 = operate(mix0, falloff, (n, f) => n * f)

  mix1 = normalize(0, 1, mix1)
  mix1 = mix1.map(value => Math.pow(value, 1.6))

  let layer2 = fractalNoise({
    size: size,
    octaves: 9,
    lacunarity: 1.8,
    persistance: 0.7,
    octaveOffset: 6,
  })
  let mix2 = operate(mix1, layer2, (a, b) => a - b/10)
  mix2 = normalize(0, 1, mix2)
  
  const out = mix2

  const pixelValues = valuesToPixels(out)
  terrainScene.setTextureColorPixels(size, pixelValues)

  // let detail1 = fractalNoise({
  //   size: 128,
  //   octaves: 3,
  //   lacunarity: 1.6,
  //   persistance: 0.65,
  //   octaveOffset: 4,
  // })
  // detail1 = normalize(0, 1, detail1)
  // detail1 = detail1.map(value => sigmoid(value, 7))
  // detail1 = normalize(0, 1, detail1)

  // let falloffDetail = falloffSquare(128, 0.8, x => x)
  
  // let mixDetail = operate(detail1, falloffDetail, (n, f) => n * f)

  // const pixelValuesDetail = valuesToPixels(mixDetail)
  //terrainScene.setTextureDetailPixels(128, pixelValuesDetail)
}

export function valuesToPixels(values: number[]): number[] {
  const pixels = []
  for (let i = 0; i < values.length; i++) {
    const height = values[i]
    const color = sampleTexture(height, 0.5)
    pixels.push(color[0])
    pixels.push(color[1])
    pixels.push(color[2])
    pixels.push(height)
  }
  return pixels
}

let img
let cv
let cx
let loaded = false
function load() {
  img = document.getElementById('gradient') as HTMLImageElement;
  cv = document.createElement('canvas') as HTMLCanvasElement;
  cv.width = img.width;
  cv.height = img.height;
  cx = cv.getContext('2d') as CanvasRenderingContext2D
  cx.drawImage(img, 0, 0, img.width, img.height);
  loaded = true
}
function sampleTexture(u: number, v: number): number[] {
  if(!loaded) {
    load()
  }
  const pixelData = cx.getImageData(u * img.width, v * img.height, 1, 1).data
  return [pixelData[0] / 255, pixelData[1] / 255, pixelData[2] / 255]
}