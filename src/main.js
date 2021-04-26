import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import i18n from './plugins/i18n';
import store from './store'

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App)
}).$mount('#app');
