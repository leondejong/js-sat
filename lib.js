// Formatted by StandardJS

const polygon = 'polygon'
const circle = 'circle'

const dotProduct = (v1, v2) => v1.x * v2.x + v1.y * v2.y

const magnitude = v => Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))

const angle = (v1, v2) =>
  Math.acos(dotProduct(v1, v2) / (magnitude(v1) * magnitude(v2)))

const normalizeVector = v => {
  m = magnitude(v)
  return m == 0 ? v : { x: v.x / m, y: v.y / m }
}

const normalVector = (v1, v2) => ({ x: -(v2.y - v1.y), y: v2.x - v1.x })

const getEdges = vertices =>
  vertices.reduce((a, v, i, l) => {
    const n = (i + 1) % l.length
    return [...a, { x: l[n].x - l[i].x, y: l[n].y - l[i].y }]
  }, [])

const getNormals = edges =>
  edges.reduce((a, v) => {
    return [...a, normalizeVector({ x: -v.y, y: v.x })]
  }, [])

const getProjections = (normal, vertices) =>
  Object.values(vertices).reduce(
    (projection, vertex) => {
      const dot = dotProduct(normal, vertex)
      return {
        ...projection,
        min: Math.min(projection.min, dot),
        max: Math.max(projection.max, dot)
      }
    },
    { min: Infinity, max: -Infinity }
  )

const getCircleAxes = (circle, polygon) => {
  const axes = []
  polygon.vertices.forEach((v, i, l) => {
    axes.push(normalizeVector({ x: v.x - circle.x, y: v.y - circle.y }))
  })
  return axes
}

const generateVertices = (x = 0, y = 0, n = 3, r = 30, a = 0) => {
  const v = []
  for (i = 0; i < n; i++) {
    v.push({
      x: Math.sin((Math.PI * 2 * i) / n + a) * r + x,
      y: Math.cos((Math.PI * 2 * i) / n + a) * r + y
    })
  }
  return v
}

const simpleCircle = (name, color, x, y, radius, angle) => ({
  type: circle,
  overlap: [],
  mtv: [],
  name,
  color,
  radius,
  angle,
  x,
  y
})

const simpleShape = (n, c, x, y, l, r, a) => {
  const v = generateVertices(x, y, l, r, a)
  return {
    type: polygon,
    vertices: v,
    name: n,
    color: c,
    length: l,
    radius: r,
    angle: a,
    x,
    y
  }
}

const complexShape = (n, c, x, y, l, r, a) => {
  const shape = simpleShape(n, c, x, y, l, r, a)
  const edges = getEdges(shape.vertices)
  const normals = getNormals(edges)
  return {
    ...shape,
    edges,
    normals
  }
}

const drawCircle = (ctx, circle, solid = false) => {
  if (solid) {
    ctx.fillStyle = circle.color || black
  } else {
    ctx.strokeStyle = circle.color || black
  }
  ctx.beginPath()
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI)
  if (solid) {
    ctx.fill()
  } else {
    ctx.stroke()
  }
}

const drawPolygon = (ctx, polygon, solid = false) => {
  if (solid) {
    ctx.fillStyle = polygon.color || black
  } else {
    ctx.strokeStyle = polygon.color || black
  }
  ctx.beginPath()
  polygon.vertices.forEach(v => ctx.lineTo(v.x, v.y))
  if (solid) {
    ctx.fill()
  } else {
    ctx.lineTo(polygon.vertices[0].x, polygon.vertices[0].y)
    ctx.stroke()
  }
}
