const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/category/QstListPage.vue") }],
  },
  {
    path: "/Category",
    component: () => import("layouts/MainLayout.vue"),
    children: [{
      path: "",
      component: () => import("pages/category/CategoryPage.vue") ,
	    children: [
        {
            path: "qstList", /*카테고리별문제리스트*/
            component: () => import("pages/category/QstListPage.vue")
        },
        {
          path: "importCategory",/*카테고리 import*/
          component: () => import("pages/category/ImportCategoryPage.vue")
        },
        {
          path: "importQuestion",/*문제 import*/
          component: () => import("pages/category/ImportQuestionPage.vue")
        },
      ]
    }],
  },
  {
    path: "/GridDemo",
    component: () => import("layouts/MainLayout.vue"),
    children: [{
      path: "", component: () => import("pages/GridDemo.vue")
    }],
  },
  {
    path: "/PopupPage",
    component: () => import("layouts/MainLayout.vue"),
    children: [{
      path: "",
      component: () => import("pages/PopupPage.vue"),
	    children: [{
          path: "sub",
          component: () => import("pages/PopupSubPage.vue")
      }]
    }],
},
  {
    path: "/PrintPage",
    component: () => import("layouts/PrintLayout.vue"),
    children: [{ path: "", component: () => import("pages/PrintPage.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
