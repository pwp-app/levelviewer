import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '@/store';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context('../../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  Object.assign(messages.cn, zhLocale);
  Object.assign(messages.en, enLocale);
  return messages;
}

export default new VueI18n({
  locale: store.state.locale,
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
});
