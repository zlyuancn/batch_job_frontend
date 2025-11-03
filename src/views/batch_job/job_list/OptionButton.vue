<script setup lang="ts">
import {
  BatchJobAdminStartJobReq,
  BatchJobAdminStopJobReq
} from "@/api/batch_job";
import { OpSource } from "@/views/batch_job/utils/types";
import { getToken } from "@/utils/auth";
import { batchJobClient } from "@/api/batch_job_client";
import iconVideoPlay from "~icons/ep/video-play";
import iconView from "~icons/ep/view";
import iconVideoPause from "~icons/ep/video-pause";
import iconEdit from "~icons/ep/edit";
import { useRouter } from "vue-router";
import { reactive, ref, watch } from "vue";
import { jobListQueryArgs } from "@/views/batch_job/utils/data";

const props = defineProps({
  jobId: String,
  status: Number,
  updateStatus: Function
});

const user = getToken();
const router = useRouter();

const allowStatus = reactive({
  allowEdit: false,
  allowStop: false,
  allowRun: false
});

watch(
  () => props.status, // 监听的目标（props 中的 count）
  newVal => {
    // 变化时的回调
    const status = Number(newVal) ?? 0;
    Object.assign(allowStatus, {
      allowEdit: status == 0 || status == 5,
      allowStop: status == 1 || status == 2,
      allowRun: status == 0 || status == 5
    });
  },
  {
    immediate: true // 可选：初始渲染时立即执行一次（默认 false）
  }
);

const isLoading = ref(false);

// 开始
function startBtn() {
  isLoading.value = true;
  const req = <BatchJobAdminStartJobReq>{
    jobId: props.jobId,
    op: {
      opSource: OpSource.Web,
      opUserid: user.username,
      opUserName: user.nickname,
      opRemark: ""
    }
  };
  batchJobClient
    .batchJobServiceAdminStartJob(req)
    .then(res => {
      props.updateStatus(2);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

// 停止
function stopBtn() {
  isLoading.value = true;
  const req = <BatchJobAdminStopJobReq>{
    jobId: props.jobId,
    op: {
      opSource: OpSource.Web,
      opUserid: user.username,
      opUserName: user.nickname,
      opRemark: ""
    }
  };
  batchJobClient.batchJobServiceAdminStopJob(req).finally(() => {
    isLoading.value = false;
  });
}

// 编辑
const handleEdit = () => {
  router.push({
    name: "ChangeJob",
    query: { jobId: props.jobId }
  });
};

// 查看
const handleView = () => {
  console.info(props);
  // router.push({
  //   name: "BizInfo",
  //   query: { bizId: v.rowData.bizId }
  // });
};
</script>

<template>
  <div>
    <el-button
      v-if="allowStatus.allowRun"
      size="small"
      @click="startBtn"
      type="success"
      :icon="iconVideoPlay"
      :loading="isLoading"
      :disabled="isLoading"
    >
      运行
    </el-button>
    <el-button
      v-if="allowStatus.allowStop"
      size="small"
      @click="stopBtn"
      type="danger"
      :icon="iconVideoPause"
      :loading="isLoading"
      :disabled="isLoading"
    >
      停止
    </el-button>
    <el-button
      v-if="allowStatus.allowEdit"
      size="small"
      @click="handleEdit"
      :icon="iconEdit"
      :loading="isLoading"
      :disabled="isLoading"
    >
      编辑
    </el-button>
    <el-button
      size="small"
      @click="handleView"
      :icon="iconView"
      :loading="isLoading"
      :disabled="isLoading"
    >
      查看
    </el-button>
  </div>
</template>
