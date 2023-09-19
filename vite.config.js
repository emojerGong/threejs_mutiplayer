import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  server: {
    // 这是默认值，它将把所有路径中含有 example 的文件
    // 添加到忽略列表中。
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('example');
    },
  },
});
