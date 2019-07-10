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
    mode: "history",
    base: process.env.BASE_URL,
    routes: [{
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
            path: "/about",
            name: "关于",
            component: () =>
                import ("../views/About.vue")
        },
        {
            path: "/test",
            name: "组件测试",
            component: () =>
                import ("../views/Test/")
        },
        {
            path: "/svg",
            name: "SVG组件",
            component: () =>
                import ("../views/svg/")
        },
        {
            path: "/404",
            name: "未知页",
            component: () =>
                import ("../views/404/")
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