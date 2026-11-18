const fs = require('fs');
const code = fs.readFileSync('suitup_component.js', 'utf8');

const urls = code.match(/https:\/\/[^"'\s)]+/g) || [];
console.log('URLs in suitup component:', [...new Set(urls)]);

// Find exported component or functions
const exports = code.match(/export\s*\{[^}]+\}/g) || [];
console.log('Exports:', exports);
