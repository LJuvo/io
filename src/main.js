// import Vue from "vue";
// import App from "./App.vue";
// import store from "./store";
// import router from "./router";
// import "./styles/index.less";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import iView from "iview";
import "iview/dist/styles/iview.css";

// Vue.config.productionTip = false;
Vue.use(iView);
window._ = require("lodash");

// router.beforeEach((to, from, next) => {
//   iView.LoadingBar.start();
//   next();
// });

// router.afterEach(() => {
//   iView.LoadingBar.finish();
//   window.scrollTo(0, 0);
// });

// new Vue({
//   el: "#app",
//   router,
//   template: "<App/>",
//   components: { App }
// });

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");