precision highp float;
precision highp int;

in vec2 vUv;
in float vIsCarryingFood;

uniform sampler2D tAnt;
uniform sampler2D tFood;

void main()	{
    vec4 antColor = texture(tAnt, vUv);
    vec4 foodColor = texture(tFood, vUv);

    pc_fragColor = mix(antColor, foodColor, foodColor.a * vIsCarryingFood);
}