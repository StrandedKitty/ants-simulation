import * as THREE from 'three';
import Renderer from "../Renderer";
import AbstractScene from "./AbstractScene";
import vertexShaderAnts from "../shaders/ants.vert";
import fragmentShaderAnts from "../shaders/ants.frag";
import vertexShaderGround from "../shaders/screenWorld.vert";
import fragmentShaderGround from "../shaders/screenWorld.frag";

enum PointerState {
	None,
	LMB,
	RMB
}

export default class ScreenScene extends AbstractScene {
	public readonly camera: THREE.PerspectiveCamera;
	public readonly material: THREE.ShaderMaterial;
	public readonly groundMaterial: THREE.ShaderMaterial;
	public readonly pointerPosition: THREE.Vector2 = new THREE.Vector2();
	public pointerState: PointerState = PointerState.None;

	constructor(renderer: Renderer) {
		super(renderer);

		const ground = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(10, 10),
			new THREE.ShaderMaterial({
				uniforms: {
					map: {value: this.renderer.resources.worldRenderTarget.texture},
				},
				vertexShader: vertexShaderGround,
				fragmentShader: fragmentShaderGround,
				defines: this.renderer.getCommonMaterialDefines(),
				glslVersion: THREE.GLSL3
			})
		);

		this.groundMaterial = ground.material;

		ground.position.x += 5;
		ground.position.y += 5;

		this.add(ground);

		const antTexture = new THREE.TextureLoader().load('textures/ant.png');
		const foodTexture = new THREE.TextureLoader().load('textures/food.png');

		antTexture.magFilter = foodTexture.magFilter = THREE.NearestFilter;
		antTexture.minFilter = foodTexture.minFilter = THREE.LinearMipMapLinearFilter;

		this.material = new THREE.ShaderMaterial({
			uniforms: {
				tData: {value: this.renderer.resources.antsDataRenderTarget0.texture},
				tAnt: {value: antTexture},
				tFood: {value: foodTexture}
			},
			vertexShader: vertexShaderAnts,
			fragmentShader: fragmentShaderAnts,
			transparent: true
		});

		const ants = new THREE.InstancedMesh(
			new THREE.PlaneBufferGeometry(0.15, 0.15),
			this.material,
			this.renderer.resources.antsDataRenderTarget0.width * this.renderer.resources.antsDataRenderTarget0.height
		)

		this.add(ants);

		this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);

		this.add(this.camera);

		this.camera.position.z = 12;
		this.camera.position.x = this.camera.position.y = 5;

		const raycastVector = new THREE.Vector2(0, 0);
		const raycaster = new THREE.Raycaster();

		this.renderer.canvas.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});

		this.renderer.canvas.addEventListener('pointerdown', (e) => {
			raycastVector.x = (e.clientX / window.innerWidth) * 2 - 1;
			raycastVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(raycastVector, this.camera);

			const intersects = raycaster.intersectObjects([ground]);

			if (intersects.length > 0) {
				const uv = intersects[0].uv;
				this.pointerPosition.copy(uv);

				if (e.button === 0) {
					this.pointerState = PointerState.LMB;
				} else if (e.button === 2) {
					this.pointerState = PointerState.RMB;
				}
			}
		});

		this.renderer.canvas.addEventListener('pointermove', (e) => {
			raycastVector.x = (e.clientX / window.innerWidth) * 2 - 1;
			raycastVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(raycastVector, this.camera);

			const intersects = raycaster.intersectObjects([ground]);

			if (intersects.length > 0) {
				const uv = intersects[0].uv;
				this.pointerPosition.copy(uv);
			}
		});

		this.renderer.canvas.addEventListener('pointerup', (e) => {
			this.pointerState = PointerState.None;
		});
	}

	public getPointerData(): THREE.Vector4 {
		return new THREE.Vector4(
			+(this.pointerState === PointerState.LMB),
			+(this.pointerState === PointerState.RMB),
			this.pointerPosition.x,
			this.pointerPosition.y
		);
	}

	public resize(width: number, height: number) {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderWidth = width;
		this.renderHeight = height;
	}

	public update(deltaTime: number) {

	}
}