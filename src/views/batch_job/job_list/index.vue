<script setup lang="ts">
// 业务列表
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  batchJobClient,
  BatchJobJobStateInfo,
  BatchJobJobStatusQ,
  BatchJobQueryJobListReq,
  BatchJobQueryJobListRsp,
  BatchJobQueryJobStateInfoReq,
  QueryAllBizNameRspLineA
} from "@/api/batch_job_client";
import { columnsRule } from "./rule";
import { Loading } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import {
  bizNameMap,
  jobListQueryArgs,
  resetJobListQueryArgs
} from "../utils/data";
import { date2Timestamp } from "@/views/batch_job/utils/time";

// 任务列表
defineOptions({
  name: "JobList"
});

const isLoading = ref(false);
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]);

const queryDataIsChange = ref(true);
watch(jobListQueryArgs, newV => {
  queryDataIsChange.value = true;
});
watch(
  () => jobListQueryArgs.rangeTime,
  newV => {
    queryDataIsChange.value = true;
    submitQuery();
  }
);

const router = useRouter();

function resetQuery(): void {
  resetJobListQueryArgs();
  submitQuery();
}
function forceQuery(): void {
  queryDataIsChange.value = true;
  submitQuery();
}
const submitQuery = () => {
  if (!queryDataIsChange.value) {
    return;
  }
  queryDataIsChange.value = false;

  isLoading.value = true;
  const req: BatchJobQueryJobListReq = {
    page: jobListQueryArgs.page,
    pageSize: jobListQueryArgs.pageSize,
    bizId: jobListQueryArgs.bizId,
    opUser: jobListQueryArgs.opUser
  };
  switch (jobListQueryArgs.status) {
    case "0":
      req.status = BatchJobJobStatusQ.All;
      break;
    case "1":
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
    req.startTime = String(date2Timestamp(jobListQueryArgs.rangeTime[0]));
    req.endTime = String(date2Timestamp(jobListQueryArgs.rangeTime[1]));
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

// 状态变更
function statusChange() {
  jobListQueryArgs.page = 1;
  submitQuery();
}

const bizNameList = ref<Array<QueryAllBizNameRspLineA>>([]);
function getBizNameList() {
  batchJobClient
    .batchJobServiceQueryAllBizName({})
    .then(res => {
      bizNameList.value = res?.data?.line;
      res?.data?.line.map(v => {
        bizNameMap[v.bizId] = v.bizName;
      });
    })
    .catch(err => {
      const errMsg = err?.response?.data?.message ?? err;
      message("数据业务名列表获取失败\n" + errMsg, { type: "error" });
    })
    .finally(() => {
      isLoading.value = false;
    });
}

// 立即获取业务名数据
getBizNameList();

// 使用mock数据填充
// processApiData(mockData);

// 立即刷新
submitQuery();

function createJob() {
  router.push({
    name: "CreateJob",
    query: { bizId: jobListQueryArgs.bizId }
  });
}

let timer = null;
// 定时任务
onMounted(() => {
  // 创建定时任务（每1秒执行一次）
  timer = setInterval(() => {
    reloadRunningJob();
  }, 2000);
});

onBeforeUnmount(() => {
  // 清除定时器
  clearInterval(timer);
});

// 重新加载运行中的任务
const reloadRunningJob = () => {
  const d2 = data.value.filter(v => {
    return v.status == 1 || v.status == 2 || v.status == 4;
  });
  const ids = d2.map(v => v.jobId);
  if (ids.length == 0) {
    return;
  }

  const req = <BatchJobQueryJobStateInfoReq>{
    jobIds: ids
  };
  batchJobClient
    .batchJobServiceQueryJobStateInfo(req, { closeNProgress: true })
    .then(res => {
      // 创造map
      let mm = <Array<BatchJobJobStateInfo>>{};
      res.data?.jobStateInfos?.map(v => {
        mm[v.jobId] = v;
      });

      // 更新数据
      data.value = data.value.map(v => {
        let nv = mm[v.jobId];
        return nv ? Object.assign(v, nv) : v;
      });
    });
};
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
      <div>
        <el-button type="primary" @click="createJob">新增任务</el-button>
      </div>
      <el-divider />
      <!-- 让布局容器充满可用空间 -->
      <el-container class="flex-1 flex flex-col">
        <el-header>
          <el-space direction="horizontal" size="large">
            <el-radio-group
              v-model="jobListQueryArgs.status"
              @change="statusChange"
              size="large"
            >
              <el-radio-button label="全部" value="0" />
              <el-radio-button label="待启动" value="1" />
              <el-radio-button label="运行中" value="2" />
              <el-radio-button label="已完成" value="3" />
            </el-radio-group>

            <el-select
              v-model="jobListQueryArgs.bizId"
              filterable
              clearable
              placeholder="业务类型"
              style="width: 240px"
              @change="submitQuery"
            >
              <div v-for="item in bizNameList">
                <el-option
                  v-if="Number(item.status ?? 0) == 0"
                  :key="item.bizId"
                  :label="'(' + String(item.bizId) + ') ' + item.bizName"
                  :value="item.bizId"
                />
              </div>
            </el-select>
            <el-input
              v-model="jobListQueryArgs.opUser"
              style="max-width: 250px"
              @blur="submitQuery"
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
          <el-button type="primary" @click="forceQuery">搜索</el-button>
          <el-button type="default" @click="resetQuery">重置</el-button>
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
            @size-change="submitQuery"
            @current-change="submitQuery"
            :total="jobListQueryArgs.dataTotal"
            :disabled="isLoading"
          />
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
