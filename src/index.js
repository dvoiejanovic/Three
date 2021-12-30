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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import gsap from "gsap";

import "./style.css";

init();

function init() {
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );


  camera.position.x = 0;
  camera.position.y = -60;
  camera.position.z = 35;

  const scene = new Scene();
  const raycaster = new Raycaster();
  const planeMaterial = new MeshPhongMaterial({
		side: DoubleSide,
    flatShading: FlatShading,
    vertexColors: true,
  });
	
  const light = new DirectionalLight(0xffffff, 1);
  const backLight = new DirectionalLight(0xffffff, 1);
  light.position.set(0, -1, 1);
  backLight.position.set(0, 0, -1);
	
  const gui = new dat.GUI();
  const world = {
		plane: {
			width: 400,
      height: 400,
      widthSegments: 50,
      heightSegments: 50,
      r: 0,
      g: 0.19,
      b: 0.4,
    },
  };
	const planeGeometry = new PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
	const planeMesh = new Mesh(planeGeometry, planeMaterial);
	
	scene.add(planeMesh);
	scene.add(light);
	scene.add(backLight);
	
  const changeColor = () => {
		const colors = [];
    const numberOfVertices = planeMesh.geometry.attributes.position.count;
    const { r, g, b } = world.plane;
    for (let i = 0; i < numberOfVertices; i++) {
      colors.push(r, g, b);
    }
    planeMesh.geometry.setAttribute(
      "color",
      new BufferAttribute(new Float32Array(colors), 3)
    );
  };

	
  const generatePlane = () => {
		planeMesh.geometry.dispose();
    const { width, height, widthSegments, heightSegments } = world.plane;
    planeMesh.geometry = new PlaneGeometry(
			width,
      height,
      widthSegments,
      heightSegments
			);
			
			const vertices = planeMesh.geometry.attributes.position.array;
			const randomValues = [];
			for (let i = 0; i <= vertices.length; i++) {
				if (i % 3 === 0) {
					const x = vertices[i];
					const y = vertices[i + 1];
					const z = vertices[i + 2];
	
					vertices[i] = x + (Math.random() - 0.5) * 3;
					vertices[i + 1] = y + (Math.random() - 0.5) * 3;
					vertices[i + 2] = z + (Math.random() + 0.5) * 3;
				}

				randomValues.push(Math.random() * Math.PI * 2);
			}
			
			planeMesh.geometry.attributes.position.originalPosition = vertices;
			planeMesh.geometry.attributes.position.randomValues = randomValues;
			changeColor();
		};
		
	generatePlane();
  gui.add(world.plane, "height", 1, 500).onChange(generatePlane);
  gui.add(world.plane, "width", 1, 500).onChange(generatePlane);
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
    y: undefined,
  };

	let frame = 0;
  function animation(time) {
    renderer.render(scene, camera);

    raycaster.setFromCamera(mouse, camera);
		console.log(camera.position);
		frame += 0.01;
		const {array, originalPosition, randomValues}  = planeMesh.geometry.attributes.position;
		for (let i = 0; i < array.length; i+=3) {
			array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01;
			array[i+1] = originalPosition[i+1] + Math.sin(frame + randomValues[i+1]) * 0.01;
			array[i+2] = originalPosition[i+2] + Math.cos(frame + randomValues[i+2]) * 0.01;
		}
		planeMesh.geometry.attributes.position.needsUpdate =  true;

    const intersects = raycaster.intersectObject(planeMesh);
    if (intersects.length > 0) {
      const { face, object } = intersects[0];
      const { color } = object.geometry.attributes;

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

      const initialColor = {
        r: world.plane.r,
        g: world.plane.g,
        b: world.plane.b,
      };

      const hoverColor = {
        r: 0.1,
        g: 0.5,
        b: 1,
      };

      gsap.to(hoverColor, {
        r: initialColor.r,
        g: initialColor.g,
        b: initialColor.b,
        onUpdate: () => {
          // vertice 1
          color.setX(face.a, hoverColor.r);
          color.setY(face.a, hoverColor.g);
          color.setZ(face.a, hoverColor.b);

          // vertice 2
          color.setX(face.b, hoverColor.r);
          color.setY(face.b, hoverColor.g);
          color.setZ(face.b, hoverColor.b);

          // vertice 3
          color.setX(face.c, hoverColor.r);
          color.setY(face.c, hoverColor.g);
          color.setZ(face.c, hoverColor.b);
        },
      });
    }
  }

  addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  });
}
