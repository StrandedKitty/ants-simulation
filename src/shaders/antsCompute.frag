precision highp float;
precision highp int;

#define PI 3.1415926535897932384626433832795

in vec2 vUv;

out vec4 FragColor;

uniform float uTime;
uniform sampler2D tLastState;
uniform sampler2D tWorld;

const float sampleDistance = 20.;
const float cellSize = 1. / WORLD_SIZE;

float rand(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt = dot(co.xy ,vec2(a,b));
    float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
}

vec2 roundUvToCellCenter(vec2 uv) {
    return floor(uv * WORLD_SIZE) / WORLD_SIZE;
}

bool tryGetFood(vec2 pos) {
    return texture(tWorld, roundUvToCellCenter(pos)).x == 1.;
}

bool tryDropFood(vec2 pos) {
    return texture(tWorld, roundUvToCellCenter(pos)).y == 1.;
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
        clamp(pos.x + offsetDirectaion.x * cellSize, 0., 1.),
        clamp(pos.y + offsetDirectaion.y * cellSize, 0., 1.)
    );
}

float getMaxScentStorage(vec2 antDataUv) {
    float factor = 0.8 + rand(antDataUv * 100.) * 0.2;

    return SCENT_MAX_STORAGE * factor;
}

void main()	{
    vec4 lastState = texture(tLastState, vUv);

    float noise = rand(vUv * 1000. + fract(uTime / 1000.));

    vec2 pos = lastState.xy;
    float angle = lastState.z;
    float isCarrying = float(int(lastState.w) & 1);
    float storage = float(int(lastState.w) >> 1);

    bool movementProcessed = false;

    if (pos == vec2(0)) { // init new ant
        pos = vec2(0.5);
        angle = rand(vUv * 10000.) * 2. * PI;
        isCarrying = 0.;
        storage = 0.;
    }

    if (isCarrying == 0.) {
        if (noise < 0.33) {
            vec2 offset = vec2(cos(angle), sin(angle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryGetFood(point)) {
                movementProcessed = true;
            }
        } else if (noise < 0.66) {
            float newAngle = angle - ANT_ROTATION_ANGLE;
            vec2 offset = vec2(cos(newAngle), sin(newAngle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryGetFood(point)) {
                movementProcessed = true;
                angle = newAngle;
            }
        } else {
            float newAngle = angle + ANT_ROTATION_ANGLE;
            vec2 offset = vec2(cos(newAngle), sin(newAngle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryGetFood(point)) {
                movementProcessed = true;
                angle = newAngle;
            }
        }
    } else if (isCarrying == 1.) {
        if (noise < 0.33) {
            vec2 offset = vec2(cos(angle), sin(angle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryDropFood(point)) {
                movementProcessed = true;
            }
        } else if (noise < 0.66) {
            float newAngle = angle - ANT_ROTATION_ANGLE;
            vec2 offset = vec2(cos(newAngle), sin(newAngle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryDropFood(point)) {
                movementProcessed = true;
                angle = newAngle;
            }
        } else {
            float newAngle = angle + ANT_ROTATION_ANGLE;
            vec2 offset = vec2(cos(newAngle), sin(newAngle)) * sampleDistance;
            vec2 point = applyOffsetToPos(pos, offset);

            if (tryDropFood(point)) {
                movementProcessed = true;
                angle = newAngle;
            }
        }
    }

    if (!movementProcessed) {
        float noise2 = rand(vUv * 1000. + fract(uTime / 1000.) + 0.2);

        float sampleAhead = smell(applyOffsetToPos(pos, vec2(cos(angle), sin(angle)) * sampleDistance), isCarrying);
        float sampleLeft = smell(applyOffsetToPos(pos, vec2(cos(angle - ANT_ROTATION_ANGLE), sin(angle - ANT_ROTATION_ANGLE)) * sampleDistance), isCarrying);
        float sampleRight = smell(applyOffsetToPos(pos, vec2(cos(angle + ANT_ROTATION_ANGLE), sin(angle + ANT_ROTATION_ANGLE)) * sampleDistance), isCarrying);

        if (sampleAhead > sampleLeft && sampleAhead > sampleRight) {
            // don't change direction
        } else if (sampleLeft > sampleAhead && sampleLeft > sampleRight) {
            angle -= ANT_ROTATION_ANGLE; // steer left
        } else if (sampleRight > sampleAhead && sampleRight > sampleLeft) {
            angle += ANT_ROTATION_ANGLE; // steer right
        } else if (noise < 0.33) {
            angle += ANT_ROTATION_ANGLE; // no smell detected, do random movement
        } else if (noise < 0.66) {
            angle -= ANT_ROTATION_ANGLE;
        }

        if (noise2 > 0.5) {
            angle += ANT_ROTATION_ANGLE * 2.;
        } else {
            angle -= ANT_ROTATION_ANGLE * 2.;
        }
    }

    vec2 offset = vec2(cos(angle), sin(angle));
    pos = applyOffsetToPos(pos, offset);

    if (fract(pos.x) == 0. || fract(pos.y) == 0.) {
        angle += PI * (noise - 0.5);
    }

    if (tryGetFood(pos) && isCarrying == 0.) {
        isCarrying = 1.;
        angle += PI;
        storage = getMaxScentStorage(vUv);
    }

    if (tryDropFood(pos)) {
        storage = getMaxScentStorage(vUv);

        if (isCarrying == 1.) {
            isCarrying = 0.;
            angle += PI;
        }
    }

    FragColor = vec4(
        pos.x,
        pos.y,
        angle,
        float((uint(max(storage - SCENT_PER_MARKER, 0.)) << 1) + uint(isCarrying))
    );
}