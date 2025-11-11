const fs = require('fs');
const path = require('path');

// Read all .tsx files
const srcDir = path.join(__dirname, 'src');
const files = [];

function walkDir(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !item.includes('node_modules')) {
      walkDir(fullPath);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  });
}

walkDir(srcDir);

// Extract translation keys
const keys = new Set();
const regex = /t\(['"`]([^'"`]+)['"`]\)/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
});

// Load en.json
const enPath = path.join(__dirname, 'src', 'i18n', 'locales', 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getAllKeys(obj, prefix = '') {
  let result = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      result = result.concat(getAllKeys(obj[key], fullKey));
    } else {
      result.push(fullKey);
    }
  }
  return result;
}

const existingKeys = new Set(getAllKeys(en));
const usedKeys = Array.from(keys).sort();
const missingKeys = usedKeys.filter(k => !existingKeys.has(k));

console.log('=== USED TRANSLATION KEYS ===');
console.log(`Total: ${usedKeys.length}\n`);

if (missingKeys.length > 0) {
  console.log('=== MISSING KEYS IN en.json ===');
  console.log(`Count: ${missingKeys.length}\n`);
  missingKeys.forEach(key => console.log(`  ${key}`));
} else {
  console.log('✓ All keys exist in en.json');
}
