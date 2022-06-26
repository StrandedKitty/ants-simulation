precision highp float;
precision highp int;

in vec2 vUv;
in float vIsCarryingFood;
in float vScentFactor;
in float vIsCellCleared;

out vec4 FragColor;

void main()	{
    FragColor = vec4(vIsCarryingFood * vScentFactor, (1. - vIsCarryingFood) * vScentFactor, vIsCellCleared, 1);
}