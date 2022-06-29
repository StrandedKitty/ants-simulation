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

		simFolder.add(Config, 'worldSize', 256, 4096).onChange(() => {
			this.emit('worldSize');
		});
		simFolder.add(Config, 'antsCount', 1, 1e6).onChange(() => {
			this.emit('antsCount');
		});
		simFolder.add(Config, 'simulationStepsPerSecond', 1, 500).onChange(() => {
			this.emit('simulationStepsPerSecond');
		});

		const controlsFolder = this.gui.addFolder('Controls');

		controlsFolder.add(Config, 'brushRadius', 1, 100);

		simFolder.open();
		controlsFolder.open();
	}
}