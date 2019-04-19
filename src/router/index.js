import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
// import Root from "../views/Home.vue";

Vue.use(Router);

// const Home = resolve => require(["../views/Home.vue"], resolve);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/about",
      name: "关于",
      component: () => import("../views/About.vue")
    }
    // {
    //   path: "/",
    //   component: Root,
    //   redirect: "/home",
    //   children: [
    //     {
    //       path: "home",
    //       component: Home,
    //       name: "首页"
    //     }
    //   ]
    // }
  ]
});
