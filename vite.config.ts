import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  const rootDir = process.cwd();

  // In development, base must always be '/' for Vite dev server and proxy
  // In production build:
  // 1. Explicit VITE_BASE_PATH if provided (e.g. from actions/configure-pages)
  // 2. In GitHub Actions: extract repo name from GITHUB_REPOSITORY (e.g. 'owner/repo' -> '/repo/')
  // 3. Fallback to './' for local builds or relative deployments
  let basePath = '/';
  if (command === 'build') {
    if (process.env.VITE_BASE_PATH) {
      const customPath = process.env.VITE_BASE_PATH.trim();
      basePath = customPath.endsWith('/') ? customPath : `${customPath}/`;
    } else if (process.env.GITHUB_REPOSITORY) {
      const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
      const isUserPage = repo && owner && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;
      basePath = isUserPage ? '/' : `/${repo}/`;
    } else {
      basePath = './';
    }
  }

  return {
    base: basePath,
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'generate-github-pages-assets',
        closeBundle() {
          const distDir = path.resolve(rootDir, 'dist');
          const docsDir = path.resolve(rootDir, 'docs');
          const indexPath = path.resolve(distDir, 'index.html');
          const fourOhFourPath = path.resolve(distDir, '404.html');

          // 1. Generate 404.html for GitHub Pages SPA fallback
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, fourOhFourPath);
          }

          // 2. Also sync to docs/ folder so GitHub Pages 'Deploy from branch -> /docs' works directly
          try {
            if (!fs.existsSync(docsDir)) {
              fs.mkdirSync(docsDir, { recursive: true });
            }
            fs.cpSync(distDir, docsDir, { recursive: true });
          } catch (err) {
            // ignore
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
