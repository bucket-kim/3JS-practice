import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

// global value
const sizes = {
  width: window.innerWidth,
  height: window.innerWidth,
};

const canvas = document.querySelector("canvas.webgl");

const gui = new dat.GUI();

const textureLoader = new THREE.TextureLoader();

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Scene
const scene = new THREE.Scene();

// object
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), material);
cube.position.y = 0.5;
scene.add(cube);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 20, 20), material);
sphere.position.y = 0.5;
sphere.position.x = 1;
scene.add(sphere);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.2, 0.15, 16, 100),
  material
);

torus.position.y = 0.5;
torus.position.x = -1;
scene.add(torus);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -1.5;
plane.position.y = -1;
scene.add(plane);

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);
directionalLight.position.set(1, 0.25, 0);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -0.75;
scene.add(spotLight);
scene.add(spotLight.target);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
window.requestAnimationFrame(() => {
  spotLightHelper.update();
});

// sizes
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width / sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 3;
scene.add(camera);

// controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

// gui controls
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

// render
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// tick animation
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  control.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
