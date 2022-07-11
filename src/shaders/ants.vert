precision highp float;
precision highp int;

#define PI 3.1415926535897932384626433832795

varying vec2 vUv;
varying float vIsCarryingFood;

uniform sampler2D tData;

vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

void main()	{
    vUv = uv;

    float dataTextureSize = vec2(textureSize(tData, 0)).x;

    float id = float(gl_InstanceID);
    float sampleY = floor(id / dataTextureSize);
    float sampleX = id - sampleY * dataTextureSize;
    vec2 antDataUV = (vec2(sampleX, sampleY) + 0.5) / dataTextureSize;

    vec4 dataSample = texture(tData, antDataUV);

    vec2 offset = dataSample.xy;
    vec2 rotatedPosition = rotate(position.xy, -dataSample.z + PI * 0.5);

    vIsCarryingFood = float(int(dataSample.w) & 1);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vec2(rotatedPosition + offset), 0, 1);
}