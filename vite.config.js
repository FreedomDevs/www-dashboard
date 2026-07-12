import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import path from 'path';
import { exit } from 'process';
import manualChunks from './manualChunks';

const buildVersion = new Date().toISOString();
const isViz = process.env.VIZ === 'true' // ставим ENV: VIZ=true vite build

function logModulesPlugin() {
  return {
    name: 'log-modules',
    generateBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk') {
          console.log('\nChunk:', fileName)
          console.log('  imports:', chunk.imports)
          console.log('  dynamicImports:', chunk.dynamicImports)
        }
      }
    }
  }
}

let visualizerPlugin = null;

if (isViz) {
  try {
    // динамический ESM импорт
    const { visualizer } = await import("rollup-plugin-visualizer");
    visualizerPlugin = visualizer({
      filename: "stats.html",
      template: "treemap",
      gzipSize: true
    });
  } catch (e) {
    // плагин не установлен — просто пропускаем
    console.log("rollup-plugin-visualizer not installed");
    exit(1)
  }
}

export default defineConfig({
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion)
  },
  plugins: [svelte(), ViteMinifyPlugin(),
  ...(isViz ? [visualizerPlugin, logModulesPlugin()] : [])],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: manualChunks,
      },
      treeshake: {
        preset: 'recommended',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    reportCompressedSize: false,
    outDir: '../dist',
    emptyOutDir: true,
    target: "esnext",
    modulePreload: { polyfill: false },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
