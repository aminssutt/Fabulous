#!/usr/bin/env node
/**
 * Deployment script using a temporary git worktree for gh-pages.
 * 1. Assumes `npm run build` already executed (dist exists)
 * 2. Creates (or reuses) a worktree .gh-pages-tmp at repo root
 * 3. Copies dist/* into that worktree root
 * 4. Commits & pushes gh-pages branch
 * 5. Cleans up worktree (optional – we keep it for faster subsequent deploys)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function sh(cmd, opts={}) {
  console.log('> '+cmd);
  return execSync(cmd, {stdio:'inherit', ...opts});
}

function get(cmd){ return execSync(cmd,{encoding:'utf8'}).trim(); }

// Ensure inside git and find repo root
try { sh('git rev-parse --is-inside-work-tree'); } catch { console.error('Not a git repo'); process.exit(1); }
const repoRoot = get('git rev-parse --show-toplevel');
const cwd = process.cwd();
const distDir = path.join(cwd,'dist');
if(!fs.existsSync(distDir)) { console.error('dist/ missing. Run build first.'); process.exit(1); }

// Ensure gh-pages branch exists (fetch may fail silently if first push)
try { sh('git fetch origin gh-pages'); } catch {}
let branchExists = true;
try { get('git rev-parse --verify gh-pages'); } catch { branchExists=false; }

const worktreeDir = path.join(repoRoot,'.gh-pages-tmp');

// If worktree directory exists but not registered, remove it
if(fs.existsSync(worktreeDir)) {
  // Try to see if it's a worktree (contains .git file linking)
  const gitMeta = path.join(worktreeDir,'.git');
  if(!fs.existsSync(gitMeta)) {
    fs.rmSync(worktreeDir,{recursive:true,force:true});
  }
}

// If worktree already registered, skip add, else add
let needAdd = true;
try {
  const list = get('git worktree list');
  if(list.includes(worktreeDir)) needAdd=false;
} catch {}

if(needAdd){
  if(branchExists){
    sh(`git worktree add "${worktreeDir}" gh-pages`);
  } else {
    sh(`git worktree add -b gh-pages "${worktreeDir}"`);
  }
}

// Clean worktree (keep .git)
for(const entry of fs.readdirSync(worktreeDir)) {
  if(entry === '.git') continue;
  fs.rmSync(path.join(worktreeDir, entry), {recursive:true, force:true});
}

// Copy dist content
function copyRecursive(src, dest){
  const stats = fs.statSync(src);
  if(stats.isDirectory()){
    if(!fs.existsSync(dest)) fs.mkdirSync(dest, {recursive:true});
    for(const f of fs.readdirSync(src)) copyRecursive(path.join(src,f), path.join(dest,f));
  } else {
    fs.copyFileSync(src,dest);
  }
}
copyRecursive(distDir, worktreeDir);

// Commit & push from worktree
process.chdir(worktreeDir);
sh('git add .');
try { sh('git commit -m "deploy: update gh-pages"'); } catch { console.log('Nothing new to commit.'); }
sh('git push origin gh-pages');

console.log('\nDeployment finished → gh-pages branch updated.');