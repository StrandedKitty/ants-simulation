import * as THREE from 'three';
import Renderer from "../Renderer";
import AbstractScene from "./AbstractScene";
import FullScreenTriangleGeometry from "../utils/FullScreenTriangleGeometry";
import fragmentShader from '../shaders/world.frag';
import vertexShader from '../shaders/world.vert';
import {WebGLRenderTarget} from "three";

export default class WorldComputeScene extends AbstractScene {
	public readonly camera: THREE.OrthographicCamera = new THREE.OrthographicCamera();
	public readonly material: THREE.RawShaderMaterial;
	private readonly renderTargets: [WebGLRenderTarget, WebGLRenderTarget];

	constructor(renderer: Renderer) {
		super(renderer);

		const geometry = new FullScreenTriangleGeometry();
		const material = new THREE.RawShaderMaterial({
			uniforms: {
				tLastState: {value: this.renderer.resources.worldRenderTarget0.texture},
				tDiscreteAnts: {value: this.renderer.resources.antsDiscreteRenderTarget.texture},
				pointerData: {value: new THREE.Vector4()},
			},
			vertexShader,
			fragmentShader
		});
		const mesh = new THREE.Mesh(geometry, material);
		this.add(mesh);

		this.material = material;

		this.renderTargets = [
			this.renderer.resources.worldRenderTarget0,
			this.renderer.resources.worldRenderTarget1
		];

		this.renderWidth = this.renderer.resources.worldRenderTarget0.width;
		this.renderHeight = this.renderer.resources.worldRenderTarget0.height;
	}

	public getRenderTargets(): [WebGLRenderTarget, WebGLRenderTarget] {
		this.renderTargets.reverse();

		return this.renderTargets;
	}

	public resize(width: number, height: number) {

	}

	public update(deltaTime: number) {

	}
}