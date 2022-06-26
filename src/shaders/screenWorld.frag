precision highp float;
precision highp int;

varying vec2 vUv;

uniform sampler2D map;

void main()	{
    vec4 value = clamp(texture2D(map, vUv), 0., 1.);
    vec4 bg = vec4(1);

    //bg = mix(bg, vec4(0, 0, 1, 1), value.a * 0.7);
    //bg = mix(bg, vec4(1, 0, 0, 1), value.b * 0.7);

    if (value.r == 1.) {
        bg = vec4(1, 0, 0, 1);
    }

    if (value.g == 1.) {
        bg = vec4(0.1, 0.1, 1, 1);
    }

    gl_FragColor = bg;
}