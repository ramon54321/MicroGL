import Scene from './Scene'
import { createShaderProgram } from '../shaders'
import { mat4, mat2, vec2, vec3 } from 'gl-matrix'
import { WorldState } from '..'
import { StepTerrain, GridNode } from '../gridUtilities'
import { calculateNormals } from '../mesh'
import { average } from '../math';
import { Camera } from '../rendering';

export default class StepTerrainScene extends Scene {
  gl: WebGL2RenderingContext

  framebuffer: WebGLFramebuffer
  shaderProgram: WebGLProgram

  vertexArrayObject: WebGLVertexArrayObject

  nodeOrderList: GridNode[] = []

  vertexPositions: number[]
  vertexNormals: number[]
  vertexColors: number[]

  vertexPositionsBuffer: WebGLBuffer
  vertexNormalsBuffer: WebGLBuffer
  vertexColorsBuffer: WebGLBuffer

  u_ViewMatrixLocation: WebGLUniformLocation
  u_ProjectionMatrixLocation: WebGLUniformLocation
  a_PositionLocation: number
  a_NormalLocation: number
  a_ColorLocation: number

  stepTerrain: StepTerrain
  terrainHeightSize: number = 0.25

  camera: Camera

  constructor(
    worldState: WorldState,
    gl: WebGL2RenderingContext,
    framebuffer: WebGLFramebuffer,
    camera: Camera,
    stepTerrain: StepTerrain,
  ) {
    super(worldState)
    this.gl = gl
    this.framebuffer = framebuffer
    this.camera = camera
    this.stepTerrain = stepTerrain

    this.init()
  }

  init() {
    // Shader Programs
    const vertexShaderSource = (document.getElementById('shader-vertex-stepterrain') as any).text
    const fragmentShaderSource = (document.getElementById('shader-fragment-stepterrain') as any)
      .text
    this.shaderProgram = createShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource)

