precision highp float;
precision highp int;

in vec3 position;
in vec2 uv;

out vec2 vUv;
out float vIsCarryingFood;
out float vScentFactor;
out float vIsCellCleared;

uniform sampler2D tDataCurrent;
uniform sampler2D tDataLast;

const float cellSize = 1. / WORLD_SIZE;

void main()	{
    vUv = uv;

    float dataTextureSize = vec2(textureSize(tDataCurrent, 0)).x;

    float id = float(gl_InstanceID);
    float sampleY = floor(id / dataTextureSize);
    float sampleX = id - sampleY * dataTextureSize;

    vec4 dataSampleCurrent = texture(tDataCurrent, vec2(sampleX, sampleY) / dataTextureSize);
    vec4 dataSampleLast = texture(tDataLast, vec2(sampleX, sampleY) / dataTextureSize);
    vec2 offset = dataSampleCurrent.xy;

    float isCarrying = float(int(dataSampleCurrent.w) & 1);
    float wasCarrying = float(int(dataSampleLast.w) & 1);
    float isCellCleared = float(wasCarrying == 0. && isCarrying == 1.);

    float storage = float(int(dataSampleCurrent.w) >> 1);

    vIsCarryingFood = isCarrying;
    vScentFactor = storage / 1000000.;
    vIsCellCleared = isCellCleared;

    gl_Position = vec4(
        (position.xy * cellSize * 0.01 + floor(offset * WORLD_SIZE) / WORLD_SIZE + cellSize * 0.5) * 2. - 1.,
        0,
        1
    );
}