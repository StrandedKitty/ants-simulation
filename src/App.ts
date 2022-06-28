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
	private renderLoop = (deltaTime: number): void => this.render(deltaTime);
	private simInterval: NodeJS.Timer;
	private simulationStepsPerSecond: number = 0;
	private simStarted: boolean = false;

	constructor() {
		this.initScenes();

		window.addEventListener('resize', () => this.resize());

		this.resize();

		this.renderLoop(0);

		this.simulationStepsPerSecond = Config.simulationStepsPerSecond;
		this.updateSimulationInterval();
	}

	private updateSimulationInterval() {
		clearInterval(this.simInterval);

		this.simInterval = setInterval(() => {
			if (Config.simulationStepsPerSecond !== this.simulationStepsPerSecond) {
				this.simulationStepsPerSecond = Config.simulationStepsPerSecond;
				this.updateSimulationInterval();
				return;
			}

			this.simulationStep();

			this.simStarted = true;
		}, 1000 / this.simulationStepsPerSecond);
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
			scene.update(0);
		}

		this.renderer.renderSimulation(this.scenes);
	}

	private render(deltaTime: number) {
		requestAnimationFrame(this.renderLoop);

		if (!this.simStarted) {
			return;
		}

		this.renderer.renderToScreen(this.scenes);
	}
}