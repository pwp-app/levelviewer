/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

module.exports = {
  productionSourceMap: false,
  configureWebpack: () => ({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'element-ui': '@pwp-app/better-element-ui',
        'vue-context-menu': '@pwp-app/vue-context-menu',
      },
    },
  }),
  pluginOptions: {
    i18n: {
      locale: 'cn',
      fallbackLocale: 'en',
      localeDir: 'src/locales',
      enableInSFC: false,
    },
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        appId: 'levelviewer.pwp.app',
        productName: 'LevelViewer',
        publish: ['github'],
        win: {
          publisherName: 'pwp.app',
        },
      },
    },
  },
};
