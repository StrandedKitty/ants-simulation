import * as THREE from 'three';
import {SceneCollection} from "./App";

const Config = {
	worldSize: 1024,
	antsCount: 64 ** 2
};

interface Resources {
	worldRenderTarget0: THREE.WebGLRenderTarget;
	worldRenderTarget1: THREE.WebGLRenderTarget;
	worldBlurredRenderTarget: THREE.WebGLRenderTarget;
	antsDataRenderTarget0: THREE.WebGLRenderTarget;
	antsDataRenderTarget1: THREE.WebGLRenderTarget;
	antsDiscreteRenderTarget: THREE.WebGLRenderTarget;
}

export default class Renderer {
	private renderer: THREE.WebGLRenderer;
	public resources: Resources;

	constructor(public canvas: HTMLCanvasElement) {
		this.renderer = new THREE.WebGLRenderer({canvas})

		this.initResources();
	}

	private initResources() {
		const antTextureSize = Math.round(Math.sqrt(Config.antsCount));

		this.resources = {
			worldRenderTarget0: new THREE.WebGLRenderTarget(Config.worldSize, Config.worldSize, {
				format: THREE.RGBAFormat,
				type: THREE.FloatType,
				depthBuffer: false,
				magFilter: THREE.LinearFilter,
				minFilter: THREE.LinearFilter,
			}),
			worldRenderTarget1: new THREE.WebGLRenderTarget(Config.worldSize, Config.worldSize, {
				format: THREE.RGBAFormat,
				type: THREE.FloatType,
				depthBuffer: false,
				magFilter: THREE.LinearFilter,
				minFilter: THREE.LinearFilter,
			}),
			worldBlurredRenderTarget: new THREE.WebGLRenderTarget(Config.worldSize, Config.worldSize, {
				format: THREE.RGBAFormat,
				type: THREE.FloatType,
				depthBuffer: false,
				magFilter: THREE.LinearFilter,
				minFilter: THREE.LinearFilter,
			}),
			antsDataRenderTarget0: new THREE.WebGLRenderTarget(antTextureSize, antTextureSize, {
				format: THREE.RGBAFormat,
				type: THREE.FloatType,
				depthBuffer: false,
				magFilter: THREE.NearestFilter,
				minFilter: THREE.NearestFilter,
			}),
			antsDataRenderTarget1: new THREE.WebGLRenderTarget(antTextureSize, antTextureSize, {
				format: THREE.RGBAFormat,
				type: THREE.FloatType,
				depthBuffer: false,
				magFilter: THREE.NearestFilter,
				minFilter: THREE.NearestFilter,
			}),
			antsDiscreteRenderTarget: new THREE.WebGLRenderTarget(Config.worldSize, Config.worldSize, {
				format: THREE.RGBAFormat,
				type: THREE.UnsignedByteType,
				depthBuffer: false,
				magFilter: THREE.NearestFilter,
				minFilter: THREE.NearestFilter,
			})
		};
	}

	public renderScenes(scenes: SceneCollection) {
		const [antsComputeSource, antsComputeTarget] = scenes.ants.getRenderTargets();
		const [worldComputeSource, worldComputeTarget] = scenes.world.getRenderTargets();

		this.renderer.setViewport(0, 0, scenes.ants.renderWidth, scenes.ants.renderHeight);

		this.renderer.setRenderTarget(antsComputeTarget);
		scenes.ants.material.uniforms.tLastState.value = antsComputeSource.texture;
		scenes.ants.material.uniforms.tWorld.value = worldComputeSource.texture;
		this.renderer.render(scenes.ants, scenes.ants.camera);

		this.renderer.setViewport(0, 0, scenes.discretize.renderWidth, scenes.discretize.renderHeight);

		this.renderer.setRenderTarget(scenes.discretize.getRenderTarget());
		scenes.discretize.material.uniforms.tDataCurrent.value = antsComputeTarget.texture;
		scenes.discretize.material.uniforms.tDataLast.value = antsComputeSource.texture;
		this.renderer.render(scenes.discretize, scenes.discretize.camera);

		this.renderer.setViewport(0, 0, scenes.world.renderWidth, scenes.world.renderHeight);

		this.renderer.setRenderTarget(worldComputeTarget);
		scenes.world.material.uniforms.tLastState.value = scenes.worldBlur.getRenderTarget().texture;
		scenes.world.material.uniforms.tDiscreteAnts.value = scenes.discretize.getRenderTarget().texture;
		scenes.world.material.uniforms.pointerData.value = scenes.screen.getPointerData();
		this.renderer.render(scenes.world, scenes.world.camera);

		this.renderer.setViewport(0, 0, scenes.worldBlur.renderWidth, scenes.worldBlur.renderHeight);

		this.renderer.setRenderTarget(scenes.worldBlur.getRenderTarget());
		scenes.worldBlur.material.uniforms.tWorld.value = worldComputeTarget.texture;
		this.renderer.render(scenes.worldBlur, scenes.worldBlur.camera);

		this.renderer.setViewport(0, 0, scenes.screen.renderWidth, scenes.screen.renderHeight);

		this.renderer.setRenderTarget(null);
		scenes.screen.material.uniforms.tData.value = antsComputeTarget.texture;
		scenes.screen.groundMaterial.uniforms.map.value = scenes.worldBlur.getRenderTarget().texture;
		this.renderer.render(scenes.screen, scenes.screen.camera);
	}

	public resizeCanvas(width: number, height: number) {
		this.canvas.width = width;
		this.canvas.height = height;
	}
}