import {
  defineConfig,
  presetWind,
  transformerVariantGroup,
  transformerDirectives,
  transformerCompileClass,
} from 'unocss';
export default defineConfig({
  presets: [presetWind(), transformerVariantGroup(), transformerDirectives(), transformerCompileClass()],
});
