import Vue from "vue";
import Router from "vue-router";
// import Home from "../views/Home.vue";
import Home from "../views/Home.vue";
import Gem from "../views/War.vue";
import House from "../views/house/";
// import Root from "../views/Home.vue";

Vue.use(Router);

// const Home = resolve => require(["../views/Home.vue"], resolve);

export default new Router({
  // mode: "history",
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/gem",
      component: Gem
    },
    {
      path: "/house",
      component: House
    },
    {
      path: "/nine",
      name: "Nine",
      component: () => import("../views/Nine/")
    },
    {
      path: "/about",
      name: "关于",
      component: () => import("../views/About.vue")
    },
    {
      path: "/test",
      name: "组件测试",
      component: () => import("../views/Test/")
    },
    {
      path: "/menu",
      name: "菜单选择测试",
      component: () => import("../views/Test/menuCheck")
    },
    {
      path: "/graph",
      name: "MxGraph测试",
      component: () => import("../views/Test/graphP")
    },
    {
      path: "/study",
      name: "MxGraph学习",
      component: () => import("../views/study/graphP.vue")
    },
    {
      path: "/editor",
      name: "编辑器",
      component: () => import("../views/editor")
    },
    {
      path: "/svg",
      name: "SVG组件",
      component: () => import("../views/svg/")
    },
    {
      path: "/404",
      name: "未知页",
      component: () => import("../views/404/")
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
