import {
  defineConfig,
  presetWind,
  transformerVariantGroup,
  transformerDirectives,
  transformerCompileClass,
  type Preset,
} from 'unocss';
import presetRemToPx from '@unocss/preset-rem-to-px';
import type { Theme } from 'unocss/preset-uno';

export default defineConfig({
  shortcuts: [],
  theme: {
    colors: {
      primary: '#333333',
    },
  },
  rules: [],
  presets: [
    presetWind(),
    presetRemToPx({
      baseFontSize: 12,
    }) as Preset<Theme>,
  ],
  transformers: [transformerVariantGroup(), transformerDirectives(), transformerCompileClass()],
});
