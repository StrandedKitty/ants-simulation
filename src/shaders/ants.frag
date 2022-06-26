precision highp float;
precision highp int;

varying vec2 vUv;
varying float vIsCarryingFood;

uniform sampler2D tAnt;
uniform sampler2D tFood;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()	{
    vec4 antColor = texture2D(tAnt, vUv);
    vec4 foodColor = texture2D(tFood, vUv);

    gl_FragColor = mix(antColor, foodColor, foodColor.a * vIsCarryingFood);
}