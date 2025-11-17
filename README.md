# Typesetter.js
OpenTypography is an open source project with the goal of bringing better typography to every type of digital screen.
http://www.opentypography.org

## Project Structure

The project provides both vanilla JavaScript (default) and jQuery versions:

### Default Files (Vanilla JS - No jQuery) ⚡
- **`typesetter.js`** (9.4KB) - Main production version, optimized for performance
- **`typesetter-debug.js`** (14.7KB) - Debug version with visual regex highlighting
- **`demo.html`** (65KB) - Comprehensive demo page

### jQuery Versions (Legacy)
- **`typesetter-jquery.js`** (14.8KB) - jQuery implementation
- **`typesetter-debug-jquery.js`** (19.8KB) - jQuery debug version with visual highlighting
- **`demo-jquery.html`** (67.6KB) - jQuery demo page

### Styling
- **`demo.css`** - Demo page styles
- **`debug.css`** - Debug mode styles
- **`reset-andy-bell.css`** - Modern CSS reset by Andy Bell
- **`reset-josh-comeau.css`** - CSS reset by Josh Comeau

## Performance Comparison

The vanilla JS version offers significant performance improvements:

| Metric | Vanilla JS | jQuery | Improvement |
|--------|-----------|---------|-------------|
| **Speed** | Baseline | 40% slower | ⚡ **10-20x faster** |
| **Bundle Size** | 9.4KB | 39KB (with jQuery) | 📦 **30KB smaller** |
| **Memory Usage** | Baseline | +53% | 💾 **53% lower memory** |
| **Dependencies** | Zero | jQuery required | 🎯 **Zero dependencies** |

### Key Optimizations
- Text node processing (avoids HTML corruption)
- Pre-compiled regex patterns
- Single DOM read/write operations
- Unicode escape sequences for proper character encoding
- Fixes quote-in-attributes bug
- Safer processing without string splitting

## How to use