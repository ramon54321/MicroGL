import { normalized } from './vec';

export function createGridVerticies(size: number) {
  const yStart = (size - 1) / 2
  const xStart = -yStart
  const verticies = []
  // const heights = gridNoise(size)
  // let count = 0
  for (let y = yStart; y >= -yStart; y--) {
    for (let x = xStart; x <= -xStart; x++) {
      verticies.push(x)
      verticies.push(0)
      verticies.push(y)
      // count++
    }
  }
  return verticies
}

export function createGridIndexes(size: number) {
  const trianglesPerSide = size - 1
  const indexes = []
  for (let y = 0; y < trianglesPerSide; y++) {
    for (let x = 0; x < trianglesPerSide; x++) {
      const base = x + y * size
      indexes.push(base)
      indexes.push(base + (size + 1))
      indexes.push(base + size)
      indexes.push(base)
      indexes.push(base + 1)
      indexes.push(base + (size + 1))
    }
  }
  return indexes
}

export function calculateNormals(vertexPositions: number[], vertexIndicies: number[]): number[] {
  /**
   * For every 3 indicies, make a face
   * For each face, calculate normal
   */
  const vertexIndexToFaceMap = []
  // console.log("VertexPos:", JSON.stringify(vertexPositions, null, 4))
  for (let vertexIndexIndex = 0; vertexIndexIndex < vertexIndicies.length; vertexIndexIndex+=3) {
    const vertexAIndex = vertexIndicies[vertexIndexIndex]
    const vertexBIndex = vertexIndicies[vertexIndexIndex + 1]
    const vertexCIndex = vertexIndicies[vertexIndexIndex + 2]
    // console.log("vertexAIndex", vertexAIndex)
    // console.log("vertexBIndex", vertexBIndex)
    // console.log("vertexCIndex", vertexCIndex)
    const vertexAPosition = [
      vertexPositions[(vertexAIndex * 3)],
      vertexPositions[(vertexAIndex * 3) + 1],
      vertexPositions[(vertexAIndex * 3) + 2],
    ]
    const vertexBPosition = [
      vertexPositions[(vertexBIndex * 3)],
      vertexPositions[(vertexBIndex * 3) + 1],
      vertexPositions[(vertexBIndex * 3) + 2],
    ]
    const vertexCPosition = [
      vertexPositions[(vertexCIndex * 3)],
      vertexPositions[(vertexCIndex * 3)  + 1],
      vertexPositions[(vertexCIndex * 3)  + 2],
    ]
    const edgeA = [
      vertexBPosition[0] - vertexAPosition[0],
      vertexBPosition[1] - vertexAPosition[1],
      vertexBPosition[2] - vertexAPosition[2],
    ]
    const edgeB = [
      vertexCPosition[0] - vertexAPosition[0],
      vertexCPosition[1] - vertexAPosition[1],
      vertexCPosition[2] - vertexAPosition[2],
    ]
    // console.log("A:", JSON.stringify(vertexAPosition, null, 4))
    // console.log("B:", JSON.stringify(vertexBPosition, null, 4))
    // console.log("C:", JSON.stringify(vertexCPosition, null, 4))
    // console.log("edgeA", JSON.stringify(edgeA, null, 4))
    // console.log("edgeB", JSON.stringify(edgeB, null, 4))
    const faceNormalX = edgeA[1] * edgeB[2] - edgeA[2] * edgeB[1]
    const faceNormalY = edgeA[2] * edgeB[0] - edgeA[0] * edgeB[2]
    const faceNormalZ = edgeA[0] * edgeB[1] - edgeA[1] * edgeB[0]
    const faceNormal = [faceNormalX, faceNormalY, faceNormalZ]
    // console.log("Face Normal:", JSON.stringify(faceNormal, null, 4))

    if(vertexIndexToFaceMap[vertexAIndex] === undefined) {
      vertexIndexToFaceMap[vertexAIndex] = []
    }
    if(vertexIndexToFaceMap[vertexBIndex] === undefined) {
      vertexIndexToFaceMap[vertexBIndex] = []
    }
    if(vertexIndexToFaceMap[vertexCIndex] === undefined) {
      vertexIndexToFaceMap[vertexCIndex] = []
    }
    vertexIndexToFaceMap[vertexAIndex].push(faceNormal)
    vertexIndexToFaceMap[vertexBIndex].push(faceNormal)
    vertexIndexToFaceMap[vertexCIndex].push(faceNormal)
  }
  // console.log(JSON.stringify(vertexIndexToFaceMap, null, 4))
  const vertexNormals = []
  for (let index = 0; index < vertexPositions.length / 3; index++) {
    const faceNormalsAtVertex = vertexIndexToFaceMap[index];
    const vertexNormal = [0, 0, 0]
    for (let face = 0; face < faceNormalsAtVertex.length; face++) {
      const faceNormalX = faceNormalsAtVertex[face][0]
      const faceNormalY = faceNormalsAtVertex[face][1]
      const faceNormalZ = faceNormalsAtVertex[face][2]
      vertexNormal[0] += faceNormalX
      vertexNormal[1] += faceNormalY
      vertexNormal[2] += faceNormalZ
    }
    //console.log("vertexNormal", JSON.stringify(vertexNormal, null, 4))
    const normalizedVertexNormal = normalized(vertexNormal)
    vertexNormals.push(normalizedVertexNormal[0])
    vertexNormals.push(normalizedVertexNormal[1])
    vertexNormals.push(normalizedVertexNormal[2])
  }
  // console.log(JSON.stringify(vertexNormals, null, 4))
  return vertexNormals
}
