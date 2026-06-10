const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/environments');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const apiUrl = process.env.API_URL || 'https://api.rawg.io/api';
const apiKey = process.env.API_KEY || '9bc8625a52c5427a84ac74ba52b38050';

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  apiKey: '${apiKey}'
};
`;

const devEnvConfigFile = `export const environment = {
  production: false,
  apiUrl: '${apiUrl}',
  apiKey: '${apiKey}'
};
`;

fs.writeFileSync(path.join(dir, 'environment.ts'), envConfigFile);
fs.writeFileSync(path.join(dir, 'environment.development.ts'), devEnvConfigFile);

console.log('Environment files generated successfully.');
