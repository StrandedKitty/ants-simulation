import AntsComputeScene from "./scenes/AntsComputeScene";
import ScreenScene from "./scenes/ScreenScene";
import Renderer from "./Renderer";
import WorldComputeScene from "./scenes/WorldComputeScene";
import AntsDiscretizeScene from "./scenes/AntsDiscretizeScene";
import WorldBlurScene from "./scenes/WorldBlurScene";

export interface SceneCollection {
	ants: AntsComputeScene;
	world: WorldComputeScene;
	worldBlur: WorldBlurScene;
	discretize: AntsDiscretizeScene;
	screen: ScreenScene;
}

export default new class App {
	private renderer: Renderer = new Renderer(<HTMLCanvasElement>document.getElementById('canvas'));
	private scenes: SceneCollection;
	private loop = (deltaTime: number): void => this.update(deltaTime);

	constructor() {
		this.initScenes();

		window.addEventListener('resize', () => this.resize());

		this.resize();

		this.update(0);
	}

	private initScenes() {
		this.scenes = {
			ants: new AntsComputeScene(this.renderer),
			world: new WorldComputeScene(this.renderer),
			worldBlur: new WorldBlurScene(this.renderer),
			discretize: new AntsDiscretizeScene(this.renderer),
			screen: new ScreenScene(this.renderer),
		};
	}

	private resize() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		this.renderer.resizeCanvas(width, height);

		for (const scene of Object.values(this.scenes)) {
			scene.resize(width, height);
		}
	}

	private update(deltaTime: number) {
		requestAnimationFrame(this.loop);

		for (let i = 0; i < 3; i++) {
			for (const scene of Object.values(this.scenes)) {
				scene.update(deltaTime);
			}
			this.renderer.renderScenes(this.scenes);
		}
	}
}