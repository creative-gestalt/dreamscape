import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import DreamsPage from "../views/DreamsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dreams",
  },
  {
    path: "/dreams",
    name: "DreamsPage",
    component: DreamsPage,
    meta: {
      title: "Dreams",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
