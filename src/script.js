import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

// Scene
const scene = new THREE.Scene();

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
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environtmentTexture = cubeTextureLoader.load([
  "/environmentMaps/1/nx.jpg",
  "/environmentMaps/1/ny.jpg",
  "/environmentMaps/1/nz.jpg",
  "/environmentMaps/1/px.jpg",
  "/environmentMaps/1/py.jpg",
  "/environmentMaps/1/pz.jpg",
]);

const textureLoader = new THREE.TextureLoader(loadingManager);

const colorTexture = textureLoader.load("/img/color.jpg");
const AOTexture = textureLoader.load("/img/ambientOcclusion.jpg");
const alphaTexture = textureLoader.load("/img/alpha.jpg");
const heightTexture = textureLoader.load("/img/height.png");
const metalnessTexture = textureLoader.load("/img/metalness.jpg");
const roughnessTexture = textureLoader.load("/img/roughness.jpg");
const normalTexture = textureLoader.load("/img/normal.jpg");

const matCapTexture = textureLoader.load("/matcaps/7.png");

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

// scene.add(pointLight);

// creating fonts
const fontLoader = new THREE.FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log("loaded");
  const textGeometry = new THREE.TextBufferGeometry("Hello!\n Welcome!", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });
  textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -textGeometry.boundingBox.max.x * 0.5,
  //   -textGeometry.boundingBox.max.y * 0.5,
  //   -textGeometry.boundingBox.max.z * 0.5
  // );
  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 20, 45);
  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
});

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

// Dat GUI
const gui = new dat.GUI({ closed: true, width: 400 });

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
const material = new THREE.MeshStandardMaterial();

geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
);
// mapping
material.map = colorTexture;
material.aoMap = AOTexture;
material.aoMapIntensity = 1;
material.displacementMap = heightTexture;
material.displacementScale = 0.05;
material.metalnessMap = metalnessTexture;
material.roughnessMap = roughnessTexture;
material.normalMap = normalTexture;
material.normalScale.set(0.5, 0.5);
material.transparent = true;
material.alphaMap = alphaTexture;

// HDRI map
material.envMap = environtmentTexture;

const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

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
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

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
camera.position.y = 1;
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
