import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  const rootDir = process.cwd();

  // In development, base must always be '/' for Vite dev server and proxy to work properly
  // In production build:
  // 1. Explicit VITE_BASE_PATH if provided
  // 2. In GitHub Actions: extract repo name from GITHUB_REPOSITORY (e.g. 'owner/repo' -> '/repo/')
  //    (if it's a user/org page like 'owner/owner.github.io', base is '/')
  // 3. Fallback to './' for local builds or relative deployments
  let basePath = '/';
  if (command === 'build') {
    basePath = './';
    if (process.env.VITE_BASE_PATH) {
      basePath = process.env.VITE_BASE_PATH;
    } else if (process.env.GITHUB_REPOSITORY) {
      const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
      const isUserPage = repo && owner && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;
      basePath = isUserPage ? '/' : `/${repo}/`;
    }
  }

  return {
    base: basePath,
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'generate-404-for-github-pages',
        closeBundle() {
          const distDir = path.resolve(rootDir, 'dist');
          const indexPath = path.resolve(distDir, 'index.html');
          const fourOhFourPath = path.resolve(distDir, '404.html');
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, fourOhFourPath);
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
