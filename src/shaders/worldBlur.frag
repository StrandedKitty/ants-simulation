#version 300 es

precision highp float;
precision highp int;

in vec2 vUv;

uniform sampler2D tWorld;

out highp vec4 FragColor;

void main()	{
    float cellSize = 1. / vec2(textureSize(tWorld, 0)).x * 0.2;

    vec4 s0 = texture(tWorld, vUv);
    vec4 s1 = texture(tWorld, vUv + vec2(1, 1) * cellSize);
    vec4 s2 = texture(tWorld, vUv + vec2(-1, -1) * cellSize);
    vec4 s3 = texture(tWorld, vUv + vec2(-1, 1) * cellSize);
    vec4 s4 = texture(tWorld, vUv + vec2(1, -1) * cellSize);

    float scentToHome = (s0.z + s1.z + s2.z + s3.z + s4.z) / 5. * 0.998;
    float scentToFood = (s0.w + s1.w + s2.w + s3.w + s4.w) / 5. * 0.998;

    float threshold = 0.01;

    FragColor = vec4(s0.x, s0.y, scentToHome < threshold ? 0. : scentToHome, scentToFood < threshold ? 0. : scentToFood);
    //FragColor = vec4(s0.x, s0.y, s0.z * 0.995, s0.w * 0.995);
}