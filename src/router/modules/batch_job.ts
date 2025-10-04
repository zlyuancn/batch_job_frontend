export default {
  path: "/batch_job",
  redirect: "/batch_job/registry_biz",
  meta: {
    title: "批量工具"
  },
  children: [
    {
      path: "/batch_job/registry_biz",
      name: "RegistryBiz",
      component: () => import("@/views/batch_job/registry_biz/index.vue"),
      meta: {
        title: "注册业务"
      }
    },
    {
      path: "/batch_job/change_biz",
      name: "ChangeBiz",
      component: () => import("@/views/batch_job/registry_biz/index.vue"),
      meta: {
        title: "修改业务"
      }
    }
  ]
} as RouteConfigsTable;
