import * as THREE from 'three';
import {WebGLRenderTarget} from 'three';
import Renderer from "../Renderer";
import AbstractScene from "./AbstractScene";
import fragmentShader from '../shaders/antsDiscretize.frag';
import vertexShader from '../shaders/antsDiscretize.vert';

export default class AntsDiscretizeScene extends AbstractScene {
	public readonly camera: THREE.OrthographicCamera = new THREE.OrthographicCamera();
	public readonly material: THREE.RawShaderMaterial;
	private readonly renderTarget: WebGLRenderTarget;

	constructor(renderer: Renderer) {
		super(renderer);

		const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
		const material = new THREE.RawShaderMaterial({
			uniforms: {
				tDataCurrent: {value: null},
				tDataLast: {value: null},
			},
			vertexShader,
			fragmentShader
		});
		const mesh = new THREE.InstancedMesh(
			geometry,
			material,
			this.renderer.resources.antsDataRenderTarget0.width * this.renderer.resources.antsDataRenderTarget0.height
		);
		this.add(mesh);

		this.material = material;

		this.renderTarget = this.renderer.resources.antsDiscreteRenderTarget;

		this.renderWidth = this.renderer.resources.worldRenderTarget0.width;
		this.renderHeight = this.renderer.resources.worldRenderTarget0.height;
	}

	public getRenderTarget(): WebGLRenderTarget {
		return this.renderTarget;
	}

	public resize(width: number, height: number) {

	}

	public update(deltaTime: number) {

	}
}