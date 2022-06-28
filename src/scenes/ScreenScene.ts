import * as THREE from 'three';
import Renderer from "../Renderer";
import AbstractScene from "./AbstractScene";
import vertexShaderAnts from "../shaders/ants.vert";
import fragmentShaderAnts from "../shaders/ants.frag";
import vertexShaderGround from "../shaders/screenWorld.vert";
import fragmentShaderGround from "../shaders/screenWorld.frag";

enum PointerState {
	None,
	Food,
	Home,
	Obstacle
}

export default class ScreenScene extends AbstractScene {
	public readonly camera: THREE.OrthographicCamera;
	public readonly material: THREE.ShaderMaterial;
	public readonly groundMaterial: THREE.ShaderMaterial;
	public readonly pointerPosition: THREE.Vector2 = new THREE.Vector2();
	public drawMode: PointerState = PointerState.None;
	private cameraZoomLinear: number = 0;
	private isPointerDown: boolean = false;

	constructor(renderer: Renderer) {
		super(renderer);

		const ground = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(1, 1),
			new THREE.ShaderMaterial({
				uniforms: {
					map: {value: this.renderer.resources.worldRenderTarget.texture},
					tDiscreteAnts: {value: this.renderer.resources.antsDiscreteRenderTarget.texture},
				},
				vertexShader: vertexShaderGround,
				fragmentShader: fragmentShaderGround,
				defines: this.renderer.getCommonMaterialDefines(),
				glslVersion: THREE.GLSL3
			})
		);

		this.groundMaterial = ground.material;

		//ground.position.x = 0.5;
		//ground.position.y = 0.5;

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
			new THREE.PlaneBufferGeometry(0.015, 0.015),
			this.material,
			this.renderer.resources.antsDataRenderTarget0.width * this.renderer.resources.antsDataRenderTarget0.height
		)

		ants.position.x = ants.position.y = -0.5;

		this.add(ants);

		this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5);

		this.add(this.camera);

		this.camera.position.z = 12;

		const raycastVector = new THREE.Vector2(0, 0);
		const raycaster = new THREE.Raycaster();

		this.renderer.canvas.addEventListener('contextmenu', e => {
			e.preventDefault();
		});

		this.renderer.canvas.addEventListener('pointerdown', e => {
			this.isPointerDown = true;

			raycastVector.x = (e.clientX / window.innerWidth) * 2 - 1;
			raycastVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(raycastVector, this.camera);

			const intersects = raycaster.intersectObjects([ground]);

			if (intersects.length > 0) {
				const uv = intersects[0].uv;
				this.pointerPosition.copy(uv);
			}
		});

		this.renderer.canvas.addEventListener('pointermove', e => {
			if (this.isPointerDown) {
				const dx = e.movementX;
				const dy = e.movementY;

				this.camera.position.x -= dx / window.innerHeight / this.camera.zoom;
				this.camera.position.y += dy / window.innerHeight / this.camera.zoom;
			}

			raycastVector.x = (e.clientX / window.innerWidth) * 2 - 1;
			raycastVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(raycastVector, this.camera);

			const intersects = raycaster.intersectObjects([ground]);

			if (intersects.length > 0) {
				const uv = intersects[0].uv;
				this.pointerPosition.copy(uv);
			}
		});

		this.renderer.canvas.addEventListener('pointerup', e => {
			this.isPointerDown = false;
		});

		this.renderer.canvas.addEventListener('pointerleave', e => {
			this.isPointerDown = false;
		});

		this.renderer.canvas.addEventListener('wheel', e => {
			this.cameraZoomLinear -= e.deltaY * 0.001;

			this.updateCameraZoom();
		});

		window.addEventListener('keydown', e => {
			switch (e.code) {
				case 'KeyQ': {
					this.drawMode = PointerState.Home;
					break;
				}
				case 'KeyW': {
					this.drawMode = PointerState.Food;
					break;
				}
				case 'KeyE': {
					this.drawMode = PointerState.Obstacle;
					break;
				}
			}
		});

		window.addEventListener('keyup', e => {
			this.drawMode = PointerState.None;
		});
	}

	private updateCameraZoom() {
		this.camera.zoom = 2 ** this.cameraZoomLinear;
		this.camera.updateProjectionMatrix();
	}

	public resize(width: number, height: number) {
		const aspect = width / height;

		this.camera.left = -0.5 * aspect;
		this.camera.right = 0.5 * aspect;
		this.camera.top = 0.5;
		this.camera.bottom = -0.5;

		this.camera.updateProjectionMatrix();

		this.renderWidth = width;
		this.renderHeight = height;
	}

	public update(deltaTime: number) {

	}
}