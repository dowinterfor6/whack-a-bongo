import { gsap } from 'gsap';

const toggleBongo = (bongo, travelDist, popUpTime) => {
  const { x, y, z } = bongo.position;
  const animDuration = 0.5;

  gsap.to(bongo.position, {
    duration: animDuration,
    y: y + travelDist,
    ease: "expo.out"
  })

  gsap.to(bongo.material, {
    duration: animDuration,
    opacity: 1,
    ease: "expo.out"
  })
  
  window.setTimeout(() => {
    gsap.to(bongo.position, {
      duration: animDuration,
      y: y,
      ease: "expo.out"
    })

    gsap.to(bongo.material, {
      duration: animDuration,
      opacity: 0,
      ease: "expo.out"
    })
  }, popUpTime);

  window.setTimeout(() => {
    bongo.geometry.isHit = false;
  }, popUpTime + animDuration * 1000);
}

export default toggleBongo;