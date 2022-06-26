import * as THREE from "three";

const positionBuffer = new Float32Array([
	-1, 3, 0,
	-1, -1, 0,
	3, -1, 0,
]);

const uvBuffer = new Float32Array([
	0, 2,
	0, 0,
	2, 0
]);

export default class FullScreenTriangleGeometry extends THREE.BufferGeometry {
	constructor() {
		super();

		this.setAttribute(
			'position',
			new THREE.BufferAttribute(positionBuffer, 3)
		);
		this.setAttribute(
			'uv',
			new THREE.BufferAttribute(uvBuffer, 2)
		);
	}
}