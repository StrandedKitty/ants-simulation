precision highp float;
precision highp int;

in vec2 vUv;

out vec4 FragColor;

uniform sampler2D tLastState;
uniform sampler2D tDiscreteAnts;
uniform vec4 pointerData;

void main()	{
    vec4 lastState = texture(tLastState, vUv);
    vec3 discreteAnts = texture(tDiscreteAnts, vUv).xyz;

    float isFood = lastState.x;
    float isHome = lastState.y;
    float scentToHome = lastState.z + discreteAnts.x * 2.;
    float scentToFood =  lastState.w + discreteAnts.y * 2.;

    if (discreteAnts.z == 1.) {
        isFood = 0.;
    }

    if (distance(pointerData.zw, vUv) < 0.02) {
        isFood = max(isFood, pointerData.x);
        isHome = max(isHome, pointerData.y);
    }

    FragColor = vec4(isFood, isHome, scentToHome, scentToFood);
}