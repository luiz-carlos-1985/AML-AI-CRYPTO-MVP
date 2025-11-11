const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const enPath = path.join(localesDir, 'en.json');

// Load English as reference
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Get all keys from English
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const allKeys = getAllKeys(en);
console.log('Total translation keys in English:', allKeys.length);
console.log('\nAll keys:');
allKeys.forEach(key => console.log(`  - ${key}`));

// Check other languages
const languages = ['pt', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ko', 'ru', 'ar'];

console.log('\n\nChecking other languages for missing keys:\n');

languages.forEach(lang => {
  const langPath = path.join(localesDir, `${lang}.json`);
  const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  const langKeys = getAllKeys(langData);
  
  const missingKeys = allKeys.filter(key => !langKeys.includes(key));
  
  if (missingKeys.length > 0) {
    console.log(`${lang.toUpperCase()}: Missing ${missingKeys.length} keys`);
    missingKeys.forEach(key => console.log(`  - ${key}`));
  } else {
    console.log(`${lang.toUpperCase()}: ✓ All keys present`);
  }
});
