import * as THREE from 'three';
import Renderer from "../Renderer";
import AbstractScene from "./AbstractScene";
import FullScreenTriangleGeometry from "../utils/FullScreenTriangleGeometry";
import fragmentShader from '../shaders/world.frag';
import vertexShader from '../shaders/world.vert';

export default class WorldComputeScene extends AbstractScene {
	public readonly camera: THREE.OrthographicCamera = new THREE.OrthographicCamera();
	public readonly material: THREE.RawShaderMaterial;

	constructor(renderer: Renderer) {
		super(renderer);

		const geometry = new FullScreenTriangleGeometry();
		const material = new THREE.RawShaderMaterial({
			uniforms: {
				tLastState: {value: null},
				tDiscreteAnts: {value: null}
			},
			vertexShader,
			fragmentShader,
			defines: this.renderer.getCommonMaterialDefines(),
			glslVersion: THREE.GLSL3
		});
		const mesh = new THREE.Mesh(geometry, material);
		this.add(mesh);

		this.material = material;
	}

	public recompileMaterials() {
		this.material.defines = this.renderer.getCommonMaterialDefines();
		this.material.needsUpdate = true;
	}

	public resize(width: number, height: number) {

	}

	public update(deltaTime: number) {

	}
}