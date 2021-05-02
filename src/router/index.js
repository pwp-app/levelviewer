import Vue from 'vue';
import VueRouter from 'vue-router';
import Selector from '../views/Selector.vue';
import Viewer from '../views/Viewer.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'selector',
    component: Selector,
  },
  {
    path: '/viewer',
    name: 'viewer',
    component: Viewer,
  },
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
