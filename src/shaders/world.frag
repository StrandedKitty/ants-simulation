precision highp float;
precision highp int;

varying vec2 vUv;

uniform sampler2D tLastState;
uniform sampler2D tDiscreteAnts;
uniform vec4 pointerData;

void main()	{
    vec4 lastState = texture2D(tLastState, vUv);
    vec3 discreteAnts = texture2D(tDiscreteAnts, vUv).xyz;

    float isFood = lastState.x;
    float isHome = lastState.y;
    float scentToHome = lastState.z + discreteAnts.x * 4.;
    float scentToFood =  lastState.w + discreteAnts.y * 4.;

    if (discreteAnts.z == 1.) {
        isFood = 0.;
    }

    if (distance(pointerData.zw, vUv) < 0.02) {
        isFood = max(isFood, pointerData.x);
        isHome = max(isHome, pointerData.y);
    }

    gl_FragColor = vec4(isFood, isHome, scentToHome, scentToFood);
}