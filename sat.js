// Formatted by StandardJS

const circleToCircle = (a, b) => {
  const d1 = Math.pow(b.x - a.x, 2) + Math.pow(a.y - b.y, 2)
  const d2 = Math.pow(a.radius + b.radius, 2)
  const overlap = d1 <= d2
  const offset = Math.sqrt(d2) - Math.sqrt(d1)
  const vector = normalizeVector({ x: a.x - b.x, y: a.y - b.y })
  const mtv = { x: vector.x * offset, y: vector.y * offset }
  return { overlap, mtv: overlap ? mtv : { x: 0, y: 0 } }
}

const circleToPolygon = (a, b) => {
  const v = b.vertices
  const normals = [...b.normals, ...getCircleAxes(a, b)]
  let mtv = { x: Infinity, y: Infinity }

  const overlap = normals.every(n => {
    const dot = dotProduct(n, { x: a.x, y: a.y })
    const p1 = { min: dot - a.radius, max: dot + a.radius }
    const p2 = getProjections(n, v)
    const c1 = p1.min < p2.max && p1.min > p2.min
    const c2 = p2.min < p1.max && p2.min > p1.min

    if (c1 || c2) {
      let m = Infinity
      if (c1) {
        m = p2.max - p1.min
      } else if (c2) {
        m = p2.min - p1.max
      }
      const vector = { x: n.x * m, y: n.y * m }
      if (magnitude(vector) < magnitude(mtv)) {
        mtv = vector // minimum translation vector
      }
    }

    return c1 || c2
  })

  return { overlap, mtv: overlap ? mtv : { x: 0, y: 0 } }
}

const polygonToCircle = (a, b) => {
  const { overlap, mtv } = circleToPolygon(b, a)
  return { overlap, mtv: { x: -mtv.x, y: -mtv.y } }
}

const polygonToPolygon = (a, b) => {
  const v1 = a.vertices
  const v2 = b.vertices
  const normals = [...a.normals, ...b.normals]
  let mtv = { x: Infinity, y: Infinity }

  const overlap = normals.every(n => {
    const p1 = getProjections(n, v1)
    const p2 = getProjections(n, v2)
    const c1 = p1.min < p2.max && p1.min > p2.min
    const c2 = p2.min < p1.max && p2.min > p1.min

    if (c1 || c2) {
      let m = Infinity
      if (c1) {
        m = p2.max - p1.min
      } else if (c2) {
        m = p2.min - p1.max
      }
      const vector = { x: n.x * m, y: n.y * m }
      if (magnitude(vector) < magnitude(mtv)) {
        mtv = vector // minimum translation vector
      }
    }

    return c1 || c2
  })

  return { overlap, mtv: overlap ? mtv : { x: 0, y: 0 } }
}
