#version 300 es

precision highp float;
precision highp int;

#define PI 3.1415926535897932384626433832795
#define MAX_STORAGE 1000000.

in vec2 vUv;

out highp vec4 FragColor;

uniform float uTime;
uniform sampler2D tLastState;
uniform sampler2D tWorld;

const float PHI = 1.61803398874989484820459;

const float speed = 1.;
const float sampleDistance = 20.;
const float worldSize = 1024.;
const float cellSize = 1. / worldSize;

float goldNoise(in vec2 xy, in float seed) {
    return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

bool tryGetFood(vec2 pos) {
    return texture(tWorld, pos).x == 1.;
}

bool tryDropFood(vec2 pos) {
    return texture(tWorld, pos).y == 1.;
}

float smell(vec2 pos, float isCarrying) {
    vec2 value = texture(tWorld, pos).zw;

    if (isCarrying > 0.5) {
        return value.y;
    }

    return value.x;
}

vec2 applyOffsetToPos(vec2 pos, vec2 offsetDirectaion) {
    return vec2(
        fract(pos.x + offsetDirectaion.x * cellSize),
        fract(pos.y + offsetDirectaion.y * cellSize)
    );
}

const float rotAngle = PI / 50.;

float constrainAngle(float x){
    x = mod(x,360.);
    if (x < 0.)
        x += 360.;
    return x;
}

void main()	{
    vec4 lastState = texture(tLastState, vUv);

    float rand = goldNoise(vUv * 1000., fract(uTime / 1000.));

    vec2 pos = lastState.xy;
    float angle = lastState.z;
    float isCarrying = float(int(lastState.w) & 1);
    float storage = float(int(lastState.w) >> 1);

    bool movementProcessed = false;

    if (pos == vec2(0)) { // init new ant
        pos = vec2(0.5);
        angle = goldNoise(vUv * 10000., 1.) * 2. * PI;
        isCarrying = 0.;
        storage = MAX_STORAGE;
    }

    if (tryDropFood(pos)) {
        if (isCarrying == 1.) {
            isCarrying = 0.;
            angle += PI;
        }
        storage = MAX_STORAGE;
    }

    if (isCarrying == 0.) {
        if (rand < 0.33) {
            vec2 offset = vec2(cos(angle), sin(angle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryGetFood(point)) {
                isCarrying = 1.;
                storage = MAX_STORAGE;
                pos = point;
                movementProcessed = true;
            }
        } else if (rand < 0.66) {
            vec2 offset = vec2(cos(angle - rotAngle), sin(angle - rotAngle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryGetFood(point)) {
                isCarrying = 1.;
                storage = MAX_STORAGE;
                pos = point;
                movementProcessed = true;
                angle -= rotAngle;
            }
        } else {
            vec2 offset = vec2(cos(angle + rotAngle), sin(angle + rotAngle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryGetFood(point)) {
                isCarrying = 1.;
                storage = MAX_STORAGE;
                pos = point;
                movementProcessed = true;
                angle += rotAngle;
            }
        }
    } else if (isCarrying == 1.) {
        if (rand < 0.33) {
            vec2 offset = vec2(cos(angle), sin(angle)) * 10.;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryDropFood(point)) {
                isCarrying = 0.;
                storage = MAX_STORAGE;
                pos = point;
                movementProcessed = true;
            }
        } else if (rand < 0.66) {
            vec2 offset = vec2(cos(angle - rotAngle), sin(angle - rotAngle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryDropFood(point)) {
                isCarrying = 0.;
                storage = MAX_STORAGE;
                pos = point;
                movementProcessed = true;
                angle -= rotAngle;
            }
        } else {
            vec2 offset = vec2(cos(angle + rotAngle), sin(angle + rotAngle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryDropFood(point)) {
                isCarrying = 0.;
                storage = MAX_STORAGE;
                pos = point;
                movementProcessed = true;
                angle += rotAngle;
            }
        }
    }

    if (!movementProcessed) {
        float noise2 = goldNoise(vUv * 10000., uTime / 1000. + 0.2);

        float sampleAhead = smell(applyOffsetToPos(pos, vec2(cos(angle), sin(angle)) * sampleDistance), isCarrying);
        float sampleLeft = smell(applyOffsetToPos(pos, vec2(cos(angle - rotAngle), sin(angle - rotAngle)) * sampleDistance), isCarrying);
        float sampleRight = smell(applyOffsetToPos(pos, vec2(cos(angle + rotAngle), sin(angle + rotAngle)) * sampleDistance), isCarrying);

        if (sampleAhead > sampleLeft && sampleAhead > sampleRight) {
            // don't change direction
        } else if (sampleLeft > sampleAhead && sampleLeft > sampleRight) {
            angle -= rotAngle; // steer left
        } else if (sampleRight > sampleAhead && sampleRight > sampleLeft) {
            angle += rotAngle; // steer right
        } else if (rand < 0.33) {
            angle += rotAngle; // no smell detected, do random movement
        } else if (rand < 0.66) {
            angle -= rotAngle;
        }

        if (noise2 > 0.5) {
            angle += PI / 30.;
        } else {
            angle -= PI / 30.;
        }

        vec2 offset = vec2(cos(angle), sin(angle));
        pos = applyOffsetToPos(pos, offset);
    } else {
        angle += PI;
    }

    if (fract(pos.x) == 0. || fract(pos.y) == 0.) {
        //angle += PI / 2.;
    }

    FragColor = vec4(
        pos.x,
        pos.y,
        angle,
        float((uint(max(storage - 1000., 0.)) << 1) + uint(isCarrying))
    );
}