// Formatted by StandardJS

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const width = canvas.width
const height = canvas.height

const p2p = 'p2p' // polygon to polygon
const p2c = 'p2c' // polygon to circle
const c2c = 'c2c' // circle to circle
const c2p = 'c2p' // circle to polygon
const satOptions = [p2p, p2c, c2c, c2p]
const polyOptions = [3, 4, 5, 6]

const speed = 5
const torque = 0.05

const keys = {}
const up = 69 // e
const left = 83 // s
const down = 68 // d
const right = 70 // f
const rotateLeft = 74 // j
const rotateRight = 76 // l
const increase = 73 // i
const decrease = 75 // k
const mode = 77 // m
const poly = 80 // p

const polygons = []
const circles = []
const colors = []

const transparent = 'rgba(0, 0, 0, 0)'
const black = 'rgba(0, 0, 0, 1)'
const white = 'rgba(255, 255, 255, 1)'
const dark = 'rgba(31, 31, 31, 1)'
const light = 'rgba(239, 239, 239, 1)'
const red = 'rgba(255, 0, 0, 1)'
const green = 'rgba(0, 191, 0, 1)'
const blue = 'rgba(0, 0, 255, 1)'

let rotation = 0
let size = 100
let x = 200
let y = 400

let satIndex = 0
let satType = satOptions[satIndex]
let polyIndex = 0
let polyType = polyOptions[polyIndex]

const updateProperties = () => {
  const hd = !!keys[right] - !!keys[left]
  const vd = !!keys[down] - !!keys[up]
  const rd = !!keys[rotateLeft] - !!keys[rotateRight]
  const sd = !!keys[increase] - !!keys[decrease]
  rotation = (rotation + rd * torque) % (Math.PI * 2)
  size += sd * speed
  x += hd * speed
  y += vd * speed
}

const updateColors = overlap => {
  colors[0] = overlap ? red : black
  colors[1] = overlap ? black : black
  colors[2] = overlap ? blue : black
}

const updatePolygonToPolygon = () => {
  polygons[0] = complexShape('p1', colors[0], x, y, polyType, size, rotation)
  polygons[1] = complexShape('p2', colors[1], width / 2, height / 2, 4, 100, 0)
  const { overlap, mtv } = polygonToPolygon(polygons[0], polygons[1])
  const sx = x + mtv.x
  const sy = y + mtv.y
  updateColors(overlap)
  polygons[2] = complexShape('p3', colors[2], sx, sy, polyType, size, rotation)
}

const updatePolygonToCircle = () => {
  polygons[0] = complexShape('p1', colors[0], x, y, polyType, size, rotation)
  circles[0] = simpleCircle('c1', colors[1], width / 2, height / 2, 80)
  const { overlap, mtv } = polygonToCircle(polygons[0], circles[0])
  const sx = x + mtv.x
  const sy = y + mtv.y
  updateColors(overlap)
  polygons[1] = complexShape('p2', colors[2], sx, sy, polyType, size, rotation)
}

const updateCircleToCircle = () => {
  const radius = Math.abs(size - 20)
  circles[0] = simpleCircle('c1', colors[0], x, y, radius)
  circles[1] = simpleCircle('c2', colors[1], width / 2, height / 2, 80)
  const { overlap, mtv } = circleToCircle(circles[0], circles[1])
  updateColors(overlap)
  circles[2] = simpleCircle('c3', colors[2], x + mtv.x, y + mtv.y, radius)
}

const updateCircleToPolygon = () => {
  const radius = Math.abs(size - 20)
  const sw = width / 2
  const sh = height / 2
  circles[0] = simpleCircle('c1', colors[0], x, y, radius)
  polygons[0] = complexShape('p1', colors[1], sw, sh, polyType, 100, 0)
  const { overlap, mtv } = circleToPolygon(circles[0], polygons[0])
  updateColors(overlap)
  circles[1] = simpleCircle('2', colors[2], x + mtv.x, y + mtv.y, radius)
}

const satFunc = {
  [p2p]: updatePolygonToPolygon,
  [p2c]: updatePolygonToCircle,
  [c2c]: updateCircleToCircle,
  [c2p]: updateCircleToPolygon
}

const update = () => {
  updateProperties()
  satFunc[satType]()
}

const renderText = () => {
  const t = 480
  const l = width - 290
  const r = width - 160
  const s = 20

  ctx.fillStyle = dark
  ctx.font = '12px monospace'

  switch (satType) {
    case p2p:
      ctx.fillText('Mode: Polygon to Polygon', 50, 50)
      break
    case p2c:
      ctx.fillText('Mode: Polygon to Circle', 50, 50)
      break
    case c2c:
      ctx.fillText('Mode: Circle to Circle', 50, 50)
      break
    case c2p:
      ctx.fillText('Mode: Circle to Polygon', 50, 50)
      break
    default:
      ctx.fillText('Mode: Polygon to Polygon', 50, 50)
  }

  ctx.fillText('Polygon Type:   ' + polyType, 50, 50 + s * 1)
  ctx.fillText('Change Mode:    M', 50, 50 + s * 2)
  ctx.fillText('Change Polygon: P', 50, 50 + s * 3)

  ctx.fillText('Move Up:    E', l, t + s * 0)
  ctx.fillText('Move Left:  S', l, t + s * 1)
  ctx.fillText('Move Down:  D', l, t + s * 2)
  ctx.fillText('Move Right: F', l, t + s * 3)

  ctx.fillText('Rotate Left:   J', r, t + s * 0)
  ctx.fillText('Rotate Right:  L', r, t + s * 1)
  ctx.fillText('Increase Size: I', r, t + s * 2)
  ctx.fillText('Decrease Size: K', r, t + s * 3)
}

const render = () => {
  ctx.fillStyle = light
  ctx.fillRect(0, 0, width, height)

  renderText()

  if (satType === p2p) {
    polygons.forEach(p => drawPolygon(ctx, p))
  }
  if (satType === c2c) {
    circles.forEach(c => drawCircle(ctx, c))
  }
  if (satType === p2c) {
    drawPolygon(ctx, polygons[0])
    drawCircle(ctx, circles[0])
    drawPolygon(ctx, polygons[1])
  }
  if (satType === c2p) {
    drawCircle(ctx, circles[0])
    drawPolygon(ctx, polygons[0])
    drawCircle(ctx, circles[1])
  }
}

const loop = () => {
  requestAnimationFrame(loop)
  update()
  render()
}

const main = () => {
  document.onkeydown = function (e) {
    keys[e.which] = true
    if (e.which == mode) {
      satIndex = (satIndex + 1) % satOptions.length
      satType = satOptions[satIndex]
    }
    if (e.which == poly) {
      polyIndex = (polyIndex + 1) % polyOptions.length
      polyType = polyOptions[polyIndex]
    }
  }
  document.onkeyup = function (e) {
    keys[e.which] = false
  }
  window.onload = () => requestAnimationFrame(loop)
}
