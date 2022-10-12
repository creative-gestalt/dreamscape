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
  {
    path: "/sessions",
    name: "SessionPage",
    component: () => import("../views/SessionsPage.vue"),
    meta: {
      title: "Sessions",
    },
  },
  {
    path: "/dream/:id",
    name: "ViewDreamPage",
    component: () => import("../views/ViewDreamPage.vue"),
    meta: {
      title: "View Dream",
    },
  },
  {
    path: "/session/:id",
    name: "ViewSessionPage",
    component: () => import("../views/ViewSessionPage.vue"),
    meta: {
      title: "View Session",
    },
  },
  {
    path: "/dream-overview",
    name: "DreamOverviewPage",
    component: () => import("../views/DreamOverviewPage.vue"),
    meta: {
      title: "Overview",
    },
  },
  {
    path: "/settings",
    name: "SettingsPage",
    component: () => import("../views/SettingsPage.vue"),
    meta: {
      title: "Settings",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
