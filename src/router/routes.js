const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/Category",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Category.vue") }],
  },
  {
    path: "/GridDemo",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/GridDemo.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
