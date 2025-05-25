#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Find all .js files in dist directory
const jsFiles = glob.sync('dist/**/*.js', { cwd: projectRoot });

console.log('Fixing import extensions in compiled JavaScript files...');

jsFiles.forEach(file => {
  const filePath = join(projectRoot, file);
  let content = readFileSync(filePath, 'utf8');

  // Fix relative imports that don't have .js extension
  content = content.replace(
    /from\s+['"](\.[^'"]*?)(?<!\.js)['"]/g,
    "from '$1.js'"
  );

  content = content.replace(
    /import\s+['"](\.[^'"]*?)(?<!\.js)['"]/g,
    "import '$1.js'"
  );

  writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('Import extensions fixed successfully!'); 