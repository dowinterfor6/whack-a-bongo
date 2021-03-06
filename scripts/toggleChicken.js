import { gsap } from 'gsap';

const toggleChicken = (chicken, travelDist, popUpTime) => {
  const { x, y, z } = chicken.position;
  const animDuration = 0.5;
  chicken.visible = true;
  chicken.geometry.isHit = true;

  gsap.to(chicken.position, {
    duration: animDuration,
    y: y + travelDist,
    ease: "expo.out"
  }).then(() => {
    chicken.geometry.isHit = false;
  })

  // gsap.to(chicken.material, {
  //   duration: animDuration,
  //   opacity: 1,
  //   ease: "expo.out"
  // })
  
  window.setTimeout(() => {
    chicken.geometry.isHit = true;
    gsap.to(chicken.position, {
      duration: animDuration,
      y: y,
      ease: "expo.out"
    }).then(() => {
      chicken.visible = false;
    })

    // gsap.to(chicken.material, {
    //   duration: animDuration,
    //   opacity: 0,
    //   ease: "expo.out"
    // })
  }, popUpTime);

  // window.setTimeout(() => {
  //   chicken.geometry.isHit = false;
  // }, popUpTime + animDuration * 1000);
}

export default toggleChicken;