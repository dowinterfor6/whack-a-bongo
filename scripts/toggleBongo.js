import { gsap } from 'gsap';

const toggleBongo = (bongo, travelDist, popUpTime) => {
  const { x, y, z } = bongo.position;
  const animDuration = 0.5;
  bongo.visible = true;
  bongo.geometry.isHit = true;

  gsap.to(bongo.position, {
    duration: animDuration,
    y: y + travelDist,
    ease: "expo.out"
  }).then(() => {
    bongo.geometry.isHit = false;
  })

  // gsap.to(bongo.material, {
  //   duration: animDuration,
  //   opacity: 1,
  //   ease: "expo.out"
  // })
  
  window.setTimeout(() => {
    bongo.geometry.isHit = true;
    gsap.to(bongo.position, {
      duration: animDuration,
      y: y,
      ease: "expo.out"
    }).then(() => {
      bongo.visible = false;
    })

    // gsap.to(bongo.material, {
    //   duration: animDuration,
    //   opacity: 0,
    //   ease: "expo.out"
    // })
  }, popUpTime);

  // window.setTimeout(() => {
  //   bongo.geometry.isHit = false;
  // }, popUpTime + animDuration * 1000);
}

export default toggleBongo;