

export function gridNoise(size: number): number[] {
  const heights = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {

      const sweepX = (x / size)
      const waveX = (Math.sin(sweepX * 10) + 1) / 2

      const sweepY = (y / size)
      const waveY = (Math.sin(sweepY * 10) + 1) / 2

      const wave = (waveX + waveY) / 2

      const random = Math.random() * 0.1 - 0.05

      let height = Math.min(Math.max(wave + random, 0), 1)

      heights.push(height)
    }
  }
  return heights
}
