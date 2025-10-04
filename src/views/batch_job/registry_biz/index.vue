<script setup lang="ts">
import { execTypeOptions, formData, rateTypeOptions } from "./data";
import { rules, ruleFormRef } from "./rule";
import { ref } from "vue";
import {
  type BatchJobAdminRegistryBizReq,
  batchJobClient,
  BatchJobExecType,
  BatchJobRateType
} from "@/api/batch_job_client";
import { message } from "@/utils/message";

defineOptions({
  name: "RegistryBiz"
});

const loading = ref(false);

const onSubmit = async () => {
  if (!ruleFormRef.value) return;
  loading.value = true;
  try {
    await ruleFormRef.value.validate();
    console.log("submit!", formData);

    const req = <BatchJobAdminRegistryBizReq>{
      bizType: formData.biz_type,
      bizName: formData.biz_name,
      remark: formData.remark,

      cbBeforeCreate: formData.cb_before_create,
      cbBeforeRun: formData.cb_before_run,
      cbProcess: formData.cb_process,
      cbProcessStop: formData.cb_process_stop,
      cbBeforeCreateTimeout: formData.cb_before_create_timeout,
      cbBeforeRunTimeout: formData.cb_before_run_timeout,
      cbProcessTimeout: formData.cb_process_timeout,
      cbProcessStopTimeout: formData.cb_process_stop_timeout,

      rateSec: formData.rate_sec
    };
    switch (formData.exec_type) {
      case 1:
        req.execType = BatchJobExecType.HttpCallback;
        break;
    }
    switch (formData.rate_type) {
      case 0:
        req.rateType = BatchJobRateType.RateSec;
        break;
      case 1:
        req.rateType = BatchJobRateType.Serialization;
        break;
    }

    await batchJobClient
      .batchJobServiceAdminRegistryBiz(req)
      .then(result => {
        console.log(result);
        message("创建成功", { type: "success" });
      })
      .catch(err => {
        console.log(err);
        const errmsg = err?.response?.data?.message ?? err;
        message("创建失败\n" + errmsg, { type: "error" });
      });
  } catch (error) {
    console.log("error submit!", error);
  }
  loading.value = false;
};
</script>

<template>
  <el-form
    :model="formData"
    :rules="rules"
    ref="ruleFormRef"
    label-width="auto"
    style="max-width: 800px"
  >
    <el-form-item label="业务类型" prop="biz_type">
      <el-space direction="horizontal">
        <el-input-number :min="1" v-model="formData.biz_type" />
        <el-text style="color: var(--el-text-color-secondary)"
          >全局唯一的值, 表示一个业务的id</el-text
        >
      </el-space>
    </el-form-item>
    <el-form-item label="业务名" prop="biz_name">
      <el-input maxlength="32" show-word-limit v-model="formData.biz_name" />
      <el-text style="color: var(--el-text-color-secondary)"
        >用于展示, 让使用者大概知道这个业务是什么</el-text
      >
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2 }"
        :maxlength="1000"
        show-word-limit
        v-model="formData.remark"
      />
    </el-form-item>

    <el-form-item label="执行类型" prop="exec_type">
      <el-select
        v-model="formData.exec_type"
        placeholder="Select"
        style="width: 240px"
      >
        <el-option
          v-for="item in execTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-space direction="horizontal" size="small">
      <el-form-item label="创建任务回调url" prop="cb_before_create">
        <el-input
          maxlength="128"
          show-word-limit
          v-model="formData.cb_before_create"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item
        v-if="formData.cb_before_create.length > 0"
        label="超时秒数"
        prop="cb_before_create_timeout"
      >
        <el-input-number
          :min="0"
          :max="60"
          v-model="formData.cb_before_create_timeout"
        />
      </el-form-item>
    </el-space>
    <el-space direction="horizontal" size="small">
      <el-form-item label="启动前回调" prop="cb_before_run">
        <el-input
          maxlength="128"
          show-word-limit
          v-model="formData.cb_before_run"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item
        v-if="formData.cb_before_run.length > 0"
        label="超时秒数"
        prop="cb_before_run_timeout"
      >
        <el-input-number
          :min="0"
          :max="3600"
          v-model="formData.cb_before_run_timeout"
        />
      </el-form-item>
    </el-space>
    <el-space direction="horizontal" size="small">
      <el-form-item label="处理任务回调" prop="cb_process">
        <el-input
          maxlength="128"
          show-word-limit
          v-model="formData.cb_process"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item
        v-if="formData.cb_process.length > 0"
        label="超时秒数"
        prop="cb_process_timeout"
      >
        <el-input-number
          :min="0"
          :max="3600"
          v-model="formData.cb_process_timeout"
        />
      </el-form-item>
    </el-space>
    <el-space direction="horizontal" size="small">
      <el-form-item label="任务停止回调" prop="cb_process_stop">
        <el-input
          maxlength="128"
          show-word-limit
          v-model="formData.cb_process_stop"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item
        v-if="formData.cb_process_stop.length > 0"
        label="超时秒数"
        prop="cb_process_stop_timeout"
      >
        <el-input-number
          :min="0"
          :max="3600"
          v-model="formData.cb_process_stop_timeout"
        />
      </el-form-item>
    </el-space>

    <el-form-item label="限速类型" prop="rate_type">
      <el-select
        v-model="formData.rate_type"
        placeholder="Select"
        style="width: 240px"
      >
        <el-option
          v-for="item in rateTypeOptions"
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
        v-if="formData.rate_type == 1"
        style="color: var(--el-text-color-secondary)"
      >
        {{ rateTypeOptions[1]?.desc }}</el-text
      >
    </el-form-item>
    <el-form-item label="每秒速率" prop="rate_sec">
      <el-space direction="horizontal" size="large">
        <el-input-number
          :min="0"
          :max="10000"
          :step="10"
          v-model="formData.rate_sec"
        />
        <el-text style="color: var(--el-text-color-secondary)"
          >数据每秒处理速度, 0表示不限速</el-text
        >
      </el-space>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :loading="loading"
        :disabled="loading"
        @click="onSubmit"
        >注册</el-button
      >
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
