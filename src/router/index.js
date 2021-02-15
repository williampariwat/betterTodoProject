import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';

require('firebase/auth');

const Todos = () => import('@/components/TodoList');
const Login = () => import('@/components/Login');
const SignUp = () => import('@/components/Signup');
Vue.use(VueRouter);

const routes = [
  {
    path: '/todos',
    name: 'todos',
    component: Todos,
    meta: {
      requiredAuthentication: true,
    },
  },
  {
    path: '*',
    redirect: '/login',
    meta: {
      requiredAuthentication: false,
    },
  },
  {
    path: '/',
    redirect: '/login',
    meta: {
      requiredAuthentication: false,
    },
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      requiredAuthentication: false,
    },
    component: Login,
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: SignUp,
  },
];

const router = new VueRouter({
  mode: 'hash',
  routes,
});

const beforeRouteEnter = async (to, from, next) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user && !to.meta.requiredAuthentication) {
      next({ name: 'todos' });
    } else if (!user && to.meta.requiredAuthentication) {
      next({ name: 'login' });
    } else {
      next();
    }
  });
};
router.beforeEach(beforeRouteEnter);

// router.beforeEach((to, from, next) => {
//   // eslint-disable-next-line
//   const currentUser = firebase.auth().currentUser;
//   const requireAuth = to.meta.requiredAuthentication;
//   if (requireAuth && !currentUser) next({ name: 'login' });
//   else if (!requireAuth && currentUser) next({ name: 'todos' });
//   else next({ name: 'login' });
// });

Vue.$router = router;

export default router;
