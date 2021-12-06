# Separating Axis Theorem

The SAT states that two convex objects do not overlap if there exists a line (called an axis) onto which the two objects' projections do not overlap.

Disclaimer: obviously this is only a quick prototype/poc just for the fun of it.

[Live version.](https://leondejong.com/application/sat)

## SAT steps in general
- Define or generate the vertex vectors of the tested polygons;
- Calculate the edge vectors of the polygons, based on the vertices;
- Calculate the normal vectors of the polygons (the vectors perpendicular to the edges);
- Project the vertices of the polygons onto the normal vectors;
- Select the min and max projection values of the tested polygons;
- Compare the min and max projection values of the polygons to check if these overlap;
- If the all projections on all normal vectors overlap, a separating axis can not be drawn between the polygons, and the objects collide;
- Optionally calculate the MTV (minimum translation vector) to be able to compensate for the overlap.

## Possible optimizations
- Bail out as soon as one of the projections doesn't overlap (the `Array.prototype.every` function used here already takes care of that);
- Regular polygons with an even amount of vertices only need half of their projections checked;
- Use a quick precheck on the bounding box of each polygon to filter out cases that could not possibly overlap;
- Concave polygons could potentially be tested by splitting these up into convex polygons first.

[Collision detection.](https://github.com/leondejong/js-collision-detection)
