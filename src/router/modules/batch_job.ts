export default {
  path: "/BatchJob",
  redirect: "/BatchJob/BizList",
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
      path: "/BatchJob/BizInfo",
      name: "BizInfo",
      component: () => import("@/views/batch_job/biz_info/index.vue"),
      meta: {
        title: "业务详情",
        showLink: false
      }
    },
    {
      path: "/BatchJob/RegistryBiz",
      name: "RegistryBiz",
      component: () => import("@/views/batch_job/registry_biz/index.vue"),
      meta: {
        title: "注册业务",
        showLink: false
      }
    },
    {
      path: "/BatchJob/ChangeBiz",
      name: "ChangeBiz",
      component: () => import("@/views/batch_job/registry_biz/index.vue"),
      meta: {
        title: "修改业务",
        showLink: false
      }
    },
    {
      path: "/BatchJob/JobList",
      name: "JobList",
      component: () => import("@/views/batch_job/job_list/index.vue"),
      meta: {
        title: "任务列表"
      }
    }
  ]
} as RouteConfigsTable;
