#!/usr/bin/env node
/**
 * Simple deployment script that pushes `dist` build content to `gh-pages` branch.
 * Requirements: git workspace clean (no unstaged changes for safety).
 */
const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd){
  console.log('> '+cmd);
  execSync(cmd,{stdio:'inherit'});
}

// Safety: ensure dist exists
if(!fs.existsSync('dist')){
  console.error('Build folder dist/ missing. Run npm run build first.');
  process.exit(1);
}

// Ensure we are at project root of client-vite
try {
  run('git rev-parse --is-inside-work-tree');
} catch(e){
  console.error('Not inside a git repo. Abort.');
  process.exit(1);
}

// Create temp directory
const tempDir = '.gh-temp-dist';
if(fs.existsSync(tempDir)) fs.rmSync(tempDir,{recursive:true,force:true});
fs.mkdirSync(tempDir);

// Copy dist content
run(process.platform === 'win32' ? 'xcopy dist '+tempDir+' /E /I /Y' : 'cp -R dist/* '+tempDir);

// Switch to gh-pages (create if not exists)
let created = false;
try { run('git rev-parse --verify gh-pages'); }
catch { created = true; run('git checkout --orphan gh-pages'); run('git reset --hard'); }

if(!created){ run('git checkout gh-pages'); }

// Remove everything at root (except .git) then copy new build
fs.readdirSync('.').forEach(name=>{ if(name==='.git') return; if(name.startsWith('.gh-temp-dist')) return; fs.rmSync(name,{recursive:true,force:true}); });

// Move files from tempDir to root
fs.readdirSync(tempDir).forEach(name=>{
  fs.renameSync(tempDir + '/' + name, name);
});
fs.rmSync(tempDir,{recursive:true,force:true});

// Commit and push
run('git add .');
run('git commit -m "deploy: update gh-pages"');
run('git push -u origin gh-pages');

// Return to previous branch
try { run('git checkout -'); } catch {}

console.log('\nDeployment finished.');
