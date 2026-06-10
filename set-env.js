const fs = require('fs');

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: 'https://api.rawg.io/api',
  apiKey: '${process.env.API_KEY || '9bc8625a52c5427a84ac74ba52b38050'}'
};
`;

const targetFolderPath = './src/environments';
if (!fs.existsSync(targetFolderPath)) {
  fs.mkdirSync(targetFolderPath, { recursive: true });
}
const targetPath = './src/environments/environment.ts';
fs.writeFileSync(targetPath, envConfigFile);

const devEnvConfigFile = `export const environment = {
  production: false,
  apiUrl: 'https://api.rawg.io/api',
  apiKey: '${process.env.API_KEY || '9bc8625a52c5427a84ac74ba52b38050'}'
};
`;
fs.writeFileSync('./src/environments/environment.development.ts', devEnvConfigFile);

console.log('✅ Archivo environment.ts generado correctamente en Vercel.');
