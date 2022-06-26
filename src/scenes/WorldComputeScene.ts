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

	constructor(renderer: Renderer) {
		super(renderer);

		const geometry = new FullScreenTriangleGeometry();
		const material = new THREE.RawShaderMaterial({
			uniforms: {
				tLastState: {value: this.renderer.resources.worldRenderTarget.texture},
				tDiscreteAnts: {value: this.renderer.resources.antsDiscreteRenderTarget.texture},
				pointerData: {value: new THREE.Vector4()},
			},
			vertexShader,
			fragmentShader,
			defines: this.renderer.getCommonMaterialDefines(),
			glslVersion: THREE.GLSL3
		});
		const mesh = new THREE.Mesh(geometry, material);
		this.add(mesh);

		this.material = material;

		this.renderWidth = this.renderer.resources.worldRenderTarget.width;
		this.renderHeight = this.renderer.resources.worldRenderTarget.height;
	}

	public getRenderTarget(): WebGLRenderTarget {
		return this.renderer.resources.worldRenderTarget;
	}

	public resize(width: number, height: number) {

	}

	public update(deltaTime: number) {

	}
}