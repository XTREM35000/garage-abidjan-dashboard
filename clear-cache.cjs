#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Clearing all caches and forcing refresh...');

// Clear common cache directories
const cacheDirs = [
  'node_modules/.vite',
  'node_modules/.cache',
  'dist',
  '.vite',
  '.next',
  'build'
];

cacheDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Cleared: ${dir}`);
    } catch (error) {
      console.log(`⚠️  Could not clear ${dir}:`, error.message);
    }
  }
});

// Force update file timestamps
const filesToTouch = [
  'src/components/AuthStatusDebug.tsx',
  'src/integrations/supabase/client.ts',
  'vite.config.ts',
  'package.json'
];

filesToTouch.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    try {
      const now = new Date();
      fs.utimesSync(fullPath, now, now);
      console.log(`✅ Touched: ${file}`);
    } catch (error) {
      console.log(`⚠️  Could not touch ${file}:`, error.message);
    }
  }
});

console.log('🎉 Cache clearing complete!');
console.log('📝 Next steps:');
console.log('   1. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)');
console.log('   2. Clear browser cache if needed');
console.log('   3. Check if the error is resolved');