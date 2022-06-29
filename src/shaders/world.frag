precision highp float;
precision highp int;

in vec2 vUv;

out vec4 FragColor;

uniform sampler2D tLastState;
uniform sampler2D tDiscreteAnts;

void main()	{
    vec4 lastState = texture(tLastState, vUv);
    vec3 discreteAnts = texture(tDiscreteAnts, vUv).xyz;

    int cellData = int(lastState.x);
    int isFood = cellData & 1;
    int isHome = (cellData & 2) >> 1;
    int isObstacle = (cellData & 4) >> 2;
    float scentToHome = min(10., lastState.y + discreteAnts.x);
    float scentToFood =  min(10., lastState.z + discreteAnts.y);

    if (discreteAnts.z == 1.) {
        isFood = 0;
    }

    FragColor = vec4(float(isFood + (isHome << 1) + (isObstacle << 2)), scentToHome, scentToFood, 0);
}