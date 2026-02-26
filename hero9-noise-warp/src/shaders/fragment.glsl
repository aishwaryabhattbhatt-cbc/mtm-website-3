uniform sampler2D uTexture;
uniform float uTime;
uniform float uIntensity;
uniform float uScale;
uniform float uSpeed;
uniform int uTurbulence;

varying vec2 vUv;

// 2D Simplex Noise (approximation using sine waves for performant distortion)
float noise(vec2 p) {
    return sin(p.x * 12.9898 + p.y * 78.233) * 43758.5453;
}

float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Smoothstep

    float n00 = noise(i);
    float n10 = noise(i + vec2(1.0, 0.0));
    float n01 = noise(i + vec2(0.0, 1.0));
    float n11 = noise(i + vec2(1.0, 1.0));

    float nx0 = mix(n00, n10, f.x);
    float nx1 = mix(n01, n11, f.x);
    return mix(nx0, nx1, f.y);
}

// Multi-octave (Fractional Brownian Motion) for turbulence
float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float maxValue = 0.0;

    for (int i = 0; i < 4; i++) {
        if (i >= octaves) break;
        
        value += amplitude * smoothNoise(p * frequency + uTime * uSpeed * 0.5);
        maxValue += amplitude;
        
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    return value / maxValue;
}

void main() {
    vec2 uv = vUv;

    // Generate noise offset based on uv position and time
    vec2 noiseCoord = uv * uScale + uTime * uSpeed * 0.1;
    
    // Calculate distortion offset using FBM
    float noiseX = fbm(noiseCoord + vec2(1.0, 0.0), uTurbulence);
    float noiseY = fbm(noiseCoord + vec2(0.0, 1.0), uTurbulence);
    
    vec2 distortion = vec2(noiseX, noiseY) * uIntensity * 0.05;

    // Sample the texture at distorted UV
    vec2 distortedUv = uv + distortion;
    
    // Clamp to avoid wrapping artifacts
    distortedUv = clamp(distortedUv, 0.0, 1.0);
    
    vec4 texColor = texture2D(uTexture, distortedUv);

    // Optional: add slight brightness variation based on noise
    float brightness = 0.95 + fbm(uv * uScale * 2.0, uTurbulence) * 0.1;
    
    gl_FragColor = texColor * brightness;
}
