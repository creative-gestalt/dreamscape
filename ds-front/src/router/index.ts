import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import DreamsPage from "../views/DreamsPage.vue";
const SessionsPage = () => import("../views/SessionsPage.vue");
const ViewDreamPage = () => import("../views/ViewDreamPage.vue");
const ViewSessionPage = () => import("../views/ViewSessionPage.vue");
const DreamOverviewPage = () => import("../views/DreamOverviewPage.vue");
const SettingsPage = () => import("../views/SettingsPage.vue");

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
    component: SessionsPage,
    meta: {
      title: "Sessions",
    },
  },
  {
    path: "/dream/:id/:action",
    name: "ViewDreamPage",
    component: ViewDreamPage,
    meta: {
      title: "View Dream",
    },
  },
  {
    path: "/session/:id",
    name: "ViewSessionPage",
    component: ViewSessionPage,
    meta: {
      title: "View Session",
    },
  },
  {
    path: "/dream-overview",
    name: "DreamOverviewPage",
    component: DreamOverviewPage,
    meta: {
      title: "Overview",
    },
  },
  {
    path: "/settings",
    name: "SettingsPage",
    component: SettingsPage,
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
