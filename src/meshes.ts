
const meshes = {}

meshes['tree'] = {}
meshes['tree']['positions'] = tree_positions()
meshes['tree']['colors'] = tree_colors()

export default meshes

function tree_positions() {
  const A = [-0.5, 0.35, -0.5]
  const B = [-0.5, 0.35, 0.5]
  const C = [0.5, 0.35, -0.5]
  const D = [0.5, 0.35, 0.5]
  const E = [0, 2.5, 0]

  const F = [-0.125, 0.5, 0.125]
  const G = [-0.125, 0.5, -0.125]
  const H = [0.125, 0.5, -0.125]
  const I = [0.125, 0.5, 0.125]

  const J = [-0.125, 0, 0.125]
  const K = [-0.125, 0, -0.125]
  const L = [0.125, 0, -0.125]
  const M = [0.125, 0, 0.125]
  const positions = [
    ...B, ...E, ...A,
    ...A, ...E, ...C,
    ...C, ...E, ...D,
    ...D, ...E, ...B,

    ...H, ...I, ...M,
    ...L, ...H, ...M,
    ...G, ...H, ...L,
    ...K, ...G, ...L,
    ...F, ...G, ...K,
    ...J, ...F, ...K,
    ...I, ...F, ...J,
    ...M, ...I, ...J,
  ]
  return positions
}

function tree_colors() {
  const green = [0.654, 0.804, 0.226]
  const brownFactor = 0.4;
  const brown = [0.824 * brownFactor, 0.706 * brownFactor, 0.549 * brownFactor]

  const A = green
  const B = green
  const C = green
  const D = green
  const E = green

  const F = brown
  const G = brown
  const H = brown
  const I = brown

  const J = brown
  const K = brown
  const L = brown
  const M = brown
  const positions = [
    ...B, ...E, ...A,
    ...A, ...E, ...C,
    ...C, ...E, ...D,
    ...D, ...E, ...B,

    ...H, ...I, ...M,
    ...L, ...H, ...M,
    ...G, ...H, ...L,
    ...K, ...G, ...L,
    ...F, ...G, ...K,
    ...J, ...F, ...K,
    ...I, ...F, ...J,
    ...M, ...I, ...J,
  ]
  return positions
}








