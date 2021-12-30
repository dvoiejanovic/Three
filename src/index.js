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
	Raycaster,
	BufferAttribute,
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
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
	const raycaster = new Raycaster();
  const planeGeometry = new PlaneGeometry(5, 5, 10, 10);
  const planeMaterial = new MeshPhongMaterial({
    side: DoubleSide,
    flatShading: FlatShading,
		vertexColors: true
  });
  const planeMesh = new Mesh(planeGeometry, planeMaterial);
	
  const light = new DirectionalLight(0xffffff, 1);
  const backLight = new DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, 1);
  backLight.position.set(0, 0, -1);

  scene.add(planeMesh);
  scene.add(light);
  scene.add(backLight);

	const gui = new dat.GUI();
  const world = {
    plane: {
      width: 5,
      height: 5,
      widthSegments: 10,
      heightSegments: 10,
			r: 0,
			g: 0.19,
			b: 0.4
    },
  };

	
	const changeColor = () => {
		const colors = [];
		const numberOfVertices = planeMesh.geometry.attributes.position.count;
		const {r, g, b} = world.plane;
		for(let i = 0; i < numberOfVertices; i++) {
			colors.push(r, g, b);
		}
		planeMesh.geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
	}
	changeColor();

	const generatePlane = () => {
			planeMesh.geometry.dispose();
			const {width, height, widthSegments, heightSegments} = world.plane;
			planeMesh.geometry = new PlaneGeometry(width, height, widthSegments, heightSegments);
	
			const vertices = planeMesh.geometry.attributes.position.array;
			for (let i = 0; i <= vertices.length; i += 3) {
				const z = vertices[i + 2];
				vertices[i + 2] = z + Math.random();
		};

		changeColor();
	}

	gui.add(world.plane, "height", 1, 20).onChange(generatePlane);
	gui.add(world.plane, "width", 1, 20).onChange(generatePlane);
	gui.add(world.plane, "widthSegments", 1, 50).onChange(generatePlane);
	gui.add(world.plane, "heightSegments", 1, 50).onChange(generatePlane);
	gui.add(world.plane, "r", 0, 1).onChange(changeColor);
	gui.add(world.plane, "g", 0, 1).onChange(changeColor);
	gui.add(world.plane, "b", 0, 1).onChange(changeColor);


  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  document.body.appendChild(renderer.domElement);

	new OrbitControls(camera, renderer.domElement);

	const mouse = {
		x: undefined,
		y: undefined
	}

  function animation(time) {
    renderer.render(scene, camera);

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObject(planeMesh);
		if (intersects.length > 0) {
			const {face, object} = intersects[0];
			const {color} = object.geometry.attributes

			// vertice 1
			color.setX(face.a, 0.1);
			color.setY(face.a, 0.5);
			color.setZ(face.a, 1);

			// vertice 2
			color.setX(face.b, 0.1);
			color.setY(face.b, 0.5);
			color.setZ(face.b, 1);

			// vertice 3
			color.setX(face.c, 0.1);
			color.setY(face.c, 0.5);
			color.setZ(face.c, 1);

			color.needsUpdate = true;
		}
  }

	addEventListener('mousemove', (event) => {
		mouse.x = (event.clientX / innerWidth) * 2 - 1;
		mouse.y = -(event.clientY /  innerHeight) * 2 + 1;
	})
}
