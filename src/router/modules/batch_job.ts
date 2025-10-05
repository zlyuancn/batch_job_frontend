export default {
  path: "/BatchJob",
  redirect: "/BatchJob/RegistryBiz",
  meta: {
    title: "批量工具"
  },
  children: [
    {
      path: "/BatchJob/BizList",
      name: "BizList",
      component: () => import("@/views/batch_job/biz_list/index.vue"),
      meta: {
        title: "业务列表"
      }
    },
    {
      path: "/BatchJob/RegistryBiz",
      name: "RegistryBiz",
      component: () => import("@/views/batch_job/registry_biz/index.vue"),
      meta: {
        title: "注册业务"
      }
    },
    {
      path: "/BatchJob/ChangeBiz",
      name: "ChangeBiz",
      component: () => import("@/views/batch_job/registry_biz/index.vue"),
      meta: {
        title: "修改业务"
      }
    }
  ]
} as RouteConfigsTable;
