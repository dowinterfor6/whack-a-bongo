const toggleBongo = (bongo, travelDist, popUpTime) => {
  const { x, y, z } = bongo.position;
  bongo.position.set(x, y + travelDist, z);
  window.setTimeout(() => {
    bongo.position.set(x, y, z);
  }, popUpTime);
}

export default toggleBongo;