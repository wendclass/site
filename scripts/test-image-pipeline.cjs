// Unit test for image processing format detection and validation logic
const assert = require('assert');

// Simulate the magic bytes logic in Node.js
function detectFormat(bytes) {
  if (bytes.length < 4) return { format: 'unknown', mime: 'application/octet-stream' };

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { format: 'jpeg', mime: 'image/jpeg' };
  }
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return { format: 'png', mime: 'image/png' };
  }
  // WebP: RIFF ... WEBP
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes.length >= 12 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return { format: 'webp', mime: 'image/webp' };
  }
  // GIF: GIF87a / GIF89a
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return { format: 'gif', mime: 'image/gif' };
  }
  // SVG
  const text = Buffer.from(bytes).toString('utf-8').toLowerCase().trim();
  if (text.startsWith('<?xml') || text.includes('<svg')) {
    return { format: 'svg', mime: 'image/svg+xml' };
  }
  // HEIC
  if (bytes.length >= 12) {
    const ftyp = Buffer.from(bytes.slice(4, 12)).toString('utf-8');
    if (ftyp.includes('heic') || ftyp.includes('mif1') || ftyp.includes('heix') || ftyp.includes('hevc')) {
      return { format: 'heic', mime: 'image/heic' };
    }
  }

  return { format: 'unknown', mime: 'application/octet-stream' };
}

// 1. JPEG
const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
assert.strictEqual(detectFormat(jpeg).format, 'jpeg');

// 2. PNG
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
assert.strictEqual(detectFormat(png).format, 'png');

// 3. WebP
const webp = Buffer.from([
  0x52, 0x49, 0x46, 0x46, // RIFF
  0x00, 0x00, 0x00, 0x00,
  0x57, 0x45, 0x42, 0x50, // WEBP
]);
assert.strictEqual(detectFormat(webp).format, 'webp');

// 4. GIF
const gif = Buffer.from('GIF89a...');
assert.strictEqual(detectFormat(gif).format, 'gif');

// 5. SVG
const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"></svg>');
assert.strictEqual(detectFormat(svg).format, 'svg');

// 6. HEIC
const heic = Buffer.from([0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63]);
assert.strictEqual(detectFormat(heic).format, 'heic');

// 7. Unknown / EXE
const exe = Buffer.from([0x4d, 0x5a, 0x90, 0x00]);
assert.strictEqual(detectFormat(exe).format, 'unknown');

console.log('✅ ALL MAGIC BYTES TESTS PASSED SUCCESSFULLY!');
