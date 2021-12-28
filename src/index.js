import { PerspectiveCamera, Scene, BoxGeometry, WebGLRenderer, Mesh, MeshBasicMaterial } from 'three';

let camera, scene, renderer;
let geometry, material, mesh;

init();

function init() {

	camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 1;

	scene = new Scene();

	geometry = new BoxGeometry( 0.2, 0.2, 0.2 );
	material = new MeshBasicMaterial({
    color: 'cyan'
  });

	mesh = new Mesh( geometry, material );
	scene.add( mesh );

	renderer = new WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animation );
	document.body.appendChild( renderer.domElement );

}

function animation( time ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}

