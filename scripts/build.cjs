const { execSync } = require('child_process');
const { copyFileSync, mkdirSync, readdirSync, lstatSync, rmSync, existsSync } = require('fs');
const { join } = require('path');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

// 1. clear artifacts folder
try {
  rmSync('artifacts', { recursive: true, force: true });
} catch (e) {
  // ignore
}

// 2. runtime
run('pnpm -F @project/runtime build');

// 3. backend
run('pnpm -F @project/backend build');

// 4. frontend
run('pnpm -F @project/frontend build');

function copyDir(src, dest) {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
  readdirSync(src).forEach(item => {
    const s = join(src, item);
    const d = join(dest, item);
    if (lstatSync(s).isDirectory()) {
      copyDir(s, d);
    } else {
      copyFileSync(s, d);
    }
  });
}

const frontendDist = join(__dirname, '..', 'frontend', 'dist');
const targetFrontend = join(__dirname, '..', 'artifacts', 'frontend');
if (existsSync(frontendDist)) {
  rmSync(targetFrontend, { recursive: true, force: true });
  copyDir(frontendDist, targetFrontend);
}

// 5. electron app
run('pnpm -F @project/app build');

// Note: standalone/app outputs directly to artifacts/standalone/app via electron-builder config
// Verify the output directory exists
const standaloneArtifacts = join(__dirname, 'artifacts', 'standalone', 'app');
if (existsSync(standaloneArtifacts)) {
  console.log(`standalone/app built successfully at ${standaloneArtifacts}`);
} else {
  console.warn(`warning: standalone/app build output not found at ${standaloneArtifacts}`);
}

console.log('all packages built');