import * as THREE from 'three';
import Renderer from "../Renderer";
import AbstractScene from "./AbstractScene";
import FullScreenTriangleGeometry from "../utils/FullScreenTriangleGeometry";
import fragmentShader from '../shaders/worldBlur.frag';
import vertexShader from '../shaders/worldBlur.vert';
import {WebGLRenderTarget} from "three";

export default class WorldBlurScene extends AbstractScene {
	public readonly camera: THREE.OrthographicCamera = new THREE.OrthographicCamera();
	public readonly material: THREE.RawShaderMaterial;
	private readonly renderTarget: WebGLRenderTarget;

	constructor(renderer: Renderer) {
		super(renderer);

		const geometry = new FullScreenTriangleGeometry();
		const material = new THREE.RawShaderMaterial({
			uniforms: {
				tWorld: {value: this.renderer.resources.worldRenderTarget0.texture},
			},
			vertexShader,
			fragmentShader
		});
		const mesh = new THREE.Mesh(geometry, material);
		this.add(mesh);

		this.material = material;

		this.renderTarget = this.renderer.resources.worldBlurredRenderTarget;
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