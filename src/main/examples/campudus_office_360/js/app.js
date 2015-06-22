var THREE = require('threejs');
require('../../../../vendor/threejs/StereoEffect');
require('../../../../vendor/threejs/DeviceOrientationControls');
require('../../../../vendor/threejs/OrbitControls');
var keepAwake = require('../../../js/keepAwake');
var camera, scene, renderer;
var effect, controls;
var element, container;
var sphere, bike;

var clock = new THREE.Clock();

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('example');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
  camera.position.set(0, 0, 0);
  scene.add(camera);

  controls = new THREE.OrbitControls(camera, element);
  controls.rotateUp(Math.PI / 4);
  controls.target.set(
    camera.position.x + 0.1,
    camera.position.y,
    camera.position.z
  );
  controls.noZoom = true;
  controls.noPan = true;

  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }

  window.addEventListener('deviceorientation', setOrientationControls, true);


  //var light = new THREE.HemisphereLight(0x777777, 0x111111, 0.4);
  //scene.add(light);

  var ambient = new THREE.AmbientLight( 0x888888 );
  scene.add( ambient );

  // creation of a big sphere geometry
  var sphere = new THREE.SphereGeometry(100, 100, 40);
  sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 0.75, 1));

  // creation of the sphere material
  var sphereMaterial = new THREE.MeshBasicMaterial();
  sphereMaterial.map = THREE.ImageUtils.loadTexture('textures/campudus.jpg');

  // geometry + material = mesh (actual object)
  var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
  scene.add(sphereMesh);

  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  effect.setSize(width, height);
}

function update(dt) {
  resize();

  camera.updateProjectionMatrix();

  controls.update(dt);
}

function render(dt) {
  effect.render(scene, camera);
}

function animate(t) {
  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
  keepAwake.start();
}
