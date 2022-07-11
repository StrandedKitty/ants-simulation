import * as dat from 'dat.gui';
import Config from "./Config";
import EventEmitter from "events";

export default class GUI extends EventEmitter {
	private gui: dat.GUI = new dat.GUI({
		width: 400
	});

	constructor() {
		super();

		const simFolder = this.gui.addFolder('Simulation');

		simFolder.add(Config, 'worldSize', 256, 4096)
			.name('World size')
			.step(1)
			.onChange(() => this.emit('reset'));
		simFolder.add(Config, 'antsCount', 0, 22)
			.name('Ants count    2^')
			.step(1)
			.onChange(() => this.emit('reset'));
		simFolder.add(Config, 'scentFadeOutFactor', 0, 0.01)
			.name('Pheromone evaporation factor')
			.step(0.0001)
			.onChange(() => this.emit('reset'));
		simFolder.add(Config, 'scentBlurRadius', 0, 0.5)
			.name('Pheromone diffusion factor')
			.step(0.01)
			.onChange(() => this.emit('reset'));
		simFolder.add(Config, 'simulationStepsPerSecond', 1, 500)
			.name('Simulation steps per second')
			.step(1);

		const controlsFolder = this.gui.addFolder('Controls');

		controlsFolder.add(Config, 'brushRadius', 1, 100).name('Brush radius');

		simFolder.open();
		controlsFolder.open();
	}
}