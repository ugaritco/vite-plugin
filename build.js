import { execSync } from 'node:child_process';
import fs from 'node:fs';

console.log('Building ugarit-vite-plugin...');

// 1. Clean dist
if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });

// 2. Types
console.log('Generating types...');
execSync('npx tsc --emitDeclarationOnly', { stdio: 'inherit' });

// 3. Plugin ESM bundle
console.log('Bundling index.ts...');
execSync('npx esbuild src/index.ts --bundle --platform=node --format=esm --outfile=dist/index.js --external:vite --external:vite-plugin-full-reload --external:picocolors --external:tinyglobby --external:fontaine', { stdio: 'inherit' });

// 4. Copy dev-server-index.html
fs.copyFileSync('src/dev-server-index.html', 'dist/dev-server-index.html');

// 5. Build fonts
console.log('Bundling fonts...');
execSync('npx esbuild src/fonts/index.ts --bundle --platform=node --format=esm --outfile=dist/fonts/index.js', { stdio: 'inherit' });

// 6. Inertia helpers
console.log('Building inertia helpers...');
if (fs.existsSync('inertia-helpers')) {
    fs.rmSync('inertia-helpers', { recursive: true, force: true });
}
execSync('npx tsc --project tsconfig.inertia-helpers.json', { stdio: 'inherit' });

console.log('Build completed successfully!');
