# Font Installation Guide

## ✅ Installed Fonts

### Roboto Font
- **Status**: ✅ **Installed & Active**
- **Source**: Google Fonts
- **Weights**: 300, 400, 500, 600, 700
- **Used for**: Base typography, headings, buttons, navigation

Roboto is now the primary font family used throughout the website. It's loaded from Google Fonts CDN for optimal performance.

---

## 📦 Phonic Trial Font

### Current Status
- **Status**: ⏳ Ready for installation
- **Location**: `/fonts/` directory
- **Type**: Trial version (requires custom font files)

### Installation Instructions

#### Option 1: Download from Font Provider (Recommended)

1. **Obtain the Font Files**
   - Purchase or download Phonic Trial from:
     - [MyFonts](https://www.myfonts.com)
     - [Font foundry website](https://phonic-trial-source.com)
     - Or your font provider

2. **Prepare Font Files**
   - You need these formats:
     - `phonic-trial-regular.woff2` (Regular weight)
     - `phonic-trial-regular.woff` (Fallback)
     - `phonic-trial-regular.ttf` (Fallback)
     - `phonic-trial-bold.woff2` (Bold weight - optional)
     - `phonic-trial-bold.woff` (Fallback)
     - `phonic-trial-bold.ttf` (Fallback)

3. **Add Font Files**
   - Place all font files in: `/fonts/`
   - Directory should look like:
     ```
     fonts/
     ├── fonts.css
     ├── phonic-trial-regular.woff2
     ├── phonic-trial-regular.woff
     ├── phonic-trial-regular.ttf
     ├── phonic-trial-bold.woff2
     ├── phonic-trial-bold.woff
     └── phonic-trial-bold.ttf
     ```

4. **Enable in CSS**
   - Open `/fonts/fonts.css`
   - Uncomment the `@font-face` declarations for Phonic Trial
   - Uncomment the font-family variable:
     ```css
     --font-family-heading: 'Phonic Trial', 'Roboto', sans-serif;
     ```

5. **Apply to Headings (Optional)**
   - Add to `styles.css`:
     ```css
     h1, h2, h3, h4, h5, h6 {
         font-family: var(--font-family-heading);
     }
     ```

#### Option 2: Use Google Fonts Alternative

If you can't find Phonic Trial, here are similar fonts on Google Fonts:
- **Poppins** - Modern, geometric sans-serif
- **Inter** - Professional, clean sans-serif
- **Raleway** - Elegant, modern sans-serif
- **DM Sans** - Contemporary, minimalist sans-serif

Add to index.html:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## 🎨 Font Usage in Code

### Using Fonts in CSS

```css
/* Body text - uses Roboto */
body {
    font-family: var(--font-family-base);
}

/* Headings - uses Phonic Trial (when installed) or Roboto */
h1, h2, h3 {
    font-family: var(--font-family-heading);
}

/* Custom elements */
.heading-special {
    font-family: 'Phonic Trial', 'Roboto', sans-serif;
    font-weight: 700;
}
```

### Font Weights Available

**Roboto:**
- `font-weight: 300` - Light
- `font-weight: 400` - Regular (body text)
- `font-weight: 500` - Medium
- `font-weight: 600` - SemiBold (buttons, nav)
- `font-weight: 700` - Bold (headings)

**Phonic Trial:**
- Check your font provider for available weights
- Typically: 400 (Regular), 700 (Bold)

---

## 🚀 Font Performance Tips

1. **WOFF2 Format**: Smallest file size, best compression
2. **font-display: swap**: Ensures text is visible while fonts load
3. **Preconnect**: Already added for Google Fonts
4. **Self-hosted fonts**: Copy format hierarchy
   ```
   WOFF2 > WOFF > TTF
   ```

---

## 📋 Current Font Setup

### In `index.html`:
```html
<!-- Google Fonts: Roboto -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Custom Fonts -->
<link rel="stylesheet" href="fonts/fonts.css">
```

### In `fonts/fonts.css`:
```css
:root {
    --font-family-base: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-family-heading: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

---

## ❓ Troubleshooting

### Fonts not loading?
1. Check browser DevTools → Network tab
2. Verify font files exist in `/fonts/` directory
3. Check CSS @font-face paths are correct
4. Clear browser cache (Ctrl+Shift+R)

### Phonic Trial fallback not working?
1. Ensure font-family fallback order is correct
2. Always include 'Roboto' as fallback
3. Test in incognito mode (fresh cache)

### Performance issues?
1. Use WOFF2 format (smallest files)
2. Load only necessary weights
3. Use `font-display: swap` for faster text display

---

## 📞 Need Help?

- **Google Fonts**: Visit [fonts.google.com](https://fonts.google.com)
- **Font Converter**: Use [fontsquirrel.com](https://www.fontsquirrel.com) to convert fonts to web formats
- **Testing**: Use [webpagefx.com/tools/text-render](https://www.webpagefx.com/tools/text-render) to test fonts

---

**Last Updated**: January 28, 2026
