var THREE = require('threejs');
require('../../../../vendor/threejs/StereoEffect');
require('../../../../vendor/threejs/DeviceOrientationControls');
require('../../../../vendor/threejs/OrbitControls');
require('../../../../vendor/threejs/OBJLoader');
var keepAwake = require('../../../js/keepAwake');
var camera, scene, renderer;
var effect, controls;
var element, container;
var bike;

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
  camera.position.y = 14;
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


  var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
  scene.add(light);

  var ambient = new THREE.AmbientLight(0x111111);
  scene.add(ambient);

  var texture = THREE.ImageUtils.loadTexture(
    'textures/patterns/checker.png'
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2(50, 50);
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial({
    color : 0xffffff,
    specular : 0xffffff,
    shininess : 20,
    shading : THREE.SmoothShading,
    map : texture
  });

  var geometry = new THREE.PlaneGeometry(1000, 1000);
  var mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  var cylinder = addCylinder(9, 9, 3, 48, 0xfab400);
  cylinder.position.z = 0;
  cylinder.position.y = 1.5;
  cylinder.position.x = 15;
  scene.add(cylinder);

  //Load object model
  var loader = new THREE.OBJLoader();
  var objURL = 'models/bike/bike.obj';
  loader.load(objURL, function (object) {
    object.scale.set(0.1, 0.1, 0.1);
    object.position.y = 3;
    object.position.x = 15;
    object.side = THREE.DoubleSide;
    bike = object;
    scene.add(object);
  });

  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

function addCylinder(radiusTop, radiusBottom, height, radiusSegments, color) {
  var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments);
  var material = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(geometry, material);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  effect.setSize(width, height);
}

var i = 0;

function update(dt) {
  resize();
  if (bike) {
    i = ((i + 0.1) % 360);
    bike.rotation.y = i * (Math.PI / 180);
  }

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
