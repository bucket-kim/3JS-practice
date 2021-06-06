import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

// texture from image
// const image = new Image();
// image.src = "/img/color.jpg";
// const texture = new THREE.Texture(image);
// image.onload = () => {
//   texture.needsUpdate = true;
// };

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("Starting");
};
loadingManager.onLoad = () => {
  console.log("Loading");
};
loadingManager.onProgress = () => {
  console.log("Progressing");
};
loadingManager.onError = () => {
  console.log("Failed");
};

const textureLoader = new THREE.TextureLoader(loadingManager);

const colorTexture = textureLoader.load("/img/color.jpg");
const AOTexture = textureLoader.load("/img/ambientOcclusion.jpg");
const alphaTexture = textureLoader.load("/img/alpha.jpg");
const heightTexture = textureLoader.load("/img/height.png");
const metalnessTexture = textureLoader.load("/img/metalness.jpg");
const roughnessTexture = textureLoader.load("/img/roughness.jpg");
const normalTexture = textureLoader.load("/img/normal.jpg");

// size control
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// cursor
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Dat GUI
const gui = new dat.GUI({ closed: true, width: 400 });

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const group = new THREE.Group();
group.scale.set(0.5, 0.5, 0.5);
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: false,
  })
);
// group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: false,
  })
);
cube2.position.x = -1.5;
// group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: false,
  })
);
cube3.position.x = 1.5;
// group.add(cube3);

const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
};

// scene.add(group, material);

// gui add features
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
gui.add(mesh, "visible");
gui.add(material, "wireframe");
gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});
gui.add(parameters, "spin");

// rotation

const axesHelper = new THREE.AxesHelper(0.5);
// scene.add(axesHelper);
/**
 * Sizes
 */

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 2.5;
// camera.position.y = 0.5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// camera.lookAt(group.position);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

// Timestamp
const clock = new THREE.Clock();

// animation

// gsap animation
// gsap.to(group.position, { duration: 1, x: 2, ease: "bounce" });
// gsap.to(group.position, { duration: 1, delay: 1, x: 0, ease: "bounce" });

// manual animation
const tick = () => {
  //   const elapseTime = clock.getElapsedTime();

  //   // group.rotation.y += 0.01;
  //   // group.rotation.y = elapseTime;
  //   camera.position.y = Math.sin(elapseTime);
  //   camera.position.x = Math.cos(elapseTime);
  //   camera.lookAt(group.position);

  // camera animation update

  // v1
  // camera.position.x = cursor.x * -1;
  // camera.position.y = cursor.y * 1;

  // v2
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(group.position);

  // update controls
  controls.update();

  //   // rendering
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update render
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// double click action

// window.addEventListener("dblclick", () => {
//   const fullscreenElement =
//     document.fullscreenElement || document.webkitFullscreenElement;

//   if (!document.fullscreenElement) {
//     if (canvas.requestFullscreen) {
//       canvas.requestFullscreen();
//     } else if (canvas.webkitRequestFullscreen) {
//       canvas.webkitRequestFullscreen();
//     }
//   } else {
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if (document.webkitExitFullscreen) {
//       document.webkitExitFullscreen();
//     }
//   }
// });

tick();
