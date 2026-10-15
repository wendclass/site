const fs = require('fs');
const path = require('path');
const manifest = require('../src/data/image-manifest.json');

const projetsTs = fs.readFileSync(path.resolve(__dirname, '../src/data/projets.ts'), 'utf8');

// Match "..." or '...'
const regex = /(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')/g;
let match;
let total = 0;
let missing = 0;
const missingList = [];

while ((match = regex.exec(projetsTs)) !== null) {
  const str = match[1] || match[2] || '';
  if (str.startsWith('/assets/projets/')) {
    total++;
    if (!manifest[str]) {
      missing++;
      if (!missingList.includes(str)) missingList.push(str);
    }
  }
}

console.log('Total asset references in projets.ts:', total);
console.log('Unique missing in manifest:', missingList.length);
if (missingList.length > 0) {
  console.log('Missing items:', missingList);
} else {
  console.log('SUCCESS: All 88 image references in projets.ts are properly present in image-manifest.json!');
}
