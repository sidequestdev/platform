export const circleRectangleIntersects = (
  circleX: number,
  circleY: number,
  radius: number,
  rectangleX: number,
  rectangleY: number,
  rectangleWidth: number,
  rectangleHeight: number,
) => {
  // temporary variables to set edges for testing
  let testX = circleX;
  let testY = circleY;

  // which edge is closest?

  if (circleX < rectangleX) {
    // left edge
    testX = rectangleX;
  } else if (circleX > rectangleX + rectangleWidth) {
    // right edge
    testX = rectangleX + rectangleWidth;
  }

  if (circleY < rectangleY) {
    // top edge
    testY = rectangleY;
  } else if (circleY > rectangleY + rectangleHeight) {
    // bottom edge
    testY = rectangleY + rectangleHeight;
  }

  // get distance from closest edges
  const distX = circleX - testX;
  const distY = circleY - testY;
  const distance = Math.sqrt(distX * distX + distY * distY);

  return {
    x: testX,
    y: testY,
    width: distX,
    height: distY,
    distance,
    intersects: distance <= radius,
  };
};
