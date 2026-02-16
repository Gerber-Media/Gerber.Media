#!/usr/bin/env node

/**
 * Simple minification build script for Gerber.Media
 * Minifies JS and CSS files in-place or to dist/ folder.
 * 
 * Usage:
 *   node build.js              # minify to dist/
 *   node build.js --inline     # minify in-place
 */

const fs = require('fs');
const path = require('path');

// Simple regex-based minifier (for small projects like this)
function minifyJS(code) {
  return code
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,=+\-*/%<>!&|^~?:])\s*/g, '$1')
    .trim();
}

function minifyCSS(code) {
  return code
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    .replace(/\s+([\w-])/g, ' $1')
    .trim();
}

const inline = process.argv.includes('--inline');
const outDir = inline ? null : path.join(__dirname, 'dist');

// Ensure dist/ exists if not inline
if (!inline && !fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Files to minify
const files = [
  { src: 'js/main.js', dest: 'js/main.min.js', minify: minifyJS },
  { src: 'js/language-detect.js', dest: 'js/language-detect.min.js', minify: minifyJS },
  { src: 'js/privacy-banner.js', dest: 'js/privacy-banner.min.js', minify: minifyJS },
  { src: 'css/style.css', dest: 'css/style.min.css', minify: minifyCSS },
];

files.forEach(({ src, dest, minify }) => {
  const srcPath = path.join(__dirname, src);
  if (!fs.existsSync(srcPath)) {
    console.log(`⚠️  Skipping ${src} (not found)`);
    return;
  }

  const code = fs.readFileSync(srcPath, 'utf8');
  const minified = minify(code);
  const destPath = path.join(__dirname, dest);

  fs.writeFileSync(destPath, minified, 'utf8');
  const origSize = code.length;
  const minSize = minified.length;
  const savings = ((1 - minSize / origSize) * 100).toFixed(1);
  console.log(`✓ ${dest}: ${origSize} → ${minSize} bytes (${savings}% saved)`);
});

console.log('\n✓ Minification complete!');
if (!inline) {
  console.log(`  Files available at: .min.js/.min.css`);
}
