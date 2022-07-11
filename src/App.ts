import AntsComputeScene from "./scenes/AntsComputeScene";
import ScreenScene from "./scenes/ScreenScene";
import Renderer from "./Renderer";
import WorldComputeScene from "./scenes/WorldComputeScene";
import AntsDiscretizeScene from "./scenes/AntsDiscretizeScene";
import WorldBlurScene from "./scenes/WorldBlurScene";
import Config from "./Config";
import GUI from "./GUI";
import DrawScene from "./scenes/DrawScene";

export interface SceneCollection {
	ants: AntsComputeScene;
	world: WorldComputeScene;
	worldBlur: WorldBlurScene;
	discretize: AntsDiscretizeScene;
	screen: ScreenScene;
	draw: DrawScene;
}

export default new class App {
	private renderer: Renderer = new Renderer(<HTMLCanvasElement>document.getElementById('canvas'));
	private scenes: SceneCollection;
	private gui: GUI = new GUI();
	private renderLoop = (time: number): void => this.render(time);
	private lastTime: number = 0;
	private queuedSimSteps: number = 0;

	constructor() {
		this.initScenes();

		window.addEventListener('resize', () => this.resize());

		this.resize();

		this.renderLoop(0);

		this.gui.on('reset', () => {
			this.resetRenderer();
		});
	}

	private resetRenderer() {
		this.renderer.reset(this.scenes);
	}

	private initScenes() {
		this.scenes = {
			ants: new AntsComputeScene(this.renderer),
			world: new WorldComputeScene(this.renderer),
			worldBlur: new WorldBlurScene(this.renderer),
			discretize: new AntsDiscretizeScene(this.renderer),
			screen: new ScreenScene(this.renderer),
			draw: new DrawScene(this.renderer)
		};
	}

	private resize() {
		const width = window.innerWidth * window.devicePixelRatio;
		const height = window.innerHeight * window.devicePixelRatio;

		this.renderer.resizeCanvas(width, height);

		for (const scene of Object.values(this.scenes)) {
			scene.resize(width, height);
		}
	}

	private simulationStep() {
		for (const scene of Object.values(this.scenes)) {
			scene.update();
		}

		this.renderer.renderSimulation(this.scenes);
	}

	private render(time: number) {
		requestAnimationFrame(this.renderLoop);

		const deltaTime = time - this.lastTime;
		const simStepsToDo = deltaTime / 1000 * Config.simulationStepsPerSecond;

		this.queuedSimSteps += simStepsToDo;
		this.queuedSimSteps = Math.min(this.queuedSimSteps, 10);

		while (this.queuedSimSteps >= 1) {
			this.simulationStep();
			--this.queuedSimSteps;
		}

		if (time === 0) {
			return;
		}

		this.renderer.renderToScreen(this.scenes);

		this.lastTime = time;
	}
}