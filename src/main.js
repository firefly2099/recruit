import "./assets/css/reset.scss";

import Vue from "vue";
// import VueTouch from "vue-touch";
// Vue.use(VueTouch, { name: "v-touch" });

import App from "./App";
import store from "./store";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");

let proxyVue = new Vue();
Vue.prototype.proxyVue = proxyVue;

import common from "./assets/js/common";
Vue.use(common);

import beforeRouterEnter from "./router/beforeRouteEnter";
beforeRouterEnter(router, store);

/*router.beforeEach((to, from, next) => {
  next();
});*/

router.afterEach((to, from) => {
  document.title = to.meta.title;
  // Trigger Header.vue handler setNavStatus
  proxyVue.$emit("setNavStatus", false);
  proxyVue.$emit("routeChange", to.meta.bottom === false ? 0 : 1);
  console.log("router.afterEach", to, from);
});
