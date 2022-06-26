import * as dat from 'dat.gui';
import Config from "./Config";

export default class GUI {
	private gui: dat.GUI = new dat.GUI({
		width: 400
	});

	constructor() {
		const simFolder = this.gui.addFolder('Simulation');

		simFolder.add(Config, 'worldSize', 256, 8096);
		simFolder.add(Config, 'antsCount', 1, 1e6);
		simFolder.add(Config, 'simulationStepsPerSecond', 1, 300);

		const controlsFolder = this.gui.addFolder('Controls');

		simFolder.open();
		controlsFolder.open();
	}
}