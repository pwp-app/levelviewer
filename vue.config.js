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
        nsis: {
          oneClick: false,
          perMachine: false,
          allowToChangeInstallationDirectory: true,
        },
        mac: {
          target: ['dmg', '7z'],
          asar: true,
        },
        win: {
          target: ['nsis', '7z'],
          defaultArch: 'x64',
          publisherName: 'pwp.app',
        },
        linux: {
          target: ['deb', 'rpm', '7z'],
          category: 'app.pwp.levelviewer',
        },
      },
    },
  },
};
