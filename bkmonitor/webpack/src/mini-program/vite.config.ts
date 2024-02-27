import { defineConfig, PluginOption, UserConfig } from 'vite';
import { createStyleImportPlugin } from 'vite-plugin-style-import';
import { existsSync } from 'fs';
import { resolve } from 'path';
import uni from '@dcloudio/vite-plugin-uni';
import { copyDir } from './scripts/copy-wxcomponents';
let hasCopy = false;
// import copy from 'rollup-plugin-copy';
// https://vitejs.dev/config/
export default defineConfig(async () => {
  let localSettings: UserConfig = {};
  let plugins: PluginOption[] = [];
  if (process.env.PLATFORM === 'h5') {
    plugins = [
      createStyleImportPlugin({
        libs: [
          {
            libraryName: 'vant',
            esModule: true,
            resolveStyle: name => `../../vant/es/${name}/style/index`,
          },
        ],
      }),
    ];
  }
  if (existsSync(resolve(__dirname, './local.settings.ts'))) {
    const settings  = await import('./local.settings') as {default: UserConfig};
    localSettings = settings.default;
  }
  return {
    // publicDir: './src/components/wxcomponents',
    build: {
      outDir: '../../mp', // uni-app官方不支持配置 产出目录不可变更
      rollupOptions: {
        external: ['virtual:svg-icons-register'],
      },
    },
    plugins: [
      uni(),
      ...plugins,
      {
        name: 'copy-components',
        async buildEnd() {
          if (hasCopy) return;
          const srcDir = resolve(__dirname, './src/components/wxcomponents/vant');
          const destDir = resolve(__dirname, './dist/dev/mp-weixin/wxcomponents/vant');
          await copyDir(srcDir, destDir);
          hasCopy = true;
        },
      },
    ],
    resolve: {
      alias: {
        // '@vant/use': path.resolve(__dirname, './src/components/vant-use'),
        // '@vant': path.resolve(__dirname, './src/components/vant'),
      },
    },
    server: {
      ...localSettings.server,
    },
  };
});
