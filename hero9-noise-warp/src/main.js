import * as THREE from 'three';
import SimplexNoise from './simplexNoise.js';
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

class NoiseWarpEffect {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    this.container = document.getElementById('canvas-container');
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x0a0a0a);
    this.container.appendChild(this.renderer.domElement);

    // Uniforms
    this.uniforms = {
      uTexture: { value: this.createDefaultTexture() },
      uTime: { value: 0 },
      uIntensity: { value: 0.5 },
      uScale: { value: 1 },
      uSpeed: { value: 0.5 },
      uTurbulence: { value: 1 }
    };

    // Create geometry and material
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    // Event listeners
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Control listeners
    document.getElementById('intensitySlider').addEventListener('input', (e) => {
      this.uniforms.uIntensity.value = parseFloat(e.target.value);
      document.getElementById('intensityValue').textContent = parseFloat(e.target.value).toFixed(2);
    });

    document.getElementById('scaleSlider').addEventListener('input', (e) => {
      this.uniforms.uScale.value = parseFloat(e.target.value);
      document.getElementById('scaleValue').textContent = parseFloat(e.target.value).toFixed(2);
    });

    document.getElementById('speedSlider').addEventListener('input', (e) => {
      this.uniforms.uSpeed.value = parseFloat(e.target.value);
      document.getElementById('speedValue').textContent = parseFloat(e.target.value).toFixed(2);
    });

    document.getElementById('turbulenceSlider').addEventListener('input', (e) => {
      this.uniforms.uTurbulence.value = parseInt(e.target.value);
      document.getElementById('turbulenceValue').textContent = e.target.value;
    });

    document.getElementById('imageInput').addEventListener('change', (e) => {
      this.loadImage(e.target.files[0]);
    });

    this.animate();
    this.setupFPS();
  }

  createDefaultTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Create a gradient pattern
    const gradient = ctx.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    // Add some noise-like pattern
    const imageData = ctx.getImageData(0, 0, 256, 256);
    const data = imageData.data;
    const simplex = new SimplexNoise(Math.random);

    for (let i = 0; i < data.length; i += 4) {
      const index = i / 4;
      const x = (index % 256) / 256;
      const y = Math.floor(index / 256) / 256;
      const noise = (simplex.noise(x * 4, y * 4) + 1) / 2;
      const value = Math.floor(noise * 255);

      data[i] = Math.min(255, data[i] + value * 0.3);
      data[i + 1] = Math.min(255, data[i + 1] + value * 0.2);
      data[i + 2] = Math.min(255, data[i + 2] + value * 0.4);
    }

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  loadImage(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        this.uniforms.uTexture.value = texture;
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    this.uniforms.uTime.value += 0.016; // ~60fps
    this.renderer.render(this.scene, this.camera);
  };

  setupFPS() {
    let frameCount = 0;
    let lastTime = performance.now();

    setInterval(() => {
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;
      const fps = Math.round((frameCount * 1000) / elapsed);
      document.getElementById('fpsCounter').textContent = `FPS: ${fps}`;
      frameCount = 0;
      lastTime = currentTime;
    }, 1000);

    const originalAnimate = this.animate;
    this.animate = () => {
      frameCount++;
      originalAnimate.call(this);
    };
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NoiseWarpEffect();
});
