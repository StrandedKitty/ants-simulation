precision highp float;
precision highp int;

in vec2 vUv;

out vec4 FragColor;

uniform sampler2D map;
uniform sampler2D tDiscreteAnts;

void main()	{
    vec4 value = clamp(texture(map, vUv), 0., 1.);

    float isFood = value.r;
    float isHome = value.g;
    float toFood = value.b;
    float toHome = value.a;

    // The part below doen't seem right.
    // I could figure out a better way to make pheromone colors blend properly on white background :(

    vec3 t = vec3(0.95, 0.2, 0.2) * toFood + vec3(0.2, 0.2, 0.95) * toHome;
    float a = clamp(toHome + toFood, 0., 1.);

    t /= a;

    if (a == 0.) t = vec3(0);

    vec3 color = mix(vec3(1, 1, 1), t, a * 0.7);

    if (isFood == 1.) {
        color = vec3(1, 0.1, 0.1);
    }

    if (isHome == 1.) {
        color = vec3(0.1, 0.1, 1);
    }

    FragColor = vec4(color, 1);
}