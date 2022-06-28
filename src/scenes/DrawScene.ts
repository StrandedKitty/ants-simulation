import * as THREE from 'three';
import Renderer from "../Renderer";
import AbstractScene from "./AbstractScene";
import FullScreenTriangleGeometry from "../utils/FullScreenTriangleGeometry";
import fragmentShader from '../shaders/draw.frag';
import vertexShader from '../shaders/draw.vert';
import {WebGLRenderTarget} from "three";

export default class DrawScene extends AbstractScene {
	public readonly camera: THREE.OrthographicCamera = new THREE.OrthographicCamera();
	public readonly material: THREE.RawShaderMaterial;

	constructor(renderer: Renderer) {
		super(renderer);

		const geometry = new FullScreenTriangleGeometry();
		const material = new THREE.RawShaderMaterial({
			uniforms: {
				tWorld: {value: null},
				pointerPosition: {value: new THREE.Vector2()},
				drawMode: {value: 0},
				brushRadius: {value: 0},
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