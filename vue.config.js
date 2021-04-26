/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

module.exports = {
  productionSourceMap: false,
  chainWebpack: (config) => {
    // drop debug lines
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.warnings = false;
        args[0].terserOptions.compress.drop_debugger = true;
        args[0].terserOptions.compress.pure_funcs = ['console.log'];
        return args;
      });
    }
  },
  configureWebpack: () => ({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'element-ui': '@pwp-app/better-element-ui',
        'vue-context-menu': '@pwp-app/vue-context-menu',
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          element: {
            name: 'element',
            test: /[\\/]node_modules[\\/]@pwp-app[\\/]better-element-ui[\\/]/,
            priority: -10,
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -20,
          },
        },
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
  },
};
