
export class GridTile {
  nodeNW: GridNode
  nodeNE: GridNode
  nodeSE: GridNode
  nodeSW: GridNode

  connect(nodeNW: GridNode, nodeNE: GridNode, nodeSE: GridNode, nodeSW: GridNode) {
    this.nodeNW = nodeNW
    this.nodeNE = nodeNE
    this.nodeSE = nodeSE
    this.nodeSW = nodeSW
  }

  get heightBounds(): number[] {
    let min = 99999999999
    let max = -99999999999
    if (this.nodeNW.data.height < min) {
      min = this.nodeNW.data.height
    } else if (this.nodeNW.data.height > max) {
      max = this.nodeNW.data.height
    }
    if (this.nodeNE.data.height < min) {
      min = this.nodeNE.data.height
    } else if (this.nodeNE.data.height > max) {
      max = this.nodeNE.data.height
    }
    if (this.nodeSE.data.height < min) {
      min = this.nodeSE.data.height
    } else if (this.nodeSE.data.height > max) {
      max = this.nodeSE.data.height
    }
    if (this.nodeSW.data.height < min) {
      min = this.nodeSW.data.height
    } else if (this.nodeSW.data.height > max) {
      max = this.nodeSW.data.height
    }
    return [min, max]
  }
}

export class GridNode {
  nodeN: GridNode
  nodeE: GridNode
  nodeS: GridNode
  nodeW: GridNode

  tileNW: GridTile
  tileNE: GridTile
  tileSE: GridTile
  tileSW: GridTile

  x: number
  y: number

  data: StepTerrainNodeData

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.data = new StepTerrainNodeData()
  }

  get neighbourCount(): number {
    let count = 0
    if (this.nodeN) {
      count++
    }
    if (this.nodeE) {
      count++
    }
    if (this.nodeS) {
      count++
    }
    if (this.nodeW) {
      count++
    }
    return count
  }

  connect(
    nodeN: GridNode,
    nodeE: GridNode,
    nodeS: GridNode,
    nodeW: GridNode,
    tileNW: GridTile,
    tileNE: GridTile,
    tileSE: GridTile,
    tileSW: GridTile,
  ) {
    this.nodeN = nodeN
    this.nodeE = nodeE
    this.nodeS = nodeS
    this.nodeW = nodeW

    this.tileNW = tileNW
    this.tileNE = tileNE
    this.tileSE = tileSE
    this.tileSW = tileSW
  }
}

export class StepTerrainNodeData {
  private _height: number = 0
  private _temperature: number = 23
  private _moisture: number = 34

  private _seed: number = 0

  constructor() {
    this._seed = Math.random()
  }

  get height(): number {
    return this._height
  }

  set height(height: number) {
    this._height = Math.round(height)
  }

  get color(): number[] {
    const dim = this._seed / 3
    const red = 0.48 - dim / 5
    const green = 0.90 - (((100 - this._temperature) / 100) * 0.40) - dim / 9
    const blue = 0.35 - dim / 5
    const color = [red, green, blue]
    return color
  }

  calculate() {
    this._temperature = 40 - (7 * this.height)
  }
}

export class StepTerrain {
  gridNodes: GridNode[]
  gridTiles: GridTile[]

  sideNodeCount: number

  constructor(sideNodeCount: number) {
    this.sideNodeCount = sideNodeCount
    this.initNodes()
    this.initTiles()
  }

  initNodes() {
    const nodes: GridNode[] = []

    // Init all nodes
    for (let y = 0; y < this.sideNodeCount; y++) {
      for (let x = 0; x < this.sideNodeCount; x++) {
        nodes.push(new GridNode(x, y))
      }
    }

    // Connect all nodes
    for (let y = 0; y < this.sideNodeCount; y++) {
      for (let x = 0; x < this.sideNodeCount; x++) {
        const node = nodes[y * this.sideNodeCount + x]

        const indexN = nodeIndexFromOffset(this.sideNodeCount, x, y, 0, 1)
        const indexE = nodeIndexFromOffset(this.sideNodeCount, x, y, 1, 0)
        const indexS = nodeIndexFromOffset(this.sideNodeCount, x, y, 0, -1)
        const indexW = nodeIndexFromOffset(this.sideNodeCount, x, y, -1, 0)

        const nodeN = nodes[indexN]
        const nodeE = nodes[indexE]
        const nodeS = nodes[indexS]
        const nodeW = nodes[indexW]

        node.nodeN = nodeN
        node.nodeE = nodeE
        node.nodeS = nodeS
        node.nodeW = nodeW
      }
    }

    this.gridNodes = nodes
  }

  initTiles() {
    const tiles: GridTile[] = []
    const sideTileCount = this.sideNodeCount - 1

    // Init all tiles
    for (let y = 0; y < sideTileCount; y++) {
      for (let x = 0; x < sideTileCount; x++) {
        tiles.push(new GridTile())
      }
    }

    // Connect nodes
    for (let y = 0; y < sideTileCount; y++) {
      for (let x = 0; x < sideTileCount; x++) {
        const tile = tiles[y * sideTileCount + x]
        tile.nodeNW = this.gridNodes[(y + 1) * this.sideNodeCount + x]
        tile.nodeNE = this.gridNodes[(y + 1) * this.sideNodeCount + x + 1]
        tile.nodeSE = this.gridNodes[(y) * this.sideNodeCount + x + 1]
        tile.nodeSW = this.gridNodes[(y) * this.sideNodeCount + x]

        tile.nodeNW.tileSE = tile
        tile.nodeNE.tileSW = tile
        tile.nodeSE.tileNW = tile
        tile.nodeSW.tileNE = tile
      }
    }

    this.gridTiles = tiles
  }

  calculate() {
    this.gridNodes.forEach(node => node.data.calculate())
  }
}

function nodeIndexFromOffset(
  sideNodeCount: number,
  xStart: number,
  yStart: number,
  xOffset: number,
  yOffset: number,
): number | null {
  const x2 = xStart + xOffset
  const y2 = yStart + yOffset
  if (x2 < 0 || x2 >= sideNodeCount || y2 < 0 || y2 >= sideNodeCount) {
    return null
  }
  return x2 + y2 * sideNodeCount
}

/* Legacy */
export function getGridIndexFromOffset(
  size: number,
  x0: number,
  y0: number,
  offsetX: number,
  offsetY: number,
): number | null {
  const x2 = x0 + offsetX
  const y2 = y0 + offsetY
  if (x2 < 0 || x2 >= size || y2 < 0 || y2 >= size) {
    return null
  }
  return x2 + y2 * size
}