    // Uniform and Attribute Locations
    this.u_ViewMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_ViewMatrix')
    this.u_ProjectionMatrixLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      'u_ProjectionMatrix',
    )
    this.a_PositionLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_Position')
    this.a_NormalLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_Normal')
    this.a_ColorLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_Color')

    this.vertexArrayObject = this.gl.createVertexArray()
    this.gl.bindVertexArray(this.vertexArrayObject)

    // Attributes
    this.vertexPositions = this.generateVertexPositions()
    this.vertexPositionsBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionsBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertexPositions),
      this.gl.STATIC_DRAW,
    )
    this.gl.vertexAttribPointer(this.a_PositionLocation, 3, this.gl.FLOAT, false, 0, 0)

    this.vertexNormals = this.generateVertexNormals()
    this.vertexNormalsBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalsBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertexNormals),
      this.gl.STATIC_DRAW,
    )
    this.gl.vertexAttribPointer(this.a_NormalLocation, 3, this.gl.FLOAT, false, 0, 0)

    this.vertexColors = this.generateVertexColors()
    this.vertexColorsBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorsBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertexColors),
      this.gl.STATIC_DRAW,
    )
    this.gl.vertexAttribPointer(this.a_ColorLocation, 3, this.gl.FLOAT, false, 0, 0)
  }

  generateVertexPositions(): number[] {
    let gridTileVertexPositions = []
    // for each tile, create 2 triangles
    for (let i = 0; i < this.stepTerrain.gridTiles.length; i++) {
      const tile = this.stepTerrain.gridTiles[i]
      const heightNW = tile.nodeNW.data.height
      const heightNE = tile.nodeNE.data.height
      const heightSE = tile.nodeSE.data.height
      const heightSW = tile.nodeSW.data.height
      const bounds = tile.heightBounds
      const spread = Math.abs(bounds[0] - bounds[1])
      if (spread > 2) {
        throw new Error(
          `Terrain has too steep of an incline with min of ${bounds[0]} and max of ${bounds[1]}`,
        )
      }

      let highPoint = bounds[0]
      let midPoint = bounds[0]
      let lowPoint = bounds[0]

      if(spread === 1) {
        highPoint += 1
      } else if (spread === 2) {
        highPoint += 2
        midPoint += 1
      }

      const isHighNW = (heightNW === highPoint ? true : false)
      const isHighNE = (heightNE === highPoint ? true : false)
      const isHighSE = (heightSE === highPoint ? true : false)
      const isHighSW = (heightSW === highPoint ? true : false)

      const highCount =
        (isHighNW ? 1 : 0) +
        (isHighNE ? 1 : 0) +
        (isHighSE ? 1 : 0) +
        (isHighSW ? 1 : 0)

      const NW = [tile.nodeNW.x, heightNW * this.terrainHeightSize, -tile.nodeNW.y]
      const NE = [tile.nodeNE.x, heightNE * this.terrainHeightSize, -tile.nodeNE.y]
      const SE = [tile.nodeSE.x, heightSE * this.terrainHeightSize, -tile.nodeSE.y]
      const SW = [tile.nodeSW.x, heightSW * this.terrainHeightSize, -tile.nodeSW.y]

      const NWSE = [...SE, ...NE, ...NW, ...SW, ...SE, ...NW]
      const NESW = [...NW, ...SW, ...NE, ...SW, ...SE, ...NE]

      let verticies = []

      const pushNWSE = () => {
        verticies = NWSE
        this.nodeOrderList.push(tile.nodeSE)
        this.nodeOrderList.push(tile.nodeNE)
        this.nodeOrderList.push(tile.nodeNW)
        this.nodeOrderList.push(tile.nodeSW)
        this.nodeOrderList.push(tile.nodeSE)
        this.nodeOrderList.push(tile.nodeNW)
      }
      const pushNESW = () => {
        verticies = NESW
        this.nodeOrderList.push(tile.nodeNW)
        this.nodeOrderList.push(tile.nodeSW)
        this.nodeOrderList.push(tile.nodeNE)
        this.nodeOrderList.push(tile.nodeSW)
        this.nodeOrderList.push(tile.nodeSE)
        this.nodeOrderList.push(tile.nodeNE)
      }
      
      if (highCount === 4 || highCount === 0) { // Flat
        pushNWSE()
      } else if (highCount === 1) {
        if(isHighNE || isHighSW) {
          pushNWSE()
        } else {
          pushNESW()
        }
      } else if (highCount === 2) {
        if(isHighNE && isHighSW) {
          pushNESW()
        } else if (isHighNW && isHighSE) {
          pushNWSE()
        } else {
          pushNWSE()
        }
      } else if (highCount === 3) {
        if(!isHighNW || !isHighSE) {
          pushNESW()
        } else {
          pushNWSE()
        }
      }

      // if (false /*heightNW === heightSE*/) {
      //   /**
      //    * NW -> NE -> SE
      //    * NW -> SE -> SW
      //    */
      //   verticies = [...SE, ...NE, ...NW, ...SW, ...SE, ...NW]
      // } else {
      //   /**
      //    * NE -> SW -> NW
      //    * NE -> SE -> SW
      //    */
      //   verticies = [...NW, ...SW, ...NE, ...SW, ...SE, ...NE]
      // }
      gridTileVertexPositions = gridTileVertexPositions.concat(verticies)
    }
    return gridTileVertexPositions
  }

  generateVertexNormals(): number[] {
    return calculateNormals(this.vertexPositions)
  }

  generateVertexColors(): number[] {
    const vertexColors = []
    for(let i = 0; i < this.nodeOrderList.length; i+=3) {
      const color0 =  this.nodeOrderList[i].data.color
      const color1 =  this.nodeOrderList[i+1].data.color
      const color2 =  this.nodeOrderList[i+2].data.color
      const rAv = average([color0[0], color1[0], color2[0]])
      const gAv = average([color0[1], color1[1], color2[1]])
      const bAv = average([color0[2], color1[2], color2[2]])
      const color = [rAv, gAv, bAv]
      vertexColors.push(color[0])
      vertexColors.push(color[1])
      vertexColors.push(color[2])
      vertexColors.push(color[0])
      vertexColors.push(color[1])
      vertexColors.push(color[2])
      vertexColors.push(color[0])
      vertexColors.push(color[1])
      vertexColors.push(color[2])
    }
    return vertexColors
  }

  render() {
    // Update
    this.camera.update()

    // Render
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)

    // Set shader program and uniforms
    this.gl.useProgram(this.shaderProgram)

    // Upload Uniforms
    this.gl.uniformMatrix4fv(this.u_ViewMatrixLocation, false, this.camera.viewMatrix)
    this.gl.uniformMatrix4fv(this.u_ProjectionMatrixLocation, false, this.camera.projectionMatrix)

    this.gl.bindVertexArray(this.vertexArrayObject)

    // Set buffers
    //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionsBuffer)
    this.gl.enableVertexAttribArray(this.a_PositionLocation)
    //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalsBuffer)
    this.gl.enableVertexAttribArray(this.a_NormalLocation)
    //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorsBuffer)
    this.gl.enableVertexAttribArray(this.a_ColorLocation)

    // Draw with current state
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexPositions.length / 3)

    this.gl.disableVertexAttribArray(this.a_PositionLocation)
    this.gl.disableVertexAttribArray(this.a_NormalLocation)
    this.gl.disableVertexAttribArray(this.a_ColorLocation)
  }
}
