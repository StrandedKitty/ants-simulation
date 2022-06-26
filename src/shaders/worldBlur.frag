precision highp float;
precision highp int;

in vec2 vUv;

out vec4 FragColor;

uniform sampler2D tWorld;

const float offset = 1. / WORLD_SIZE * SCENT_BLUR_RADIUS;

void main()	{
    vec4 s0 = texture(tWorld, vUv);
    vec4 s1 = texture(tWorld, vUv + vec2(1, 1) * offset);
    vec4 s2 = texture(tWorld, vUv + vec2(-1, -1) * offset);
    vec4 s3 = texture(tWorld, vUv + vec2(-1, 1) * offset);
    vec4 s4 = texture(tWorld, vUv + vec2(1, -1) * offset);

    float scentToHome = (s0.z + s1.z + s2.z + s3.z + s4.z) / 5. * SCENT_FADE_OUT_FACTOR;
    float scentToFood = (s0.w + s1.w + s2.w + s3.w + s4.w) / 5. * SCENT_FADE_OUT_FACTOR;

    FragColor = vec4(
        s0.x,
        s0.y,
        scentToHome < SCENT_THRESHOLD ? 0. : scentToHome,
        scentToFood < SCENT_THRESHOLD ? 0. : scentToFood
    );
}