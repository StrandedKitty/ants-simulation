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

    float isFood = lastState.x;
    float isHome = lastState.y;

    if (distance(pointerPosition, vUv) < brushRadius / WORLD_SIZE) {
        if (drawMode == 1.) {
            isFood = 1.;
        } else if (drawMode == 2.) {
            isHome = 1.;
        }
    }

    FragColor = vec4(isFood, isHome, lastState.zw);
}