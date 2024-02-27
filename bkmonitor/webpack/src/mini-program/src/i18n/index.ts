import { createI18n } from 'vue-i18n';
import enMessage from '../lang/en.json';
export const i18n = createI18n({
  locale: 'zh-cn',
  fallbackLocale: 'zh-cn',
  legacy: false,
  messages: {
    en: enMessage,
    'zh-cn': Object.keys(enMessage).reduce((a: Record<string, string>, b: string) => (a[b] = b, a), {}),
  },
});

export const $t = i18n.global.t.bind(i18n.global);
