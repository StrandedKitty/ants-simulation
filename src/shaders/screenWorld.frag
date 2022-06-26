precision highp float;
precision highp int;

in vec2 vUv;

out vec4 FragColor;

uniform sampler2D map;

void main()	{
    vec4 value = clamp(texture(map, vUv), 0., 1.);
    vec3 bg = vec3(0.9);

    bg = mix(bg, vec3(0.2, 0.2, 0.8), clamp(value.a, 0., 1.));
    bg = mix(bg, vec3(0.8, 0.2, 0.2), clamp(value.b, 0., 1.));

    if (value.r == 1.) {
        bg = vec3(1, 0.2, 0.2);
    }

    if (value.g == 1.) {
        bg = vec3(0.2, 0.2, 1);
    }

    FragColor = vec4(bg, 1);
}