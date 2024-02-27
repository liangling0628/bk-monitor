import { createSSRApp } from 'vue';
import * as pinia from 'pinia';
import App from './App.vue';
import { i18n } from './i18n/index';
import '../../monitor-static/icons/monitor-icons.css';
// #ifdef H5
import { useVantH5Component } from './common/import-h5-vant';
// #endif
export function createApp() {
  const app = createSSRApp(App);
  // #ifdef H5
  useVantH5Component(app);
  // #endif
  app.use(pinia.createPinia()).use(i18n);

  return {
    app,
  };
}
