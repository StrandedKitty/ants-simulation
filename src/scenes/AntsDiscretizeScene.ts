import * as THREE from 'three';
import {WebGLRenderTarget} from 'three';
import Renderer from "../Renderer";
import AbstractScene from "./AbstractScene";
import fragmentShader from '../shaders/antsDiscretize.frag';
import vertexShader from '../shaders/antsDiscretize.vert';

export default class AntsDiscretizeScene extends AbstractScene {
	public readonly camera: THREE.OrthographicCamera = new THREE.OrthographicCamera();
	public readonly material: THREE.RawShaderMaterial;

	constructor(renderer: Renderer) {
		super(renderer);

		const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
		const material = new THREE.RawShaderMaterial({
			uniforms: {
				tDataCurrent: {value: null},
				tDataLast: {value: null},
			},
			vertexShader,
			fragmentShader,
			defines: this.renderer.getCommonMaterialDefines(),
			glslVersion: THREE.GLSL3
		});
		const mesh = new THREE.InstancedMesh(
			geometry,
			material,
			this.renderer.resources.antsDataRenderTarget0.width * this.renderer.resources.antsDataRenderTarget0.height
		);
		this.add(mesh);

		this.material = material;

		this.renderWidth = this.renderer.resources.worldRenderTarget.width;
		this.renderHeight = this.renderer.resources.worldRenderTarget.height;
	}

	public getRenderTarget(): WebGLRenderTarget {
		return this.renderer.resources.antsDiscreteRenderTarget;
	}

	public resize(width: number, height: number) {

	}

	public update(deltaTime: number) {

	}
}