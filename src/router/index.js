import Vue from 'vue';
import VueRouter from 'vue-router';
import Selector from '../views/Selector.vue';
import Viewer from '../views/Viewer.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Selector',
    component: Selector,
  },
  {
    path: '/viewer',
    name: 'Viewer',
    component: Viewer,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
