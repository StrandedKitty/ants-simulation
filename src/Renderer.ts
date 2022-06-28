import * as THREE from 'three';
import {SceneCollection} from "./App";
import Config from "./Config";

interface Resources {
	worldRenderTarget: THREE.WebGLRenderTarget;
	worldRenderTargetCopy: THREE.WebGLRenderTarget;
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
			worldRenderTarget: new THREE.WebGLRenderTarget(Config.worldSize, Config.worldSize, {
				format: THREE.RGBAFormat,
				type: THREE.FloatType,
				depthBuffer: false,
				magFilter: THREE.LinearFilter,
				minFilter: THREE.LinearFilter,
			}),
			worldRenderTargetCopy: new THREE.WebGLRenderTarget(Config.worldSize, Config.worldSize, {
				format: THREE.RGBAFormat,
				type: THREE.FloatType,
				depthBuffer: false,
				magFilter: THREE.NearestFilter,
				minFilter: THREE.LinearFilter,
			}),
			worldBlurredRenderTarget: new THREE.WebGLRenderTarget(Config.worldSize, Config.worldSize, {
				format: THREE.RGBAFormat,
				type: THREE.FloatType,
				depthBuffer: false,
				magFilter: THREE.NearestFilter,
				minFilter: THREE.NearestFilter,
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

	public renderSimulation(scenes: SceneCollection) {
		const [antsComputeSource, antsComputeTarget] = scenes.ants.getRenderTargets();

		this.renderer.setViewport(0, 0, scenes.worldBlur.renderWidth, scenes.worldBlur.renderHeight);

		this.renderer.setRenderTarget(this.resources.worldBlurredRenderTarget);
		scenes.worldBlur.material.uniforms.tWorld.value = this.resources.worldRenderTarget.texture;
		this.renderer.render(scenes.worldBlur, scenes.worldBlur.camera);

		this.renderer.setViewport(0, 0, scenes.ants.renderWidth, scenes.ants.renderHeight);

		this.renderer.setRenderTarget(antsComputeTarget);
		scenes.ants.material.uniforms.tLastState.value = antsComputeSource.texture;
		scenes.ants.material.uniforms.tWorld.value = this.resources.worldBlurredRenderTarget.texture;
		this.renderer.render(scenes.ants, scenes.ants.camera);

		this.renderer.setViewport(0, 0, scenes.discretize.renderWidth, scenes.discretize.renderHeight);

		this.renderer.setRenderTarget(this.resources.antsDiscreteRenderTarget);
		scenes.discretize.material.uniforms.tDataCurrent.value = antsComputeTarget.texture;
		scenes.discretize.material.uniforms.tDataLast.value = antsComputeSource.texture;
		this.renderer.render(scenes.discretize, scenes.discretize.camera);

		this.renderer.setViewport(0, 0, scenes.world.renderWidth, scenes.world.renderHeight);

		this.renderer.setRenderTarget(this.resources.worldRenderTarget);
		scenes.world.material.uniforms.tLastState.value = this.resources.worldBlurredRenderTarget.texture;
		scenes.world.material.uniforms.tDiscreteAnts.value = this.resources.antsDiscreteRenderTarget.texture;
		this.renderer.render(scenes.world, scenes.world.camera);

		scenes.screen.material.uniforms.tData.value = antsComputeTarget.texture;
		scenes.screen.groundMaterial.uniforms.map.value = this.resources.worldRenderTargetCopy.texture;
	}

	public renderToScreen(scenes: SceneCollection) {
		this.renderer.setViewport(0, 0, scenes.draw.renderWidth, scenes.draw.renderHeight);
		this.renderer.setRenderTarget(this.resources.worldRenderTargetCopy);
		scenes.draw.material.uniforms.tWorld.value = this.resources.worldRenderTarget.texture;
		scenes.draw.material.uniforms.pointerPosition.value = scenes.screen.pointerPosition;
		scenes.draw.material.uniforms.drawMode.value = scenes.screen.drawMode;
		scenes.draw.material.uniforms.brushRadius.value = Config.brushRadius;
		this.renderer.render(scenes.draw, scenes.draw.camera);
		this.renderer.copyFramebufferToTexture(new THREE.Vector2(), this.resources.worldRenderTarget.texture);

		this.renderer.setViewport(0, 0, scenes.screen.renderWidth, scenes.screen.renderHeight);
		this.renderer.setRenderTarget(null);
		this.renderer.render(scenes.screen, scenes.screen.camera);
	}

	public resizeCanvas(width: number, height: number) {
		this.canvas.width = width;
		this.canvas.height = height;
	}

	public getCommonMaterialDefines(): Record<string, string> {
		return {
			WORLD_SIZE: Renderer.convertNumberToFloatString(Config.worldSize),
			SCENT_THRESHOLD: Renderer.convertNumberToFloatString(Config.scentThreshold),
			SCENT_FADE_OUT_FACTOR: Renderer.convertNumberToFloatString(Config.scentFadeOutFactor),
			SCENT_BLUR_RADIUS: Renderer.convertNumberToFloatString(Config.scentBlurRadius),
			SCENT_MAX_STORAGE: Renderer.convertNumberToFloatString(Config.scentMaxStorage),
			SCENT_PER_MARKER: Renderer.convertNumberToFloatString(Config.scentPerMarker),
			ANT_SPEED: Renderer.convertNumberToFloatString(Config.antSpeed),
			ANT_ROTATION_ANGLE: Renderer.convertNumberToFloatString(Config.antRotationAngle)
		};
	}

	public destroy() {

	}

	static convertNumberToFloatString(n: number): string {
		return n.toFixed(8);
	}
}