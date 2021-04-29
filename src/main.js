import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import i18n from './plugins/i18n';
import store from './store';
import VueTitlebar from '@backrunner/vue-titlebar';

Vue.config.productionTip = false;

Vue.use(VueTitlebar);

Vue.prototype.$bus = new Vue();

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');
