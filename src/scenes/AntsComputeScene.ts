import * as THREE from 'three';
import {WebGLRenderTarget} from 'three';
import Renderer from "../Renderer";
import AbstractScene from "./AbstractScene";
import FullScreenTriangleGeometry from "../utils/FullScreenTriangleGeometry";
import fragmentShader from '../shaders/antsCompute.frag';
import vertexShader from '../shaders/antsCompute.vert';

export default class AntsComputeScene extends AbstractScene {
	public camera: THREE.OrthographicCamera = new THREE.OrthographicCamera();
	public material: THREE.RawShaderMaterial;
	private renderTargets: [WebGLRenderTarget, WebGLRenderTarget];

	constructor(renderer: Renderer) {
		super(renderer);

		const geometry = new FullScreenTriangleGeometry();
		const material = new THREE.RawShaderMaterial({
			uniforms: {
				uTime: {value: 0},
				tLastState: {value: this.renderer.resources.antsDataRenderTarget0.texture},
				tWorld: {value: this.renderer.resources.worldRenderTarget.texture},
			},
			vertexShader,
			fragmentShader,
			defines: this.renderer.getCommonMaterialDefines(),
			glslVersion: THREE.GLSL3
		});
		const mesh = new THREE.Mesh(geometry, material);
		this.add(mesh);

		this.material = material;

		this.renderTargets = [
			this.renderer.resources.antsDataRenderTarget0,
			this.renderer.resources.antsDataRenderTarget1
		];

		this.renderWidth = this.renderer.resources.antsDataRenderTarget0.width;
		this.renderHeight = this.renderer.resources.antsDataRenderTarget0.height;
	}

	public getRenderTargets(): [WebGLRenderTarget, WebGLRenderTarget] {
		this.renderTargets.reverse();

		return this.renderTargets;
	}

	public resize(width: number, height: number) {

	}

	public update(deltaTime: number) {
		this.material.uniforms.uTime.value = performance.now();
	}
}