import * as THREE from 'three';
import Renderer from "../Renderer";

export default abstract class AbstractScene extends THREE.Scene {
	protected readonly renderer: Renderer;
	public readonly camera: THREE.Camera;
	public renderWidth: number = 1;
	public renderHeight: number = 1;

	protected constructor(renderer: Renderer) {
		super();

		this.renderer = renderer;
	}

	public abstract resize(width: number, height: number): void;

	public abstract update(deltaTime: number): void;
}