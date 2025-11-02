<script setup lang="ts">
// 业务列表
import { reactive, ref, watch } from "vue";
import {
  BatchJobBizStatus,
  type BatchJobQueryBizListReq,
  BatchJobQueryBizListRsp
} from "@/api/batch_job_client";
import { columnsRule } from "./rule";
import { mockData } from "./data";
import { Loading } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { batchJobClient } from "@/api/batch_job_client";
import { message } from "@/utils/message";
import iconSearch from "~icons/ep/search";
import iconAdd from "~icons/ep/document-add";
import {
  bizListQueryArgs,
  resetBizListQueryArgs
} from "@/views/batch_job/utils/data";

// 业务列表
defineOptions({
  name: "BizList"
});

const isLoading = ref(false);

const queryDataIsChange = ref(true);
watch(bizListQueryArgs, newV => {
  queryDataIsChange.value = true;
});

const router = useRouter();

function resetQuery(): void {
  resetBizListQueryArgs();
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
  console.log(
    `PageChange page: ${bizListQueryArgs.page} pageSize: ${bizListQueryArgs.pageSize}`
  );
  const req: BatchJobQueryBizListReq = {
    page: bizListQueryArgs.page,
    pageSize: bizListQueryArgs.pageSize,
    opUser: bizListQueryArgs.opUser
  };
  switch (bizListQueryArgs.showHidden) {
    case true:
      req.status = BatchJobBizStatus.Hidden;
      break;
    case false:
      req.status = BatchJobBizStatus.None;
      break;
  }

  batchJobClient
    .batchJobServiceQueryBizList(req)
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
function processApiData(r: BatchJobQueryBizListRsp) {
  data.value = r.line ?? [];
  bizListQueryArgs.pageSize = r.pageSize ?? 20;
  bizListQueryArgs.dataTotal = r.total ?? 0;
}

// 隐藏变更
function hiddenChange() {
  bizListQueryArgs.page = 1;
  submitQuery();
}

// 使用mock数据填充
// processApiData(mockData);

// 立即刷新
submitQuery();
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
        <el-button
          type="primary"
          @click="router.push({ name: 'RegistryBiz' })"
          :icon="iconAdd"
          >新增业务</el-button
        >
      </div>
      <el-divider />
      <!-- 让布局容器充满可用空间 -->
      <el-container class="flex-1 flex flex-col">
        <el-header>
          <el-space direction="horizontal" size="large">
            <el-input
              v-model="bizListQueryArgs.opUser"
              style="max-width: 250px"
              @blur="submitQuery"
            >
              <template #prepend>操作用户</template>
            </el-input>
            <el-switch
              v-model="bizListQueryArgs.showHidden"
              size="large"
              active-text="查看隐藏的业务"
              @change="hiddenChange"
            />
            <el-button type="primary" @click="forceQuery" :icon="iconSearch"
              >搜索</el-button
            >
            <el-button type="default" @click="resetQuery">重置</el-button>
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
            v-model:current-page="bizListQueryArgs.page"
            v-model:page-size="bizListQueryArgs.pageSize"
            background
            layout="total, prev, pager, next, sizes, jumper"
            :page-sizes="[20, 50, 100]"
            @size-change="submitQuery"
            @current-change="submitQuery"
            :total="bizListQueryArgs.dataTotal"
            :disabled="isLoading"
          />
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
