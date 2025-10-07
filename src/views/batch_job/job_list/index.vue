<script setup lang="ts">
// 业务列表
import { reactive, ref, watch } from "vue";
import {
  BatchJobJobStatusQ,
  BatchJobQueryJobListReq,
  BatchJobQueryJobListRsp
} from "@/api/batch_job_client";
import { columnsRule } from "./rule";
import { mockData } from "./data";
import { Loading } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { batchJobClient } from "@/api/batch_job_client";
import { message } from "@/utils/message";
import { jobListQueryArgs } from "../utils/data";
import { date2Timestamp } from "@/views/batch_job/utils/time";

defineOptions({
  name: "JobList"
});

const isLoading = ref(false);
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]);

const queryDataIsChange = ref(false);
watch(jobListQueryArgs, newV => {
  queryDataIsChange.value = true;
});

const router = useRouter();
const route = useRoute();

jobListQueryArgs.bizType = Number(route.query["bizType"]);
const pageChange = () => {
  isLoading.value = true;
  console.log("jobListQueryArgs", jobListQueryArgs);
  const req: BatchJobQueryJobListReq = {
    page: jobListQueryArgs.page,
    pageSize: jobListQueryArgs.pageSize,
    bizType: jobListQueryArgs.bizType,
    opUser: jobListQueryArgs.opUser
  };
  switch (jobListQueryArgs.status) {
    case "0":
      req.status = BatchJobJobStatusQ.Created;
      break;
    case "2":
      req.status = BatchJobJobStatusQ.Running;
      break;
    case "3":
      req.status = BatchJobJobStatusQ.Finished;
      break;
  }
  if (jobListQueryArgs?.rangeTime.length == 2) {
    console.log(
      "jobListQueryArgs rangeTime",
      date2Timestamp(jobListQueryArgs.rangeTime[0]),
      date2Timestamp(jobListQueryArgs.rangeTime[1])
    );
  }

  batchJobClient
    .batchJobServiceQueryJobList(req)
    .then(res => {
      processApiData(res.data);
    })
    .catch(err => {
      const errMsg = err?.response?.data?.message ?? err;
      message("数据获取失败\n" + errMsg, { type: "error" });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const data = ref<Array<any>>([]);

// 数据处理
function processApiData(r: BatchJobQueryJobListRsp) {
  data.value = r.line ?? [];
  jobListQueryArgs.pageSize = r.pageSize ?? 20;
  jobListQueryArgs.dataTotal = r.total ?? 0;
}

// 查询变更
function queryChange() {
  if (queryDataIsChange.value) {
    queryDataIsChange.value = false;
    pageChange();
  }
}

// 状态变更
function statusChange() {
  jobListQueryArgs.page = 1;
  pageChange();
}

// 使用mock数据填充
processApiData(mockData);

// 立即刷新
pageChange();
</script>

<template>
  <div>
    <div
      class="common-layout flex-1 flex flex-col"
      style="height: calc(100vh - 100px)"
    >
      <div
        v-if="isLoading"
        class="el-loading-mask"
        style="display: flex; align-items: center; justify-content: center"
      >
        <el-icon class="is-loading" color="var(--el-color-primary)" :size="26">
          <Loading />
        </el-icon>
      </div>
      <!-- 让布局容器充满可用空间 -->
      <el-container class="flex-1 flex flex-col">
        <el-header>
          <el-button
            type="primary"
            @click="router.push({ name: 'RegistryBiz' })"
            >新增业务</el-button
          >
        </el-header>
        <el-header>
          <el-space direction="horizontal" size="large">
            <el-radio-group
              v-model="jobListQueryArgs.status"
              @click="statusChange"
              size="large"
            >
              <el-radio-button label="待启动" value="0" />
              <el-radio-button label="运行中" value="2" />
              <el-radio-button label="已完成" value="3" />
            </el-radio-group>

            <el-input
              v-model="jobListQueryArgs.opUser"
              style="max-width: 250px"
              @blur="queryChange"
            >
              <template #prepend>操作用户</template>
            </el-input>
            <el-date-picker
              v-model="jobListQueryArgs.rangeTime"
              type="daterange"
              unlink-panels
              range-separator="To"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="defaultTime"
            />
          </el-space>
        </el-header>
        <!-- 容器使用flex布局 -->
        <el-main class="flex-1 overflow-hidden p-0">
          <!-- 主内容区占据剩余空间，去除默认padding -->
          <div class="h-full w-full">
            <!-- 内部容器充满父元素 -->
            <el-auto-resizer class="h-full">
              <!-- 自动调整大小组件充满高度 -->
              <template #default="{ height, width }">
                <el-table-v2
                  :columns="columnsRule"
                  :data="data"
                  :width="width"
                  :height="height"
                  fixed
                />
              </template>
            </el-auto-resizer>
          </div>
        </el-main>
        <el-footer class="py-3">
          <!-- 底部区域保持固定高度 -->
          <el-pagination
            v-model:current-page="jobListQueryArgs.page"
            v-model:page-size="jobListQueryArgs.pageSize"
            background
            layout="total, prev, pager, next, sizes, jumper"
            :page-sizes="[20, 50, 100]"
            @size-change="pageChange"
            @current-change="pageChange"
            :total="jobListQueryArgs.dataTotal"
            :disabled="isLoading"
          />
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
