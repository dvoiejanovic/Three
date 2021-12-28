import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import './style.css';

const scene = new Scene();
const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0,1, 1000);
const renderer = new WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
