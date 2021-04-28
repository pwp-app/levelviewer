/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    locale: 'cn',
    dbPath: '',
  },
  mutations: {
    setLocle(state, locale) {
      state.locale = locale;
    },
    setDbPath(state, path) {
      state.dbPath = path;
    },
  },
});
