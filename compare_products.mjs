import fs from 'fs';

const jsonRaw = fs.readFileSync('./src/data/defaultProducts.json', 'utf8');
const jsonProducts = JSON.parse(jsonRaw);

console.log('defaultProducts.json count:', jsonProducts.length);
console.log('defaultProducts.json IDs:', jsonProducts.map(p => p.id));
