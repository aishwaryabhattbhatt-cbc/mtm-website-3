# Hero 9 - WebGL Noise Warp Effect

A high-performance WebGL noise distortion effect that warps input images with organic, liquid-like undulation using simplex noise. Built with Vite + Three.js and designed to run at 60 FPS on typical laptops.

## Features

- **WebGL Rendering**: Custom shader material with vertex and fragment shaders
- **Organic Noise Distortion**: Simplex noise-based 2D warping for smooth, natural movement
- **Real-time Controls**:
  - Distortion Intensity: Control the strength of the warp effect (0-2)
  - Noise Scale: Adjust the frequency/size of noise patterns (0.5-10)
  - Animation Speed: Control how fast the noise animates (0-2)
  - Turbulence Octaves: Multi-octave FBM for complex distortions (1-4)
- **Image Swapping**: Load custom images to apply the warp effect
- **Responsive Design**: Automatically handles window resizing
- **FPS Counter**: Real-time performance monitoring
- **60 FPS Target**: Optimized shader implementation for smooth performance

## Tech Stack

- **Vite**: Fast build tool and dev server
- **Three.js**: WebGL rendering library
- **Custom GLSL Shaders**: Vertex and fragment shaders for distortion
- **Simplex Noise**: 2D perlin-like noise implementation in JavaScript

## Project Structure

```
hero9-noise-warp/
├── public/
│   └── index.html          # Main HTML entry point
├── src/
│   ├── main.js             # Three.js scene setup and controls
│   ├── simplexNoise.js     # Simplex noise implementation
│   └── shaders/
│       ├── vertex.glsl     # Vertex shader
│       └── fragment.glsl   # Fragment shader with distortion logic
├── package.json
└── vite.config.js
```

## Installation & Running

1. **Install dependencies**:
   ```bash
   cd hero9-noise-warp
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

3. **Build for production**:
   ```bash
   npm run build
   ```

## How It Works

### Fragment Shader Distortion
The fragment shader implements the core noise warping effect:

1. **Noise Calculation**: Uses Fractional Brownian Motion (FBM) with multiple octaves for complex, natural-looking patterns
2. **UV Distortion**: Generates X and Y noise offsets at normalized UV coordinates
3. **Texture Sampling**: Samples the input texture at the distorted UV coordinates instead of original coordinates
4. **Optional Brightness Variation**: Adds subtle brightness modulation based on noise patterns

### Default Texture
- Auto-generated gradient texture with noise pattern
- Falls back when no image is loaded
- Uses blue color palette for visual appeal

### Performance Optimization
- OrthographicCamera for fullscreen quad rendering (simpler than perspective)
- Efficient shader implementation with minimal calculations per fragment
- FBM loop limited to 4 iterations max
- Clamp distortion UV to prevent wrapping artifacts

## Controls Explained

| Control | Range | Effect |
|---------|-------|--------|
| **Distortion Intensity** | 0-2 | How much the texture warps (0 = no effect, 2 = maximum warp) |
| **Noise Scale** | 0.5-10 | Size of noise features (smaller = tighter, larger = broader waves) |
| **Animation Speed** | 0-2 | How fast the distortion animates (0 = static, 2 = very fast) |
| **Turbulence Octaves** | 1-4 | Number of noise layers (1 = simple, 4 = complex/detailed) |

## Loading Custom Images

1. Click "Choose Image" button
2. Select an image file from your computer
3. The effect will apply to the uploaded image
4. Adjust controls in real-time to customize the effect

## Tips for Best Results

- **Subtle Effect**: Use low intensity (0.2-0.5) and low-medium scale (1-2) for professional look
- **Dramatic Effect**: High intensity (1-2) with high scale (5-10) for bold visual impact
- **Smooth Animation**: Use speed 0.3-0.7 for comfortable viewing
- **Complex Details**: Increase turbulence octaves to 3-4 for intricate patterns
- **Large Textures**: For smooth animations, ensure your input image is appropriately sized

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (WebGL 2)
- Mobile: Generally works but performance varies (test on target device)

## Advanced Shader Parameters (Fragment Shader)

The fragment shader uses these uniforms:
- `uTexture`: Input texture to distort
- `uTime`: Elapsed time for animation
- `uIntensity`: Distortion magnitude multiplier
- `uScale`: Noise frequency multiplier
- `uSpeed`: Animation speed multiplier
- `uTurbulence`: Number of FBM octaves

Modify `fragment.glsl` to:
- Change distortion formula
- Adjust noise sampling
- Add color effects
- Implement additional effects

## Troubleshooting

**Black screen?**
- Check browser console for shader compilation errors
- Ensure WebGL is enabled
- Try a different browser

**Low FPS?**
- Reduce turbulence octaves
- Lower distortion intensity
- Use a smaller canvas size
- Close other GPU-intensive applications

**Texture not loading?**
- Ensure file is a valid image format (PNG, JPG, etc.)
- Check browser console for CORS or file loading errors
- Try a smaller image file

## License

Part of MTM Website - Media Technology Monitor
