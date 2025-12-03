<script setup lang="ts">
import {
  BatchJobJobInfoA2JobFormData,
  jobFormInitData,
  jobListQueryArgs
} from "../utils/data";
import { rules, ruleFormRef } from "./rule";
import { reactive, ref } from "vue";
import {
  batchJobClient,
  BatchJobConcType,
  BatchJobAdminCreateJobReq,
  BatchJobQueryJobInfoReq,
  QueryAllBizNameRspLineA,
  BatchJobAdminUpdateJobReq
} from "@/api/batch_job_client";
import { message } from "@/utils/message";
import router from "@/router";
import { useRoute } from "vue-router";
import { concTypeOptions, JobFormData, jobStatusOptions } from "../utils/types";
import { OpSource } from "../utils/types";
import { getToken } from "@/utils/auth";

import iconCheck from "~icons/ep/check";
import iconEdit from "~icons/ep/edit";
import iconVideoPlay from "~icons/ep/video-play";
import iconClose from "~icons/ep/close";

// 注册任务/修改任务
defineOptions({
  name: "CreateJob"
});

const user = getToken();

const route = useRoute();

const isLoading = ref(false);

const formData = reactive<JobFormData>(Object.assign({}, jobFormInitData));

const bizNameList = ref<Array<QueryAllBizNameRspLineA>>([]);
function getBizNameList() {
  batchJobClient
    .batchJobServiceQueryAllBizName({})
    .then(res => {
      bizNameList.value = res?.data?.line;
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

const submitCreate = async (createAndRun: boolean = false) => {
  if (!ruleFormRef.value) return;
  isLoading.value = true;
  try {
    await ruleFormRef.value.validate();
    console.log("submit!", formData);
  } catch (error) {
    console.log("error submit!", error);
    isLoading.value = false;
    return;
  }

  const req: BatchJobAdminCreateJobReq = {
    bizId: formData.bizId,
    jobName: formData.jobName,
    jobData: formData.jobData,
    processDataTotal: String(formData.processDataTotal),
    processedCount: String(formData.processedCount),

    rateSec: formData.rateSec,

    op: {
      opSource: OpSource.Web,
      opUserid: user.username,
      opUserName: user.nickname,
      opRemark: formData.opRemark
    },

    startNow: createAndRun
  };
  switch (formData.concType) {
    case 0:
      req.concType = BatchJobConcType.RateSec;
      break;
    case 1:
      req.concType = BatchJobConcType.Serialization;
      break;
  }

  await batchJobClient
    .batchJobServiceAdminCreateJob(req)
    .then(result => {
      console.log(result);
      message("创建成功", { type: "success" });
      Object.assign(jobListQueryArgs, {
        page: 1,
        bizId: formData.bizId,
        status: "0"
      });
      router.back();
    })
    .catch(err => {
      console.log(err);
      const errMsg = err?.response?.data?.message ?? err;
      message("创建失败\n" + errMsg, { type: "error" });
    });

  isLoading.value = false;
};
const submitChange = async () => {
  if (!ruleFormRef.value) return;
  isLoading.value = true;
  try {
    await ruleFormRef.value.validate();
    console.log("submit!", formData);
  } catch (error) {
    console.log("error submit!", error);
    isLoading.value = false;
    return;
  }

  const req: BatchJobAdminUpdateJobReq = {
    jobId: String(formData.jobId),

    jobName: formData.jobName,
    jobData: formData.jobData,
    processDataTotal: String(formData.processDataTotal),
    processedCount: String(formData.processedCount),

    rateSec: formData.rateSec,

    op: {
      opSource: OpSource.Web,
      opUserid: user.username,
      opUserName: user.nickname,
      opRemark: formData.opRemark
    }
  };
  switch (formData.concType) {
    case 0:
      req.concType = BatchJobConcType.RateSec;
      break;
    case 1:
      req.concType = BatchJobConcType.Serialization;
      break;
  }

  await batchJobClient
    .batchJobServiceAdminUpdateJob(req)
    .then(result => {
      console.log(result);
      message("修改成功", { type: "success" });
      Object.assign(jobListQueryArgs, {
        page: 1,
        bizId: formData.bizId,
        status: "0"
      });
      router.back();
    })
    .catch(err => {
      console.log(err);
      const errMsg = err?.response?.data?.message ?? err;
      message("修改失败\n" + errMsg, { type: "error" });
    });

  isLoading.value = false;
};

// 对于修改页面, 从服务端加载相关数据
function changePageInit() {
  formData.jobId = Number(route.query["jobId"]);
  // 查询任务信息
  const req: BatchJobQueryJobInfoReq = {
    jobId: String(route.query["jobId"])
  };
  isLoading.value = true;
  batchJobClient
    .batchJobServiceQueryJobInfo(req)
    .then(result => {
      console.log("query job result", result);
      const line = result?.data?.line;
      if (!line) {
        message("查询数据失败\n无法获取到 line", { type: "error" });
      } else {
        console.log("query job line result", line);
        BatchJobJobInfoA2JobFormData(formData, line);
        console.info("query job update formData", formData);
      }
      isLoading.value = false;
    })
    .catch(err => {
      const errMsg = err?.response?.data?.message ?? err;
      message("查询数据失败\n" + errMsg, { type: "error" });
    });
}

// 对于修改数据, 使用服务端的数据填充
const isChange: boolean = route.name == "ChangeJob";
if (isChange) {
  changePageInit();
} else {
  // 如果路由传入了 bizId 则填充
  formData.bizId = Number(route.query["bizId"] ?? "");
}
</script>

<template>
  <div>
    <el-form
      :model="formData"
      :rules="rules"
      ref="ruleFormRef"
      label-width="auto"
      style="max-width: 800px"
    >
      <el-form-item label="任务id" v-if="isChange">
        <el-input-number v-model="formData.jobId" disabled></el-input-number>
      </el-form-item>
      <el-form-item label="业务类型" prop="bizId">
        <el-select
          v-model="formData.bizId"
          filterable
          placeholder="业务类型"
          style="width: 240px"
          prop="bizId"
          :disabled="isChange"
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
      </el-form-item>
      <el-form-item label="任务名">
        <el-input
          clearable
          maxlength="32"
          show-word-limit
          v-model="formData.jobName"
        />
        <el-text style="color: var(--el-text-color-secondary)"
          >用于展示, 让使用者大概知道这个任务是什么</el-text
        >
      </el-form-item>
      <el-form-item label="任务数据">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2 }"
          :maxlength="8192"
          show-word-limit
          v-model="formData.jobData"
        />
      </el-form-item>

      <el-form-item label="需要处理数据总数">
        <el-input-number :min="0" v-model="formData.processDataTotal" />
        <el-text style="color: var(--el-text-color-secondary)"
          >表示这个任务要处理多少数据量</el-text
        >
      </el-form-item>
      <el-form-item label="已处理过的数据量">
        <el-input-number :min="0" v-model="formData.processedCount" />
        <el-text style="color: var(--el-text-color-secondary)"
          >表示要跳过多少个待处理的数据</el-text
        >
      </el-form-item>

      <el-form-item label="并发类型" prop="concType">
        <el-select
          v-model="formData.concType"
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in concTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <el-space direction="horizontal" :size="50">
              <span style="float: left">{{ item.label }}</span>
              <span
                style="
                  float: right;
                  font-size: 13px;
                  color: var(--el-text-color-secondary);
                "
              >
                {{ item.desc }}</span
              >
            </el-space>
          </el-option>
        </el-select>
        <el-text
          v-if="formData.concType == 1"
          style="color: var(--el-text-color-secondary)"
        >
          {{ concTypeOptions[1]?.desc }}</el-text
        >
      </el-form-item>
      <el-form-item label="每秒速率" prop="rate_sec">
        <el-space direction="horizontal" size="large">
          <el-input-number
            :min="0"
            :max="10000"
            :step="10"
            v-model="formData.rateSec"
          />
          <el-text style="color: var(--el-text-color-secondary)"
            >数据每秒处理速度, 0表示不限速</el-text
          >
        </el-space>
      </el-form-item>

      <el-form-item label="操作描述" prop="opRemark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2 }"
          :maxlength="1000"
          show-word-limit
          v-model="formData.opRemark"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="isLoading"
          :disabled="isLoading"
          @click="submitCreate(false)"
          v-if="!isChange"
          :icon="iconCheck"
          >创建</el-button
        >
        <el-button
          type="success"
          :loading="isLoading"
          :disabled="isLoading"
          @click="submitCreate(true)"
          v-if="!isChange"
          :icon="iconVideoPlay"
          >创建并运行</el-button
        >
        <el-button
          type="primary"
          :loading="isLoading"
          :disabled="isLoading"
          @click="submitChange"
          v-if="isChange"
          :icon="iconEdit"
          >修改</el-button
        >
        <el-button @click="router.back()" :icon="iconClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
