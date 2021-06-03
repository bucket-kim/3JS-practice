import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const group = new THREE.Group();
group.scale.set(0.5, 0.5, 0.5);
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.x = -2;
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 2;
group.add(cube3);

// rotation

const axesHelper = new THREE.AxesHelper(0.5);
scene.add(axesHelper);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.y = 0.5;
scene.add(camera);

// camera.lookAt(group.position);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Timestamp
const clock = new THREE.Clock();

// animation

// gsap animation
gsap.to(group.position, { duration: 1, x: 2, ease: "bounce" });
gsap.to(group.position, { duration: 1, delay: 1, x: 0, ease: "bounce" });

// manual animation
const tick = () => {
  //   const elapseTime = clock.getElapsedTime();

  //   // group.rotation.y += 0.01;
  //   // group.rotation.y = elapseTime;
  //   camera.position.y = Math.sin(elapseTime);
  //   camera.position.x = Math.cos(elapseTime);
  //   camera.lookAt(group.position);

  //   // rendering
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
