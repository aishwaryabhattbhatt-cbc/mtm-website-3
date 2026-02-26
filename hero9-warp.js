/**
 * Hero 9 - WebGL Noise Warp Background Effect
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

class NoiseWarpEffect {
  constructor() {
    console.log('Initializing NoiseWarpEffect...');
    
    // ===== CONFIGURATION - Perlin Noise Fill (Unicorn Studio Style) =====
    this.config = {
      // Scale (Unicorn: 10)
      scale: 10.0,              // Noise scale - larger = bigger waves
      
      // Amplitude (Unicorn: 100)
      amplitude: 1.0,           // Wave height/intensity (0.0 - 2.0)
      
      // Speed (Unicorn: 11)
      speed: 0.11,              // Overall animation speed multiplier
      
      // Drift (Unicorn: 100)
      drift: 1.0,               // Continuous flow/drift (0.0 - 2.0)
      
      // Color Shift (Unicorn: 55)
      colorShift: 0.55,         // Color gradient animation speed
      
      // Skew (Unicorn: 53)
      skew: 0.53,               // UV skewing angle (0.0 - 1.0)
      
      // Angle (Unicorn: 0)
      angle: 0.0,               // Rotation angle in degrees (-180 to 180)
      
      // Phase (Unicorn: 8)
      phase: 0.08,              // Noise layer phase offset
      
      // Threshold (Unicorn: 50)
      threshold: 0.5,           // Single threshold for wave separation (0.0 - 1.0)
      
      // Mix (Unicorn: 91) - We'll use as blend strength
      mix: 0.91,                // Color blend mix (0.0 - 1.0)
      
      // Legacy compatibility (hidden from GUI)
      baseScale: 1.4,
      scaleMultiplier: 6.0,
      waveFrequency: 2.5,
      patternFrequency: 3.9,
      distortionAmount: 0.1,
      positionSpeed: 0.13,
      distortionSpeed: 0.03,
      patternSpeed: 0.03,
      waveSpeed: 0.03,
      thresholdLow: 0.24,
      thresholdHigh: 0.57,
      
      // Colors (RGB 0-1 range) - Brightened for vibrant gradients
      colorWhite: { r: 1.0, g: 1.0, b: 1.0 },
      colorBlue: { r: 0.3, g: 0.6, b: 1.0 },        // Brighter blue
      colorPurple: { r: 0.7, g: 0.4, b: 1.0 },      // Brighter purple
      colorPink: { r: 1.0, g: 0.5, b: 0.9 },        // Brighter pink
      colorTeal: { r: 0.2, g: 0.9, b: 0.7 },        // Brighter teal
      colorLightBlue: { r: 0.4, g: 0.8, b: 1.0 },   // Brighter light blue
      
      // Color distribution percentages (0-100, will be normalized)
      colorWhitePercent: 20,
      colorBluePercent: 20,
      colorPurplePercent: 20,
      colorPinkPercent: 20,
      colorTealPercent: 20,
      colorLightBluePercent: 20,

      // Glyph Dither Controls
      cellPx: 18.0,            // 6–18 px recommended
      contrast: 2.5,
      gamma: 2.2,
      softness: 0.01,
      minR: 0.05,
      maxR: 0.48,
      invert: false,
      bayer: false,
      bayerStrength: 0.04,

      // Hero Text Blob
      blobBlur: 60,
      blobInset: -240,
      blobRotate: -15.5,
      blobSkew: -20,
      blobOpacity: 0.63,
      blobRadiusA: 75,
      blobRadiusB: 45,
      blobRadiusC: 72,
      blobRadiusD: 90,
      blobAnimate: true,
      blobAnimationSpeed: 0.9,
      
      // Blob Perlin Noise (matches wave noise)
      blobNoiseScale: 10.0,
      blobNoiseAmplitude: 0.3,
      blobNoiseSpeed: 0.11,
      blobNoiseDrift: 1.0,
      blobNoisePhase: 0.0,
      blobNoiseAngle: 0.0
    };

    // Auto-load saved settings if present
    try {
      const saved = localStorage.getItem('hero9Settings');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.gradientColors) {
          this.config.colorWhite = data.gradientColors.colorWhite || this.config.colorWhite;
          this.config.colorBlue = data.gradientColors.colorBlue || this.config.colorBlue;
          this.config.colorPurple = data.gradientColors.colorPurple || this.config.colorPurple;
          this.config.colorPink = data.gradientColors.colorPink || this.config.colorPink;
          this.config.colorTeal = data.gradientColors.colorTeal || this.config.colorTeal;
          this.config.colorLightBlue = data.gradientColors.colorLightBlue || this.config.colorLightBlue;
          this.config.colorWhitePercent = data.gradientColors.colorWhitePercent ?? this.config.colorWhitePercent;
          this.config.colorBluePercent = data.gradientColors.colorBluePercent ?? this.config.colorBluePercent;
          this.config.colorPurplePercent = data.gradientColors.colorPurplePercent ?? this.config.colorPurplePercent;
          this.config.colorPinkPercent = data.gradientColors.colorPinkPercent ?? this.config.colorPinkPercent;
          this.config.colorTealPercent = data.gradientColors.colorTealPercent ?? this.config.colorTealPercent;
          this.config.colorLightBluePercent = data.gradientColors.colorLightBluePercent ?? this.config.colorLightBluePercent;
        }
        if (data.perlinNoise) {
          this.config.scale = data.perlinNoise.scale ?? this.config.scale;
          this.config.amplitude = data.perlinNoise.amplitude ?? this.config.amplitude;
          this.config.speed = data.perlinNoise.speed ?? this.config.speed;
          this.config.drift = data.perlinNoise.drift ?? this.config.drift;
          this.config.colorShift = data.perlinNoise.colorShift ?? this.config.colorShift;
          this.config.skew = data.perlinNoise.skew ?? this.config.skew;
          this.config.angle = data.perlinNoise.angle ?? this.config.angle;
          this.config.phase = data.perlinNoise.phase ?? this.config.phase;
          this.config.threshold = data.perlinNoise.threshold ?? this.config.threshold;
          this.config.mix = data.perlinNoise.mix ?? this.config.mix;
        }
        if (data.glyphDither) {
          this.config.cellPx = data.glyphDither.cellPx ?? this.config.cellPx;
          this.config.contrast = data.glyphDither.contrast ?? this.config.contrast;
          this.config.gamma = data.glyphDither.gamma ?? this.config.gamma;
          this.config.softness = data.glyphDither.softness ?? this.config.softness;
          this.config.minR = data.glyphDither.minR ?? this.config.minR;
          this.config.maxR = data.glyphDither.maxR ?? this.config.maxR;
          this.config.invert = data.glyphDither.invert ?? this.config.invert;
          this.config.bayer = data.glyphDither.bayer ?? this.config.bayer;
          this.config.bayerStrength = data.glyphDither.bayerStrength ?? this.config.bayerStrength;
        }
        if (data.heroTextBlob) {
          this.config.blobBlur = data.heroTextBlob.blobBlur ?? this.config.blobBlur;
          this.config.blobInset = data.heroTextBlob.blobInset ?? this.config.blobInset;
          this.config.blobRotate = data.heroTextBlob.blobRotate ?? this.config.blobRotate;
          this.config.blobSkew = data.heroTextBlob.blobSkew ?? this.config.blobSkew;
          this.config.blobOpacity = data.heroTextBlob.blobOpacity ?? this.config.blobOpacity;
          this.config.blobRadiusA = data.heroTextBlob.blobRadiusA ?? this.config.blobRadiusA;
          this.config.blobRadiusB = data.heroTextBlob.blobRadiusB ?? this.config.blobRadiusB;
          this.config.blobRadiusC = data.heroTextBlob.blobRadiusC ?? this.config.blobRadiusC;
          this.config.blobRadiusD = data.heroTextBlob.blobRadiusD ?? this.config.blobRadiusD;
          this.config.blobAnimate = data.heroTextBlob.blobAnimate ?? this.config.blobAnimate;
          this.config.blobAnimationSpeed = data.heroTextBlob.blobAnimationSpeed ?? this.config.blobAnimationSpeed;
          this.config.blobNoiseScale = data.heroTextBlob.blobNoiseScale ?? this.config.blobNoiseScale;
          this.config.blobNoiseAmplitude = data.heroTextBlob.blobNoiseAmplitude ?? this.config.blobNoiseAmplitude;
          this.config.blobNoiseSpeed = data.heroTextBlob.blobNoiseSpeed ?? this.config.blobNoiseSpeed;
          this.config.blobNoiseDrift = data.heroTextBlob.blobNoiseDrift ?? this.config.blobNoiseDrift;
          this.config.blobNoisePhase = data.heroTextBlob.blobNoisePhase ?? this.config.blobNoisePhase;
          this.config.blobNoiseAngle = data.heroTextBlob.blobNoiseAngle ?? this.config.blobNoiseAngle;
        }
      }
    } catch (error) {
      console.warn('Failed to load saved Hero 9 settings:', error);
    }
    // ==================================================================
    
    this.container = document.getElementById('webgl-background');
    if (!this.container) {
      console.error('Container #webgl-background not found!');
      return;
    }
    console.log('Container found:', this.container);

    this.sceneA = new THREE.Scene();
    this.sceneC = new THREE.Scene();
    this.sceneB = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    console.log('Renderer created and appended to container');

    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderTarget = new THREE.WebGLRenderTarget(
      Math.floor(window.innerWidth * dpr),
      Math.floor(window.innerHeight * dpr),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    this.renderTargetComposite = new THREE.WebGLRenderTarget(
      Math.floor(window.innerWidth * dpr),
      Math.floor(window.innerHeight * dpr),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    // Uniforms - Pass A (Noise Gradient)
    this.uniformsA = {
      uTime: { value: 0 },
      uScale: { value: this.config.scale },
      uAmplitude: { value: this.config.amplitude },
      uSpeed: { value: this.config.speed },
      uDrift: { value: this.config.drift },
      uColorShift: { value: this.config.colorShift },
      uSkew: { value: this.config.skew },
      uAngle: { value: this.config.angle * Math.PI / 180.0 },
      uPhase: { value: this.config.phase },
      uThreshold: { value: this.config.threshold },
      uMix: { value: this.config.mix },
      uColorWhite: { value: new THREE.Vector3(this.config.colorWhite.r, this.config.colorWhite.g, this.config.colorWhite.b) },
      uColorBlue: { value: new THREE.Vector3(this.config.colorBlue.r, this.config.colorBlue.g, this.config.colorBlue.b) },
      uColorPurple: { value: new THREE.Vector3(this.config.colorPurple.r, this.config.colorPurple.g, this.config.colorPurple.b) },
      uColorPink: { value: new THREE.Vector3(this.config.colorPink.r, this.config.colorPink.g, this.config.colorPink.b) },
      uColorTeal: { value: new THREE.Vector3(this.config.colorTeal.r, this.config.colorTeal.g, this.config.colorTeal.b) },
      uColorLightBlue: { value: new THREE.Vector3(this.config.colorLightBlue.r, this.config.colorLightBlue.g, this.config.colorLightBlue.b) },
      uColorWhitePercent: { value: this.config.colorWhitePercent },
      uColorBluePercent: { value: this.config.colorBluePercent },
      uColorPurplePercent: { value: this.config.colorPurplePercent },
      uColorPinkPercent: { value: this.config.colorPinkPercent },
      uColorTealPercent: { value: this.config.colorTealPercent },
      uColorLightBluePercent: { value: this.config.colorLightBluePercent }
    };

    // Uniforms - Pass C (Blob Composite)
    this.uniformsC = {
      uSource: { value: this.renderTarget.texture },
      uResolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
      uBlobRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uBlobBlurPx: { value: this.config.blobBlur },
      uBlobRotate: { value: this.config.blobRotate },
      uBlobSkew: { value: this.config.blobSkew },
      uBlobOpacity: { value: this.config.blobOpacity },
      uRadiusA: { value: this.config.blobRadiusA / 100 },
      uRadiusB: { value: this.config.blobRadiusB / 100 },
      uRadiusC: { value: this.config.blobRadiusC / 100 },
      uRadiusD: { value: this.config.blobRadiusD / 100 },
      uTime: { value: 0 },
      uBlobNoiseScale: { value: this.config.blobNoiseScale },
      uBlobNoiseAmplitude: { value: this.config.blobNoiseAmplitude },
      uBlobNoiseSpeed: { value: this.config.blobNoiseSpeed },
      uBlobNoiseDrift: { value: this.config.blobNoiseDrift },
      uBlobNoisePhase: { value: this.config.blobNoisePhase },
      uBlobNoiseAngle: { value: this.config.blobNoiseAngle * Math.PI / 180.0 }
    };

    this.uniformsB = {
      uSource: { value: this.renderTargetComposite.texture },
      uResolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
      uCellPx: { value: this.config.cellPx },
      uContrast: { value: this.config.contrast },
      uGamma: { value: this.config.gamma },
      uSoftness: { value: this.config.softness },
      uMinR: { value: this.config.minR },
      uMaxR: { value: this.config.maxR },
      uInvert: { value: this.config.invert ? 1.0 : 0.0 },
      uBayer: { value: this.config.bayer ? 1.0 : 0.0 },
      uBayerStrength: { value: this.config.bayerStrength }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShaderA = `
      uniform float uTime;
      uniform float uScale;
      uniform float uAmplitude;
      uniform float uSpeed;
      uniform float uDrift;
      uniform float uColorShift;
      uniform float uSkew;
      uniform float uAngle;
      uniform float uPhase;
      uniform float uThreshold;
      uniform float uMix;
      uniform vec3 uColorWhite;
      uniform vec3 uColorBlue;
      uniform vec3 uColorPurple;
      uniform vec3 uColorPink;
      uniform vec3 uColorTeal;
      uniform vec3 uColorLightBlue;
      uniform float uColorWhitePercent;
      uniform float uColorBluePercent;
      uniform float uColorPurplePercent;
      uniform float uColorPinkPercent;
      uniform float uColorTealPercent;
      uniform float uColorLightBluePercent;
      varying vec2 vUv;

      // Smooth Perlin noise implementation
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float perlin(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        
        // Smooth interpolation (quintic hermite)
        vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
        
        return mix(
          mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
              dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
          mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
              dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      // Rotation matrix
      mat2 rotate(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      // Oklab color space conversions for vibrant gradients
      vec3 srgb_to_linear(vec3 c) {
        vec3 v = c / 255.0;
        return mix(
          v / 12.92,
          pow((v + 0.055) / 1.055, vec3(2.4)),
          step(0.04045, v)
        );
      }

      vec3 linear_to_srgb(vec3 c) {
        vec3 v = mix(
          12.92 * c,
          1.055 * pow(c, vec3(1.0/2.4)) - 0.055,
          step(0.0031308, c)
        );
        return v * 255.0;
      }

      vec3 linear_srgb_to_oklab(vec3 c) {
        float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
        float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
        float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;

        float l_ = pow(l, 1.0/3.0);
        float m_ = pow(m, 1.0/3.0);
        float s_ = pow(s, 1.0/3.0);

        return vec3(
          0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
          1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
          0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
        );
      }

      vec3 oklab_to_linear_srgb(vec3 c) {
        float l_ = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
        float m_ = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
        float s_ = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;

        float l = l_ * l_ * l_;
        float m = m_ * m_ * m_;
        float s = s_ * s_ * s_;

        return vec3(
          +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
          -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
          -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
        );
      }

      vec3 rgb_to_oklab(vec3 rgb) {
        return linear_srgb_to_oklab(srgb_to_linear(rgb * 255.0));
      }

      vec3 oklab_to_rgb(vec3 oklab) {
        return linear_to_srgb(oklab_to_linear_srgb(oklab)) / 255.0;
      }

      vec3 mix_oklab(vec3 color1, vec3 color2, float t) {
        vec3 lab1 = rgb_to_oklab(color1);
        vec3 lab2 = rgb_to_oklab(color2);
        vec3 mixed = mix(lab1, lab2, t);
        return oklab_to_rgb(mixed);
      }

      void main() {
        vec2 uv = vUv;
        
        // Apply rotation
        vec2 center = vec2(0.5);
        vec2 rotatedUv = rotate(uAngle) * (uv - center) + center;
        
        // Apply skew
        vec2 skewedUv = rotatedUv;
        skewedUv.x += rotatedUv.y * uSkew;
        
        // Time with speed multiplier
        float t = uTime * uSpeed;
        
        // Base noise position with drift
        vec2 pos = skewedUv * uScale + vec2(t * uDrift, t * uDrift * 0.5);
        
        // Add phase offset
        pos += uPhase * 10.0;
        
        // Smooth Perlin noise with amplitude
        float n = perlin(pos) * uAmplitude;
        
        // Threshold creates the wave separation
        float waves = smoothstep(uThreshold - 0.1, uThreshold + 0.1, n * 0.5 + 0.5);
        
        // Color gradient animation with color shift
        float pattern = perlin(skewedUv * 3.0 + t * uColorShift) * 0.5 + 0.5;
        
        // Dynamic gradient based on color percentages
        vec3 gradColor;
        pattern = fract(pattern);
        
        // Normalize percentages (white + gradient colors = 100)
        float total = uColorWhitePercent + uColorBluePercent + uColorPurplePercent + uColorPinkPercent + uColorTealPercent + uColorLightBluePercent;
        if (total < 0.0001) {
          total = 1.0;
        }
        float whiteNorm = uColorWhitePercent / total;
        float blueNorm = uColorBluePercent / total;
        float purpleNorm = uColorPurplePercent / total;
        float pinkNorm = uColorPinkPercent / total;
        float tealNorm = uColorTealPercent / total;
        float lightBlueNorm = uColorLightBluePercent / total;
        
        // Calculate cumulative thresholds for each color segment
        // Each color gets two segments: pure color + transition
        float whiteEnd = whiteNorm * 0.5;
        float whiteTrans = whiteNorm;
        float blueEnd = whiteTrans + blueNorm * 0.5;
        float blueTrans = whiteTrans + blueNorm;
        float purpleEnd = blueTrans + purpleNorm * 0.5;
        float purpleTrans = blueTrans + purpleNorm;
        float pinkEnd = purpleTrans + pinkNorm * 0.5;
        float pinkTrans = purpleTrans + pinkNorm;
        float tealEnd = pinkTrans + tealNorm * 0.5;
        float tealTrans = pinkTrans + tealNorm;
        float lightBlueEnd = tealTrans + lightBlueNorm * 0.5;
        float lightBlueTrans = tealTrans + lightBlueNorm; // Should be 1.0
        
        // Assign colors based on dynamic thresholds
        if (pattern < whiteEnd) {
          gradColor = mix_oklab(uColorWhite, uColorWhite, pattern / max(whiteEnd, 0.0001)); // Pure white
        } else if (pattern < whiteTrans) {
          float t = (pattern - whiteEnd) / max(whiteTrans - whiteEnd, 0.0001);
          gradColor = mix_oklab(uColorWhite, uColorBlue, t);
        } else if (pattern < blueEnd) {
          float t = (pattern - whiteTrans) / max(blueEnd - whiteTrans, 0.0001);
          gradColor = mix_oklab(uColorBlue, uColorBlue, t); // Pure blue
        } else if (pattern < blueTrans) {
          float t = (pattern - blueEnd) / max(blueTrans - blueEnd, 0.0001);
          gradColor = mix_oklab(uColorBlue, uColorPurple, t);
        } else if (pattern < purpleEnd) {
          float t = (pattern - blueTrans) / max(purpleEnd - blueTrans, 0.0001);
          gradColor = mix_oklab(uColorPurple, uColorPurple, t); // Pure purple
        } else if (pattern < purpleTrans) {
          float t = (pattern - purpleEnd) / max(purpleTrans - purpleEnd, 0.0001);
          gradColor = mix_oklab(uColorPurple, uColorPink, t);
        } else if (pattern < pinkEnd) {
          float t = (pattern - purpleTrans) / max(pinkEnd - purpleTrans, 0.0001);
          gradColor = mix_oklab(uColorPink, uColorPink, t); // Pure pink
        } else if (pattern < pinkTrans) {
          float t = (pattern - pinkEnd) / max(pinkTrans - pinkEnd, 0.0001);
          gradColor = mix_oklab(uColorPink, uColorTeal, t);
        } else if (pattern < tealEnd) {
          float t = (pattern - pinkTrans) / max(tealEnd - pinkTrans, 0.0001);
          gradColor = mix_oklab(uColorTeal, uColorTeal, t); // Pure teal
        } else if (pattern < tealTrans) {
          float t = (pattern - tealEnd) / max(tealTrans - tealEnd, 0.0001);
          gradColor = mix_oklab(uColorTeal, uColorLightBlue, t);
        } else if (pattern < lightBlueEnd) {
          float t = (pattern - tealTrans) / max(lightBlueEnd - tealTrans, 0.0001);
          gradColor = mix_oklab(uColorLightBlue, uColorLightBlue, t); // Pure light blue
        } else {
          float t = (pattern - lightBlueEnd) / max(lightBlueTrans - lightBlueEnd, 0.0001);
          gradColor = mix_oklab(uColorLightBlue, uColorWhite, t); // Wrap to white
        }
        
        // Use threshold to separate colors sharply (no white, no greys)
        // Saturate the colors by boosting them
        vec3 color = gradColor * (1.0 + waves * 0.2); // Brighten by 20% in wave areas
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const fragmentShaderC = `
      precision highp float;
      uniform sampler2D uSource;
      uniform vec2 uResolution;
      uniform vec4 uBlobRect; // x, y, w, h in pixels
      uniform float uBlobBlurPx;
      uniform float uBlobRotate;
      uniform float uBlobSkew;
      uniform float uBlobOpacity;
      uniform float uRadiusA;
      uniform float uRadiusB;
      uniform float uRadiusC;
      uniform float uRadiusD;
      uniform float uTime;
      uniform float uBlobNoiseScale;
      uniform float uBlobNoiseAmplitude;
      uniform float uBlobNoiseSpeed;
      uniform float uBlobNoiseDrift;
      uniform float uBlobNoisePhase;
      uniform float uBlobNoiseAngle;

      // Smooth Perlin noise (same as wave noise)
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float perlin(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
        return mix(
          mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
              dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
          mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
              dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      mat2 rotate(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      float calcRadius(float t) {
        if (t < 0.25) {
          return mix(uRadiusA, uRadiusB, t / 0.25);
        } else if (t < 0.5) {
          return mix(uRadiusB, uRadiusC, (t - 0.25) / 0.25);
        } else if (t < 0.75) {
          return mix(uRadiusC, uRadiusD, (t - 0.5) / 0.25);
        }
        return mix(uRadiusD, uRadiusA, (t - 0.75) / 0.25);
      }

      void main() {
        vec3 srcColor = texture2D(uSource, gl_FragCoord.xy / uResolution).rgb;

        vec2 rectPos = uBlobRect.xy;
        vec2 rectSize = uBlobRect.zw;
        vec2 center = rectPos + rectSize * 0.5;
        vec2 pos = gl_FragCoord.xy - center;

        float rot = radians(uBlobRotate);
        float cosR = cos(-rot);
        float sinR = sin(-rot);
        mat2 rotMat = mat2(cosR, -sinR, sinR, cosR);
        pos = rotMat * pos;

        float skew = tan(radians(uBlobSkew));
        pos.x -= skew * pos.y;

        vec2 halfSize = rectSize * 0.5;
        vec2 p = pos / halfSize;
        float r = length(p);

        float angle = atan(p.y, p.x);
        float t = (angle + 3.14159265) / (6.2831853);
        float radius = calcRadius(t);
        
        // Apply Perlin noise to blob edge (matches wave animation)
        vec2 noiseUv = rotate(uBlobNoiseAngle) * p;
        float time = uTime * uBlobNoiseSpeed;
        vec2 noisePos = noiseUv * uBlobNoiseScale + vec2(time * uBlobNoiseDrift, time * uBlobNoiseDrift * 0.5) + uBlobNoisePhase * 10.0;
        float n = perlin(noisePos) * uBlobNoiseAmplitude;
        radius += n;

        float blurNorm = clamp((uBlobBlurPx / min(rectSize.x, rectSize.y)) * 2.0, 0.02, 0.35);
        float inner = max(0.0, radius - blurNorm);
        float mask = smoothstep(radius, inner, r);
        mask = mask * uBlobOpacity;

        vec3 finalColor = mix(srcColor, vec3(1.0), mask);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const fragmentShaderB = `
      precision highp float;
      uniform sampler2D uSource;
      uniform vec2 uResolution;
      uniform float uCellPx;
      uniform float uContrast;
      uniform float uGamma;
      uniform float uSoftness;
      uniform float uMinR;
      uniform float uMaxR;
      uniform float uInvert;
      uniform float uBayer;
      uniform float uBayerStrength;

      float bayer4x4(vec2 p) {
        vec2 f = mod(p, 4.0);
        float index = f.x + f.y * 4.0;
        float m[16];
        m[0] = 0.0;  m[1] = 8.0;  m[2] = 2.0;  m[3] = 10.0;
        m[4] = 12.0; m[5] = 4.0;  m[6] = 14.0; m[7] = 6.0;
        m[8] = 3.0;  m[9] = 11.0; m[10] = 1.0; m[11] = 9.0;
        m[12] = 15.0; m[13] = 7.0; m[14] = 13.0; m[15] = 5.0;
        float v = m[int(index)] / 16.0;
        return v;
      }

      void main() {
        vec2 frag = gl_FragCoord.xy;
        vec2 cell = floor(frag / uCellPx);
        vec2 local = fract(frag / uCellPx);

        vec2 uvCenter = ((cell + 0.5) * uCellPx) / uResolution;
        vec3 srcColor = texture2D(uSource, uvCenter).rgb;

        float lum = dot(srcColor, vec3(0.2126, 0.7152, 0.0722));
        lum = clamp((lum - 0.5) * uContrast + 0.5, 0.0, 1.0);
        lum = pow(lum, uGamma);

        if (uBayer > 0.5) {
          float b = bayer4x4(frag);
          lum = clamp(lum + (b - 0.5) * uBayerStrength, 0.0, 1.0);
        }

        float v = (uInvert > 0.5) ? lum : (1.0 - lum);
        float radius = mix(uMinR, uMaxR, v);

        float dist = length(local - 0.5);
        float dotMask = smoothstep(radius, radius - uSoftness, dist);

        vec3 dotColor = srcColor;
        vec3 bgColor = vec3(1.0);
        vec3 finalColor = mix(bgColor, dotColor, dotMask);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create material and mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const materialA = new THREE.ShaderMaterial({
      uniforms: this.uniformsA,
      vertexShader,
      fragmentShader: fragmentShaderA
    });
    const materialC = new THREE.ShaderMaterial({
      uniforms: this.uniformsC,
      vertexShader,
      fragmentShader: fragmentShaderC
    });
    const materialB = new THREE.ShaderMaterial({
      uniforms: this.uniformsB,
      vertexShader,
      fragmentShader: fragmentShaderB
    });

    const meshA = new THREE.Mesh(geometry, materialA);
    const meshC = new THREE.Mesh(geometry, materialC);
    const meshB = new THREE.Mesh(geometry, materialB);
    this.sceneA.add(meshA);
    this.sceneC.add(meshC);
    this.sceneB.add(meshB);
    console.log('Meshes added to scenes');

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Start animation
    this.applyBlobStyles();
    this.updateBlobRect();
    this.createControls();

    this.animate();
    console.log('Animation started');
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(dpr);
    this.renderTarget.setSize(Math.floor(width * dpr), Math.floor(height * dpr));
    this.renderTargetComposite.setSize(Math.floor(width * dpr), Math.floor(height * dpr));
    this.uniformsC.uResolution.value.set(width * dpr, height * dpr);
    this.uniformsB.uResolution.value.set(width * dpr, height * dpr);
    this.updateBlobRect();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    
    this.uniformsA.uTime.value += 0.016;
    this.uniformsC.uTime.value += 0.016;
    this.animateBlob();
    this.updateBlobRect();

    // Pass A: Noise Animation
    if (this.layerToggles.noiseAnimation) {
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.render(this.sceneA, this.camera);
    }

    // Pass C: Blob Composite
    if (this.layerToggles.blob) {
      this.renderer.setRenderTarget(this.renderTargetComposite);
      this.renderer.render(this.sceneC, this.camera);
    }

    // Pass B: Glyph Dither (final output)
    if (this.layerToggles.glyphDither) {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.sceneB, this.camera);
    } else if (this.layerToggles.blob) {
      // If dither is off but blob is on, show the composite
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.sceneC, this.camera);
    } else if (this.layerToggles.noiseAnimation) {
      // If both dither and blob are off but noise is on, show the noise
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.sceneA, this.camera);
    } else {
      // All WebGL layers off, clear to black
      this.renderer.setRenderTarget(null);
      this.renderer.clear();
    }
  };

  applyBlobStyles() {
    const heroContent = document.querySelector('.hero-9 .hero-content');
    if (!heroContent) {
      return;
    }
    const radius = `${this.config.blobRadiusA}% ${this.config.blobRadiusB}% ${this.config.blobRadiusC}% ${this.config.blobRadiusD}% / ${this.config.blobRadiusB}% ${this.config.blobRadiusC}% ${this.config.blobRadiusD}% ${this.config.blobRadiusA}%`;
    heroContent.style.setProperty('--blob-blur', `${this.config.blobBlur}px`);
    heroContent.style.setProperty('--blob-rotate', `${this.config.blobRotate}deg`);
    heroContent.style.setProperty('--blob-skew', `${this.config.blobSkew}deg`);
    heroContent.style.setProperty('--blob-inset', `${this.config.blobInset}px`);
    heroContent.style.setProperty('--blob-opacity', `${this.config.blobOpacity}`);
    heroContent.style.setProperty('--blob-radius', radius);

    this.uniformsC.uBlobBlurPx.value = this.config.blobBlur;
    this.uniformsC.uBlobRotate.value = this.config.blobRotate;
    this.uniformsC.uBlobSkew.value = this.config.blobSkew;
    this.uniformsC.uBlobOpacity.value = this.config.blobOpacity;
    this.uniformsC.uRadiusA.value = this.config.blobRadiusA / 100;
    this.uniformsC.uRadiusB.value = this.config.blobRadiusB / 100;
    this.uniformsC.uRadiusC.value = this.config.blobRadiusC / 100;
    this.uniformsC.uRadiusD.value = this.config.blobRadiusD / 100;
    this.uniformsC.uBlobNoiseScale.value = this.config.blobNoiseScale;
    this.uniformsC.uBlobNoiseAmplitude.value = this.config.blobNoiseAmplitude;
    this.uniformsC.uBlobNoiseSpeed.value = this.config.blobNoiseSpeed;
    this.uniformsC.uBlobNoiseDrift.value = this.config.blobNoiseDrift;
    this.uniformsC.uBlobNoisePhase.value = this.config.blobNoisePhase;
    this.uniformsC.uBlobNoiseAngle.value = this.config.blobNoiseAngle * Math.PI / 180.0;
  }

  updateBlobRect() {
    const heroContent = document.querySelector('.hero-9 .hero-content');
    if (!heroContent) {
      return;
    }
    const rect = heroContent.getBoundingClientRect();
    const inset = this.config.blobInset;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const left = (rect.left + inset) * dpr;
    const top = (rect.top + inset) * dpr;
    const width = (rect.width - inset * 2) * dpr;
    const height = (rect.height - inset * 2) * dpr;
    this.uniformsC.uBlobRect.value.set(left, top, Math.max(1, width), Math.max(1, height));
  }

  animateBlob() {
    if (!this.config.blobAnimate) {
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) {
      return;
    }
    if (!this.blobStartTime) {
      this.blobStartTime = performance.now();
    }
    const t = (performance.now() - this.blobStartTime) * 0.001 * this.config.blobAnimationSpeed;
    const rot = this.config.blobRotate + Math.sin(t) * 2.0;
    const skew = this.config.blobSkew + Math.sin(t * 0.7) * 3.0;
    const radiusDelta = Math.sin(t * 0.9) * 5.0;
    this.uniformsC.uBlobRotate.value = rot;
    this.uniformsC.uBlobSkew.value = skew;
    this.uniformsC.uRadiusA.value = (this.config.blobRadiusA + radiusDelta) / 100;
    this.uniformsC.uRadiusB.value = (this.config.blobRadiusB - radiusDelta) / 100;
    this.uniformsC.uRadiusC.value = (this.config.blobRadiusC + radiusDelta) / 100;
    this.uniformsC.uRadiusD.value = (this.config.blobRadiusD - radiusDelta) / 100;
  }

  createControls() {
    const panel = document.createElement('div');
    panel.style.position = 'absolute';
    panel.style.top = '100px';
    panel.style.right = '20px';
    panel.style.zIndex = '30';
    panel.style.background = 'rgba(255,255,255,0.9)';
    panel.style.padding = '12px 14px';
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
    panel.style.fontFamily = 'Roboto, sans-serif';
    panel.style.fontSize = '12px';
    panel.style.color = '#111';
    panel.style.display = 'grid';
    panel.style.gap = '8px';
    panel.style.maxWidth = '240px';
    panel.style.maxHeight = '70vh';
    panel.style.overflow = 'auto';

    const title = document.createElement('div');
    title.textContent = 'Hero 9 Controls';
    title.style.fontWeight = '700';
    title.style.marginBottom = '4px';

    // Layer toggle states
    this.layerToggles = {
      noiseAnimation: true,
      glyphDither: true,
      blob: true,
      grain: true
    };

    const makeAccordion = (label, defaultOpen = true) => {
      const container = document.createElement('div');
      container.style.marginTop = '8px';
      
      const header = document.createElement('div');
      header.style.fontWeight = '600';
      header.style.padding = '8px';
      header.style.background = 'rgba(0,0,0,0.04)';
      header.style.borderRadius = '6px';
      header.style.cursor = 'pointer';
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.userSelect = 'none';
      
      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      
      const arrow = document.createElement('span');
      arrow.textContent = defaultOpen ? '▼' : '▶';
      arrow.style.fontSize = '10px';
      
      header.appendChild(labelSpan);
      header.appendChild(arrow);
      
      const content = document.createElement('div');
      content.style.display = defaultOpen ? 'grid' : 'none';
      content.style.gap = '8px';
      content.style.padding = '8px 0';
      
      header.addEventListener('click', () => {
        const isOpen = content.style.display === 'grid';
        content.style.display = isOpen ? 'none' : 'grid';
        arrow.textContent = isOpen ? '▶' : '▼';
      });
      
      container.appendChild(header);
      container.appendChild(content);
      
      return { container, content };
    };

    const makeLayerToggle = (label, layerKey, onChange) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.justifyContent = 'space-between';
      wrapper.style.alignItems = 'center';
      wrapper.style.padding = '6px';
      wrapper.style.background = 'rgba(0,120,255,0.05)';
      wrapper.style.borderRadius = '4px';
      wrapper.style.marginBottom = '4px';
      
      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      labelSpan.style.fontWeight = '500';
      
      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.checked = this.layerToggles[layerKey];
      toggle.style.cursor = 'pointer';
      toggle.addEventListener('change', () => {
        this.layerToggles[layerKey] = toggle.checked;
        onChange(toggle.checked);
      });
      
      wrapper.appendChild(labelSpan);
      wrapper.appendChild(toggle);
      return wrapper;
    };

    const section = (label) => {
      const el = document.createElement('div');
      el.textContent = label;
      el.style.fontWeight = '600';
      el.style.marginTop = '6px';
      el.style.paddingTop = '6px';
      el.style.borderTop = '1px solid rgba(0,0,0,0.08)';
      return el;
    };

    const makeLabel = (text) => {
      const label = document.createElement('label');
      label.style.display = 'grid';
      label.style.gap = '4px';
      label.textContent = text;
      return label;
    };

    const makeRange = (min, max, step, value, onInput) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.gap = '8px';
      wrapper.style.alignItems = 'center';
      
      const input = document.createElement('input');
      input.type = 'range';
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = value;
      input.style.flex = '1';
      
      const valueSpan = document.createElement('span');
      valueSpan.textContent = value;
      valueSpan.style.minWidth = '45px';
      valueSpan.style.fontSize = '11px';
      valueSpan.style.color = '#666';
      valueSpan.style.textAlign = 'right';
      
      input.addEventListener('input', () => {
        const val = parseFloat(input.value);
        valueSpan.textContent = val;
        onInput(val);
      });
      
      wrapper.appendChild(input);
      wrapper.appendChild(valueSpan);
      wrapper.input = input;
      wrapper.valueSpan = valueSpan;
      return wrapper;
    };

    const makeCheckbox = (checked, onChange) => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = checked;
      input.addEventListener('change', () => onChange(input.checked));
      return input;
    };

    const makeColor = (value, onChange) => {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = value;
      input.addEventListener('input', () => onChange(input.value));
      return input;
    };

    const toHex = (c) => {
      const v = Math.max(0, Math.min(255, Math.round(c * 255)));
      return v.toString(16).padStart(2, '0');
    };

    const rgbToHex = (color) => `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;

    const hexToRgb = (hex) => {
      const h = hex.replace('#', '').trim();
      const r = parseInt(h.slice(0, 2), 16) / 255;
      const g = parseInt(h.slice(2, 4), 16) / 255;
      const b = parseInt(h.slice(4, 6), 16) / 255;
      return { r, g, b };
    };

    const getCurrentSettings = () => {
      const c = (v) => ({ r: v.x, g: v.y, b: v.z });
      return {
        gradientColors: {
          colorWhite: c(this.uniformsA.uColorWhite.value),
          colorBlue: c(this.uniformsA.uColorBlue.value),
          colorPurple: c(this.uniformsA.uColorPurple.value),
          colorPink: c(this.uniformsA.uColorPink.value),
          colorTeal: c(this.uniformsA.uColorTeal.value),
          colorLightBlue: c(this.uniformsA.uColorLightBlue.value),
          colorWhitePercent: this.config.colorWhitePercent,
          colorBluePercent: this.config.colorBluePercent,
          colorPurplePercent: this.config.colorPurplePercent,
          colorPinkPercent: this.config.colorPinkPercent,
          colorTealPercent: this.config.colorTealPercent,
          colorLightBluePercent: this.config.colorLightBluePercent
        },
        perlinNoise: {
          scale: this.config.scale,
          amplitude: this.config.amplitude,
          speed: this.config.speed,
          drift: this.config.drift,
          colorShift: this.config.colorShift,
          skew: this.config.skew,
          angle: this.config.angle,
          phase: this.config.phase,
          threshold: this.config.threshold,
          mix: this.config.mix
        },
        glyphDither: {
          cellPx: this.uniformsB.uCellPx.value,
          contrast: this.uniformsB.uContrast.value,
          gamma: this.uniformsB.uGamma.value,
          softness: this.uniformsB.uSoftness.value,
          minR: this.uniformsB.uMinR.value,
          maxR: this.uniformsB.uMaxR.value,
          invert: this.uniformsB.uInvert.value > 0.5,
          bayer: this.uniformsB.uBayer.value > 0.5,
          bayerStrength: this.uniformsB.uBayerStrength.value
        },
        heroTextBlob: {
          blobBlur: this.config.blobBlur,
          blobInset: this.config.blobInset,
          blobRotate: this.config.blobRotate,
          blobSkew: this.config.blobSkew,
          blobOpacity: this.config.blobOpacity,
          blobRadiusA: this.config.blobRadiusA,
          blobRadiusB: this.config.blobRadiusB,
          blobRadiusC: this.config.blobRadiusC,
          blobRadiusD: this.config.blobRadiusD,
          blobAnimate: this.config.blobAnimate,
          blobAnimationSpeed: this.config.blobAnimationSpeed,
          blobNoiseScale: this.config.blobNoiseScale,
          blobNoiseAmplitude: this.config.blobNoiseAmplitude,
          blobNoiseSpeed: this.config.blobNoiseSpeed,
          blobNoiseDrift: this.config.blobNoiseDrift,
          blobNoisePhase: this.config.blobNoisePhase,
          blobNoiseAngle: this.config.blobNoiseAngle
        }
      };
    };

    const downloadSettings = () => {
      const data = getCurrentSettings();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hero9-settings.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const saveSettings = () => {
      const data = getCurrentSettings();
      localStorage.setItem('hero9Settings', JSON.stringify(data));
    };

    panel.appendChild(title);

    // Layer toggles section
    const layersSection = makeAccordion('Layer Visibility', true);
    layersSection.content.appendChild(makeLayerToggle('Noise Animation', 'noiseAnimation', (enabled) => {
      // Handled in render loop
    }));
    layersSection.content.appendChild(makeLayerToggle('Glyph Dither', 'glyphDither', (enabled) => {
      // Handled in render loop
    }));
    layersSection.content.appendChild(makeLayerToggle('Hero Text Blob', 'blob', (enabled) => {
      // Handled in render loop
    }));
    layersSection.content.appendChild(makeLayerToggle('Grain Overlay', 'grain', (enabled) => {
      const grainEl = document.querySelector('.grain-overlay');
      if (grainEl) grainEl.style.display = enabled ? 'block' : 'none';
    }));
    panel.appendChild(layersSection.container);

    // Glyph Dither section
    const glyphSection = makeAccordion('Glyph Dither', false);
    
    const cellLabel = makeLabel('Cell Size (px)');
    cellLabel.appendChild(makeRange(1, 36, 1, this.config.cellPx, (v) => {
      this.uniformsB.uCellPx.value = v;
    }));

    const contrastLabel = makeLabel('Contrast');
    contrastLabel.appendChild(makeRange(0.5, 5.0, 0.05, this.config.contrast, (v) => {
      this.uniformsB.uContrast.value = v;
    }));

    const gammaLabel = makeLabel('Gamma');
    gammaLabel.appendChild(makeRange(0.5, 4.5, 0.05, this.config.gamma, (v) => {
      this.uniformsB.uGamma.value = v;
    }));

    const softLabel = makeLabel('Dot Softness');
    softLabel.appendChild(makeRange(0.0, 0.5, 0.01, this.config.softness, (v) => {
      this.uniformsB.uSoftness.value = v;
    }));

    glyphSection.content.appendChild(cellLabel);
    glyphSection.content.appendChild(contrastLabel);
    glyphSection.content.appendChild(gammaLabel);
    glyphSection.content.appendChild(softLabel);
    panel.appendChild(glyphSection.container);

    // Gradient Colors section
    const colorsSection = makeAccordion('Gradient Colors', false);

    const whiteLabel = makeLabel('White');
    whiteLabel.appendChild(makeColor(rgbToHex(this.config.colorWhite), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorWhite.value.set(c.r, c.g, c.b);
    }));

    const blueLabel = makeLabel('Blue');
    blueLabel.appendChild(makeColor(rgbToHex(this.config.colorBlue), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorBlue.value.set(c.r, c.g, c.b);
    }));

    const purpleLabel = makeLabel('Purple');
    purpleLabel.appendChild(makeColor(rgbToHex(this.config.colorPurple), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorPurple.value.set(c.r, c.g, c.b);
    }));

    const pinkLabel = makeLabel('Pink');
    pinkLabel.appendChild(makeColor(rgbToHex(this.config.colorPink), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorPink.value.set(c.r, c.g, c.b);
    }));

    const tealLabel = makeLabel('Teal');
    tealLabel.appendChild(makeColor(rgbToHex(this.config.colorTeal), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorTeal.value.set(c.r, c.g, c.b);
    }));

    const lightBlueLabel = makeLabel('Light Blue');
    lightBlueLabel.appendChild(makeColor(rgbToHex(this.config.colorLightBlue), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorLightBlue.value.set(c.r, c.g, c.b);
    }));

    const whitePercentLabel = makeLabel('White %');
    const whitePercentRange = makeRange(0, 100, 1, this.config.colorWhitePercent, (v) => {
      this.config.colorWhitePercent = v;
      normalizeColorPercents('colorWhitePercent');
    });
    whitePercentLabel.appendChild(whitePercentRange);

    const bluePercentLabel = makeLabel('Blue %');
    const bluePercentRange = makeRange(0, 100, 1, this.config.colorBluePercent, (v) => {
      this.config.colorBluePercent = v;
      normalizeColorPercents('colorBluePercent');
    });
    bluePercentLabel.appendChild(bluePercentRange);

    const purplePercentLabel = makeLabel('Purple %');
    const purplePercentRange = makeRange(0, 100, 1, this.config.colorPurplePercent, (v) => {
      this.config.colorPurplePercent = v;
      normalizeColorPercents('colorPurplePercent');
    });
    purplePercentLabel.appendChild(purplePercentRange);

    const pinkPercentLabel = makeLabel('Pink %');
    const pinkPercentRange = makeRange(0, 100, 1, this.config.colorPinkPercent, (v) => {
      this.config.colorPinkPercent = v;
      normalizeColorPercents('colorPinkPercent');
    });
    pinkPercentLabel.appendChild(pinkPercentRange);

    const tealPercentLabel = makeLabel('Teal %');
    const tealPercentRange = makeRange(0, 100, 1, this.config.colorTealPercent, (v) => {
      this.config.colorTealPercent = v;
      normalizeColorPercents('colorTealPercent');
    });
    tealPercentLabel.appendChild(tealPercentRange);

    const lightBluePercentLabel = makeLabel('Light Blue %');
    const lightBluePercentRange = makeRange(0, 100, 1, this.config.colorLightBluePercent, (v) => {
      this.config.colorLightBluePercent = v;
      normalizeColorPercents('colorLightBluePercent');
    });
    lightBluePercentLabel.appendChild(lightBluePercentRange);

    const percentControls = [
      { key: 'colorWhitePercent', uniform: 'uColorWhitePercent', range: whitePercentRange },
      { key: 'colorBluePercent', uniform: 'uColorBluePercent', range: bluePercentRange },
      { key: 'colorPurplePercent', uniform: 'uColorPurplePercent', range: purplePercentRange },
      { key: 'colorPinkPercent', uniform: 'uColorPinkPercent', range: pinkPercentRange },
      { key: 'colorTealPercent', uniform: 'uColorTealPercent', range: tealPercentRange },
      { key: 'colorLightBluePercent', uniform: 'uColorLightBluePercent', range: lightBluePercentRange }
    ];

    const syncPercentUI = () => {
      percentControls.forEach(({ key, uniform, range }) => {
        const val = Math.max(0, Math.min(100, Math.round(this.config[key])));
        this.config[key] = val;
        this.uniformsA[uniform].value = val;
        range.input.value = val;
        range.valueSpan.textContent = val;
      });
    };

    const normalizeColorPercents = (changedKey) => {
      const keys = percentControls.map((c) => c.key);
      const fixed = Math.max(0, Math.min(100, Math.round(this.config[changedKey])));
      this.config[changedKey] = fixed;

      const remainingKeys = keys.filter((k) => k !== changedKey);
      const remainingTotal = remainingKeys.reduce((sum, k) => sum + this.config[k], 0);
      const targetRemaining = Math.max(0, 100 - fixed);

      if (remainingKeys.length > 0) {
        if (remainingTotal <= 0) {
          const even = targetRemaining / remainingKeys.length;
          remainingKeys.forEach((k) => { this.config[k] = even; });
        } else {
          const scale = targetRemaining / remainingTotal;
          remainingKeys.forEach((k) => { this.config[k] = this.config[k] * scale; });
        }

        // Round and fix any leftover due to rounding
        let roundedSum = fixed;
        remainingKeys.forEach((k, idx) => {
          const isLast = idx === remainingKeys.length - 1;
          const rounded = isLast
            ? Math.max(0, Math.round(targetRemaining - (roundedSum - fixed)))
            : Math.max(0, Math.round(this.config[k]));
          this.config[k] = rounded;
          roundedSum += rounded;
        });
      }

      syncPercentUI();
    };

    colorsSection.content.appendChild(whiteLabel);
    colorsSection.content.appendChild(blueLabel);
    colorsSection.content.appendChild(purpleLabel);
    colorsSection.content.appendChild(pinkLabel);
    colorsSection.content.appendChild(tealLabel);
    colorsSection.content.appendChild(lightBlueLabel);
    colorsSection.content.appendChild(whitePercentLabel);
    colorsSection.content.appendChild(bluePercentLabel);
    colorsSection.content.appendChild(purplePercentLabel);
    colorsSection.content.appendChild(pinkPercentLabel);
    colorsSection.content.appendChild(tealPercentLabel);
    colorsSection.content.appendChild(lightBluePercentLabel);
    normalizeColorPercents('colorWhitePercent');
    panel.appendChild(colorsSection.container);

    // Perlin Noise Animation section
    const noiseSection = makeAccordion('Perlin Noise Fill', true);

    const scaleLabel = makeLabel('Scale');
    scaleLabel.appendChild(makeRange(1.0, 30.0, 0.1, this.config.scale, (v) => {
      this.config.scale = v;
      this.uniformsA.uScale.value = v;
    }));

    const amplitudeLabel = makeLabel('Amplitude');
    amplitudeLabel.appendChild(makeRange(0.0, 2.0, 0.01, this.config.amplitude, (v) => {
      this.config.amplitude = v;
      this.uniformsA.uAmplitude.value = v;
    }));

    const speedLabel = makeLabel('Speed');
    speedLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.speed, (v) => {
      this.config.speed = v;
      this.uniformsA.uSpeed.value = v;
    }));

    const driftLabel = makeLabel('Drift');
    driftLabel.appendChild(makeRange(0.0, 2.0, 0.01, this.config.drift, (v) => {
      this.config.drift = v;
      this.uniformsA.uDrift.value = v;
    }));

    const colorShiftLabel = makeLabel('Color Shift');
    colorShiftLabel.appendChild(makeRange(0.0, 2.0, 0.01, this.config.colorShift, (v) => {
      this.config.colorShift = v;
      this.uniformsA.uColorShift.value = v;
    }));

    const skewLabel = makeLabel('Skew');
    skewLabel.appendChild(makeRange(0.0, 2.0, 0.01, this.config.skew, (v) => {
      this.config.skew = v;
      this.uniformsA.uSkew.value = v;
    }));

    const angleLabel = makeLabel('Angle');
    angleLabel.appendChild(makeRange(-180, 180, 1, this.config.angle, (v) => {
      this.config.angle = v;
      this.uniformsA.uAngle.value = v * Math.PI / 180.0;
    }));

    const phaseLabel = makeLabel('Phase');
    phaseLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.phase, (v) => {
      this.config.phase = v;
      this.uniformsA.uPhase.value = v;
    }));

    const thresholdLabel = makeLabel('Threshold');
    thresholdLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.threshold, (v) => {
      this.config.threshold = v;
      this.uniformsA.uThreshold.value = v;
    }));

    const mixLabel = makeLabel('Mix');
    mixLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.mix, (v) => {
      this.config.mix = v;
      this.uniformsA.uMix.value = v;
    }));

    noiseSection.content.appendChild(scaleLabel);
    noiseSection.content.appendChild(amplitudeLabel);
    noiseSection.content.appendChild(speedLabel);
    noiseSection.content.appendChild(driftLabel);
    noiseSection.content.appendChild(colorShiftLabel);
    noiseSection.content.appendChild(skewLabel);
    noiseSection.content.appendChild(angleLabel);
    noiseSection.content.appendChild(phaseLabel);
    noiseSection.content.appendChild(thresholdLabel);
    noiseSection.content.appendChild(mixLabel);
    panel.appendChild(noiseSection.container);

    // Hero Text Blob section
    const blobSection = makeAccordion('Hero Text Mask Blob', false);

    const blobBlurLabel = makeLabel('Blob Blur');
    blobBlurLabel.appendChild(makeRange(0, 150, 1, this.config.blobBlur, (v) => {
      this.config.blobBlur = v;
      this.applyBlobStyles();
    }));

    const blobInsetLabel = makeLabel('Blob Inset');
    blobInsetLabel.appendChild(makeRange(-500, 50, 1, this.config.blobInset, (v) => {
      this.config.blobInset = v;
      this.applyBlobStyles();
    }));

    const blobRotateLabel = makeLabel('Blob Rotate');
    blobRotateLabel.appendChild(makeRange(-90, 90, 0.5, this.config.blobRotate, (v) => {
      this.config.blobRotate = v;
      this.applyBlobStyles();
    }));

    const blobSkewLabel = makeLabel('Blob Skew');
    blobSkewLabel.appendChild(makeRange(-60, 60, 0.5, this.config.blobSkew, (v) => {
      this.config.blobSkew = v;
      this.applyBlobStyles();
    }));

    const blobOpacityLabel = makeLabel('Blob Opacity');
    blobOpacityLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.blobOpacity, (v) => {
      this.config.blobOpacity = v;
      this.applyBlobStyles();
    }));

    const blobRadiusALabel = makeLabel('Radius A');
    blobRadiusALabel.appendChild(makeRange(5, 150, 1, this.config.blobRadiusA, (v) => {
      this.config.blobRadiusA = v;
      this.applyBlobStyles();
    }));

    const blobRadiusBLabel = makeLabel('Radius B');
    blobRadiusBLabel.appendChild(makeRange(5, 150, 1, this.config.blobRadiusB, (v) => {
      this.config.blobRadiusB = v;
      this.applyBlobStyles();
    }));

    const blobRadiusCLabel = makeLabel('Radius C');
    blobRadiusCLabel.appendChild(makeRange(5, 150, 1, this.config.blobRadiusC, (v) => {
      this.config.blobRadiusC = v;
      this.applyBlobStyles();
    }));

    const blobRadiusDLabel = makeLabel('Radius D');
    blobRadiusDLabel.appendChild(makeRange(5, 180, 1, this.config.blobRadiusD, (v) => {
      this.config.blobRadiusD = v;
      this.applyBlobStyles();
    }));

    const blobAnimateLabel = makeLabel('Animate');
    blobAnimateLabel.appendChild(makeCheckbox(this.config.blobAnimate, (v) => {
      this.config.blobAnimate = v;
      this.applyBlobStyles();
    }));

    const blobSpeedLabel = makeLabel('Animation Speed');
    blobSpeedLabel.appendChild(makeRange(0.0, 5.0, 0.1, this.config.blobAnimationSpeed, (v) => {
      this.config.blobAnimationSpeed = v;
    }));

    const blobNoiseScaleLabel = makeLabel('Noise Scale');
    blobNoiseScaleLabel.appendChild(makeRange(1.0, 30.0, 0.1, this.config.blobNoiseScale, (v) => {
      this.config.blobNoiseScale = v;
      this.applyBlobStyles();
    }));

    const blobNoiseAmplitudeLabel = makeLabel('Noise Amplitude');
    blobNoiseAmplitudeLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.blobNoiseAmplitude, (v) => {
      this.config.blobNoiseAmplitude = v;
      this.applyBlobStyles();
    }));

    const blobNoiseSpeedLabel = makeLabel('Noise Speed');
    blobNoiseSpeedLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.blobNoiseSpeed, (v) => {
      this.config.blobNoiseSpeed = v;
      this.applyBlobStyles();
    }));

    const blobNoiseDriftLabel = makeLabel('Noise Drift');
    blobNoiseDriftLabel.appendChild(makeRange(0.0, 2.0, 0.01, this.config.blobNoiseDrift, (v) => {
      this.config.blobNoiseDrift = v;
      this.applyBlobStyles();
    }));

    const blobNoisePhaseLabel = makeLabel('Noise Phase');
    blobNoisePhaseLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.blobNoisePhase, (v) => {
      this.config.blobNoisePhase = v;
      this.applyBlobStyles();
    }));

    const blobNoiseAngleLabel = makeLabel('Noise Angle');
    blobNoiseAngleLabel.appendChild(makeRange(-180, 180, 1, this.config.blobNoiseAngle, (v) => {
      this.config.blobNoiseAngle = v;
      this.applyBlobStyles();
    }));

    blobSection.content.appendChild(blobBlurLabel);
    blobSection.content.appendChild(blobInsetLabel);
    blobSection.content.appendChild(blobRotateLabel);
    blobSection.content.appendChild(blobSkewLabel);
    blobSection.content.appendChild(blobOpacityLabel);
    blobSection.content.appendChild(blobRadiusALabel);
    blobSection.content.appendChild(blobRadiusBLabel);
    blobSection.content.appendChild(blobRadiusCLabel);
    blobSection.content.appendChild(blobRadiusDLabel);
    blobSection.content.appendChild(blobAnimateLabel);
    blobSection.content.appendChild(blobSpeedLabel);
    blobSection.content.appendChild(blobNoiseScaleLabel);
    blobSection.content.appendChild(blobNoiseAmplitudeLabel);
    blobSection.content.appendChild(blobNoiseSpeedLabel);
    blobSection.content.appendChild(blobNoiseDriftLabel);
    blobSection.content.appendChild(blobNoisePhaseLabel);
    blobSection.content.appendChild(blobNoiseAngleLabel);
    panel.appendChild(blobSection.container);

    // Save & Download section
    panel.appendChild(section('Save / Download'));

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = '8px';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.textContent = 'Save';
    saveBtn.style.padding = '6px 10px';
    saveBtn.style.borderRadius = '6px';
    saveBtn.style.border = '1px solid #ddd';
    saveBtn.style.background = '#fff';
    saveBtn.style.cursor = 'pointer';
    saveBtn.addEventListener('click', saveSettings);

    const downloadBtn = document.createElement('button');
    downloadBtn.type = 'button';
    downloadBtn.textContent = 'Download';
    downloadBtn.style.padding = '6px 10px';
    downloadBtn.style.borderRadius = '6px';
    downloadBtn.style.border = '1px solid #ddd';
    downloadBtn.style.background = '#fff';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.addEventListener('click', downloadSettings);

    buttonRow.appendChild(saveBtn);
    buttonRow.appendChild(downloadBtn);
    panel.appendChild(buttonRow);

    document.body.appendChild(panel);
  }
}

// Initialize
console.log('Script loaded, waiting for DOM...');

function init() {
  console.log('DOM ready, creating effect...');
  try {
    new NoiseWarpEffect();
  } catch (error) {
    console.error('Error creating NoiseWarpEffect:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
