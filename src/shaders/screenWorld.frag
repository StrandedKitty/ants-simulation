precision highp float;
precision highp int;

in vec2 vUv;

out vec4 FragColor;

uniform sampler2D map;

void main()	{
    vec4 value = texture(map, vUv);

    int cellData = int(value.x);
    int isFood = cellData & 1;
    int isHome = (cellData & 2) >> 1;
    int isObstacle = (cellData & 4) >> 2;
    float toFood = clamp(value.y, 0., 1.);
    float toHome = clamp(value.z, 0., 1.);

    // The part below doen't seem right.
    // I could figure out a better way to make pheromone colors blend properly on white background :(

    vec3 t = vec3(0.95, 0.2, 0.2) * toFood + vec3(0.2, 0.2, 0.95) * toHome;
    float a = clamp(toHome + toFood, 0., 1.);

    t /= a;

    if (a == 0.) t = vec3(0);

    vec3 color = mix(vec3(1, 1, 1), t, a * 0.7);

    if (isFood == 1) {
        color = vec3(1, 0.1, 0.1);
    } else if (isHome == 1) {
        color = vec3(0.1, 0.1, 1);
    } else if (isObstacle == 1) {
        color = vec3(0.6, 0.6, 0.6);
    }

    FragColor = vec4(color, 1);
}