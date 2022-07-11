precision highp float;
precision highp int;

in vec2 vUv;

out vec4 FragColor;

uniform sampler2D tWorld;
uniform vec2 pointerPosition;
uniform float drawMode;
uniform float brushRadius;

void main()	{
    vec4 lastState = texture(tWorld, vUv);

    int cellData = int(lastState.x);
    int isFood = cellData & 1;
    int isHome = (cellData & 2) >> 1;
    int isObstacle = (cellData & 4) >> 2;

    if (distance(pointerPosition, vUv) < brushRadius / WORLD_SIZE) {
        if (drawMode == 1.) {
            isFood = 1;
        } else if (drawMode == 2.) {
            isHome = 1;
        } else if (drawMode == 3.) {
            isObstacle = 1;
        } else if (drawMode == 4.) {
            isFood = 0;
            isHome = 0;
            isObstacle = 0;
        }
    }

    FragColor = vec4(float(isFood + (isHome << 1) + (isObstacle << 2)), lastState.yzw);
}