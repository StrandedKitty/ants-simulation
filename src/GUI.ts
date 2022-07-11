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
			.onChange(() => {
				this.emit('worldSize');
			});
		simFolder.add(Config, 'antsCount', 0, 22)
			.name('Ants count    2^')
			.step(1)
			.onChange(() => {
				this.emit('antsCount');
			});
		simFolder.add(Config, 'simulationStepsPerSecond', 1, 500)
			.name('Simulation steps per second')
			.step(1)
			.onChange(() => {
				this.emit('simulationStepsPerSecond');
			});

		const controlsFolder = this.gui.addFolder('Controls');

		controlsFolder.add(Config, 'brushRadius', 1, 100).name('Brush radius');

		simFolder.open();
		controlsFolder.open();
	}
}