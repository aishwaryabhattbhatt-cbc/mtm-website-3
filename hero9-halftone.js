/**
 * Hero 9 - Inverted Halftone Mask Effect
 * White mask with transparent circular holes revealing gradient noise beneath
 */

class InvertedHalftoneMask {
  constructor() {
    // ===== CONFIGURATION - Change these values for faster testing =====
    this.config = {
      // Grid Settings
      gridSpacing: 6,             // Distance between circles (px) - smaller = denser
      
      // Circle Size Range
      minCircleSize: 0,           // Minimum circle radius (px) - for brightest areas
      maxCircleSize: 4,           // Maximum circle radius (px) - for darkest areas
      
      // Mask Settings
      maskColor: '#FFFFFF',       // Color of the mask (white)
      maskOpacity: 1.0,           // Opacity of white mask (0.0 - 1.0)
      
      // Sampling Settings
      brightnessBoost: 1.2,       // Multiplier for brightness (higher = more contrast)
      invertBrightness: true,     // true = dark areas get big holes, false = opposite
      
      // Performance
      updateInterval: 0          // ms between samples (0 = every frame, 16 = 60fps cap)
    };
    // ==================================================================
    
    this.container = document.getElementById('webgl-background');
    if (!this.container) {
      console.error('Container #webgl-background not found!');
      return;
    }
    
    // Get the WebGL canvas to sample from
    this.sourceCanvas = this.container.querySelector('canvas');
    if (!this.sourceCanvas) {
      console.error('WebGL canvas not found!');
      return;
    }
    
    // Create halftone mask layer
    this.maskLayer = document.createElement('div');
    this.maskLayer.className = 'halftone-mask';
    this.maskLayer.style.position = 'absolute';
    this.maskLayer.style.top = '0';
    this.maskLayer.style.left = '0';
    this.maskLayer.style.width = '100%';
    this.maskLayer.style.height = '100%';
    this.maskLayer.style.zIndex = '7';
    this.maskLayer.style.pointerEvents = 'none';
    
    // Create canvas for mask
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.maskLayer.appendChild(this.canvas);
    
    // Add to container's parent (hero-section)
    this.container.parentElement.appendChild(this.maskLayer);
    
    this.resize();
    
    // Handle resize
    window.addEventListener('resize', () => this.resize());
    
    // Start sampling and drawing
    this.lastUpdate = 0;
    this.animate();
    
    console.log('InvertedHalftoneMask initialized');
  }
  
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
  }
  
  samplePixel(x, y) {
    // Get pixel data from source WebGL canvas
    try {
      const gl = this.sourceCanvas.getContext('webgl2') || this.sourceCanvas.getContext('webgl');
      if (!gl) return 0.5;
      
      const pixels = new Uint8Array(4);
      gl.readPixels(x, this.sourceCanvas.height - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      
      // Calculate brightness (0 = dark, 1 = bright)
      const brightness = (pixels[0] + pixels[1] + pixels[2]) / (3 * 255);
      return brightness;
    } catch (e) {
      // Fallback if sampling fails
      return 0.5;
    }
  }
  
  draw() {
    const spacing = this.config.gridSpacing;
    
    // Clear and fill with white mask
    this.ctx.fillStyle = this.config.maskColor;
    this.ctx.globalAlpha = this.config.maskOpacity;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Set composite mode to cut holes
    this.ctx.globalCompositeOperation = 'destination-out';
    
    // Sample and draw circles
    for (let y = spacing / 2; y < this.height + spacing; y += spacing) {
      for (let x = spacing / 2; x < this.width + spacing; x += spacing) {
        // Sample brightness from source canvas
        const brightness = this.samplePixel(x, y) * this.config.brightnessBoost;
        
        // Calculate circle size (inverted: dark = big, light = small)
        let normalizedBrightness = Math.min(Math.max(brightness, 0), 1);
        if (this.config.invertBrightness) {
          normalizedBrightness = 1 - normalizedBrightness; // Invert
        }
        
        const radius = this.config.minCircleSize + 
                      (this.config.maxCircleSize - this.config.minCircleSize) * normalizedBrightness;
        
        // Draw transparent circle (cuts hole in mask)
        if (radius > 0) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, radius, 0, Math.PI * 2);
          this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Fully transparent hole
          this.ctx.fill();
        }
      }
    }
    
    // Reset composite mode
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = 1.0;
  }
  
  animate = (timestamp = 0) => {
    requestAnimationFrame(this.animate);
    
    // Update every frame for smooth animation
    this.draw();
  };
}

// Initialize
console.log('Halftone mask script loaded, waiting for DOM...');

function init() {
  console.log('DOM ready, waiting for WebGL canvas...');
  
  // Wait for WebGL canvas to be ready
  const checkCanvas = setInterval(() => {
    const container = document.getElementById('webgl-background');
    const canvas = container?.querySelector('canvas');
    
    if (canvas) {
      clearInterval(checkCanvas);
      console.log('WebGL canvas found, creating halftone mask...');
      
      // Give WebGL a moment to render first frame
      setTimeout(() => {
        try {
          new InvertedHalftoneMask();
        } catch (error) {
          console.error('Error creating InvertedHalftoneMask:', error);
        }
      }, 100);
    }
  }, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
