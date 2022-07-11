import * as THREE from 'three';
import Renderer from "../Renderer";
import AbstractScene from "./AbstractScene";
import fragmentShader from '../shaders/antsDiscretize.frag';
import vertexShader from '../shaders/antsDiscretize.vert';

export default class AntsDiscretizeScene extends AbstractScene {
	public readonly camera: THREE.OrthographicCamera = new THREE.OrthographicCamera();
	public readonly material: THREE.RawShaderMaterial;
	public mesh: THREE.InstancedMesh;

	constructor(renderer: Renderer) {
		super(renderer);

		this.material = new THREE.RawShaderMaterial({
			uniforms: {
				tDataCurrent: {value: null},
				tDataLast: {value: null},
			},
			vertexShader,
			fragmentShader,
			defines: this.renderer.getCommonMaterialDefines(),
			glslVersion: THREE.GLSL3
		});

		this.createMesh();
	}

	private createMesh() {
		if (this.mesh) {
			this.remove(this.mesh);
			this.mesh.dispose();
		}

		this.mesh = new THREE.InstancedMesh(
			new THREE.BoxBufferGeometry(1, 1, 1),
			this.material,
			this.renderer.resources.antsDataRenderTarget0.width * this.renderer.resources.antsDataRenderTarget0.height
		);
		this.add(this.mesh);
	}

	public recompileMaterials() {
		this.material.defines = this.renderer.getCommonMaterialDefines();
		this.material.needsUpdate = true;
		this.createMesh();
	}

	public resize(width: number, height: number) {

	}

	public update() {

	}
}