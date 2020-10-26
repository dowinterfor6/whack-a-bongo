import { gsap } from 'gsap';

const toggleChicken = (chicken, travelDist, popUpTime) => {
  const { x, y, z } = chicken.position;
  const animDuration = 0.5;

  gsap.to(chicken.position, {
    duration: animDuration,
    y: y + travelDist,
    ease: "expo.out"
  })
  
  window.setTimeout(() => {
    gsap.to(chicken.position, {
      duration: animDuration,
      y: y,
      ease: "expo.out"
    })
  }, popUpTime);

  window.setTimeout(() => {
    chicken.geometry.isHit = false;
  }, popUpTime + animDuration * 1000);
}

export default toggleChicken;