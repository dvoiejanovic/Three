import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  PlaneGeometry,
  DoubleSide,
  DirectionalLight,
  MeshPhongMaterial,
  FlatShading,
} from "three";
import * as dat from "dat.gui";

import "./style.css";

init();

function init() {
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.z = 5;

  const scene = new Scene();

  const planeGeometry = new PlaneGeometry(10, 10, 10, 10);
  const planeMaterial = new MeshPhongMaterial({
    color: "red",
    side: DoubleSide,
    flatShading: FlatShading,
  });

  const planeMesh = new Mesh(planeGeometry, planeMaterial);
  scene.add(planeMesh);

  const light = new DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, 1);
  scene.add(light);

  const gui = new dat.GUI();
  const world = {
    plane: {
      width: 10,
      height: 10,
      widthSegments: 10,
      heightSegments: 10,
    },
  };

	const generatePlane = () => {
			planeMesh.geometry.dispose();
			const {width, height, widthSegments, heightSegments} = world.plane;
			planeMesh.geometry = new PlaneGeometry(width, height, widthSegments, heightSegments);
	
			const vertices = planeMesh.geometry.attributes.position.array;
			for (let i = 0; i <= vertices.length; i += 3) {
				const z = vertices[i + 2];
				vertices[i + 2] = z + Math.random();
		};
	}
	gui.add(world.plane, "height", 1, 20).onChange(generatePlane);
	gui.add(world.plane, "width", 1, 20).onChange(generatePlane);
	gui.add(world.plane, "widthSegments", 1, 50).onChange(generatePlane);
	gui.add(world.plane, "heightSegments", 1, 50).onChange(generatePlane);


  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  document.body.appendChild(renderer.domElement);

  function animation(time) {
    renderer.render(scene, camera);
  }
}
