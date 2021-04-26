import Vue from 'vue';
import VueRouter from 'vue-router';
import Selector from '../views/Selector.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Selector',
    component: Selector,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
