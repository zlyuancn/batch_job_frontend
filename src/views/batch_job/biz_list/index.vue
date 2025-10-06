<script setup lang="ts">
// 业务列表
import { reactive, ref } from "vue";
import {
  type BatchJobQueryBizListReq,
  BatchJobQueryBizListRsp
} from "@/api/batch_job_client";
import { columnsRule } from "./rule";
import { mockData } from "./data";
import { Loading } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { batchJobClient } from "@/api/batch_job_client";
import { message } from "@/utils/message";

defineOptions({
  name: "BizList"
});

const page = ref(1);
const pageSize = ref(20);
const dataTotal = ref(1);
const isLoading = ref(false);

const queryData = reactive({
  opUser: ""
});

const router = useRouter();

const pageChange = () => {
  console.log(`PageChange page: ${page.value} pageSize: ${pageSize.value}`);
  const req: BatchJobQueryBizListReq = {
    page: page.value,
    pageSize: pageSize.value,
    status: 0
  };

  isLoading.value = true;
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
  data.value = r.line;
  pageSize.value = r.pageSize;
  dataTotal.value = r.total;
}

// 使用mock数据填充
// processApiData(mockData);

// 立即刷新
pageChange();
</script>

<template>
  <div>
    <div
      class="common-layout flex-1 flex flex-col"
      style="height: calc(100vh - 100px)"
    >
      <!-- 让布局容器充满可用空间 -->
      <el-container class="flex-1 flex flex-col">
        <el-header>
          <el-button
            type="primary"
            @click="router.push({ name: 'RegistryBiz' })"
            >新增业务</el-button
          >
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
                >
                  <!--                加载遮罩层-->
                  <template #overlay v-if="isLoading">
                    <div
                      class="el-loading-mask"
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <el-icon
                        class="is-loading"
                        color="var(--el-color-primary)"
                        :size="26"
                      >
                        <Loading />
                      </el-icon>
                    </div>
                  </template>
                </el-table-v2>
              </template>
            </el-auto-resizer>
          </div>
        </el-main>
        <el-footer class="py-3">
          <!-- 底部区域保持固定高度 -->
          <el-pagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            background
            layout="total, prev, pager, next, sizes, jumper"
            :page-sizes="[20, 50, 100]"
            @size-change="pageChange"
            @current-change="pageChange"
            :total="dataTotal"
            :disabled="isLoading"
          />
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
