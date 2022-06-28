precision highp float;
precision highp int;

in vec2 vUv;

out vec4 FragColor;

uniform sampler2D tLastState;
uniform sampler2D tDiscreteAnts;

void main()	{
    vec4 lastState = texture(tLastState, vUv);
    vec3 discreteAnts = texture(tDiscreteAnts, vUv).xyz;

    float isFood = lastState.x;
    float isHome = lastState.y;
    float scentToHome = min(10., lastState.z + discreteAnts.x * 2.);
    float scentToFood =  min(10., lastState.w + discreteAnts.y * 2.);

    if (discreteAnts.z == 1.) {
        isFood = 0.;
    }

    FragColor = vec4(isFood, isHome, scentToHome, scentToFood);
}