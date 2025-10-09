<script setup lang="ts">
import { BatchJobBizInfoA2BizFormData, bizFormInitData } from "../utils/data";
import { reactive, ref } from "vue";
import {
  batchJobClient,
  BatchJobQueryBizInfoReq
} from "@/api/batch_job_client";
import { message } from "@/utils/message";
import router from "@/router";
import { useRoute } from "vue-router";
import {
  execTypeOptions,
  BizFormData,
  rateTypeOptions,
  bizStatusOptions
} from "../utils/types";

// 业务信息
defineOptions({
  name: "BizInfo"
});

const route = useRoute();

const isLoading = ref(false);

const formData = reactive<BizFormData>(Object.assign({}, bizFormInitData));

// 使用服务端的数据填充
function initData() {
  formData.bizType = Number(route.query["bizType"]);
  // 查询业务信息
  const req: BatchJobQueryBizInfoReq = {
    bizType: Number(route.query["bizType"])
  };
  isLoading.value = true;
  batchJobClient
    .batchJobServiceQueryBizInfo(req)
    .then(result => {
      console.log("query biz result", result);
      const line = result?.data?.line;
      if (!line) {
        message("查询数据失败\n无法获取到 line", { type: "error" });
      } else {
        console.log("query biz line result", line);
        BatchJobBizInfoA2BizFormData(formData, line);
        console.info("query biz update formData", formData);
      }
      isLoading.value = false;
    })
    .catch(err => {
      const errMsg = err?.response?.data?.message ?? err;
      message("查询数据失败\n" + errMsg, { type: "error" });
    });
}
initData();
</script>

<template>
  <div>
    <el-form
      :model="formData"
      ref="ruleFormRef"
      label-width="auto"
      style="max-width: 800px"
      disabled
    >
      <el-form-item label="业务类型">
        <el-space direction="horizontal">
          <el-input-number :min="1" v-model="formData.bizType" />
          <el-text style="color: var(--el-text-color-secondary)"
            >全局唯一的值, 表示一个业务的id</el-text
          >
        </el-space>
      </el-form-item>
      <el-form-item label="业务名">
        <el-input maxlength="32" show-word-limit v-model="formData.bizName" />
        <el-text style="color: var(--el-text-color-secondary)"
          >用于展示, 让使用者大概知道这个业务是什么</el-text
        >
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2 }"
          :maxlength="1000"
          show-word-limit
          v-model="formData.remark"
        />
      </el-form-item>

      <el-form-item label="执行类型">
        <el-select
          v-model="formData.execType"
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
        <el-form-item label="创建任务回调url">
          <el-input
            maxlength="128"
            show-word-limit
            v-model="formData.cbBeforeCreate"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.cbBeforeCreate?.length > 0"
          label="超时秒数"
        >
          <el-input-number
            :min="0"
            :max="60"
            v-model="formData.cbBeforeCreateTimeout"
          />
        </el-form-item>
      </el-space>
      <el-space direction="horizontal" size="small">
        <el-form-item label="启动前回调">
          <el-input
            maxlength="128"
            show-word-limit
            v-model="formData.cbBeforeRun"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item v-if="formData.cbBeforeRun?.length > 0" label="超时秒数">
          <el-input-number
            :min="0"
            :max="3600"
            v-model="formData.cbBeforeRunTimeout"
          />
        </el-form-item>
      </el-space>
      <el-space direction="horizontal" size="small">
        <el-form-item label="处理任务回调">
          <el-input
            maxlength="128"
            show-word-limit
            v-model="formData.cbProcess"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item v-if="formData.cbProcess?.length > 0" label="超时秒数">
          <el-input-number
            :min="0"
            :max="3600"
            v-model="formData.cbProcessTimeout"
          />
        </el-form-item>
      </el-space>
      <el-space direction="horizontal" size="small">
        <el-form-item label="任务停止回调">
          <el-input
            maxlength="128"
            show-word-limit
            v-model="formData.cbProcessStop"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.cbProcessStop?.length > 0"
          label="超时秒数"
        >
          <el-input-number
            :min="0"
            :max="3600"
            v-model="formData.cbProcessStopTimeout"
          />
        </el-form-item>
      </el-space>

      <el-form-item label="限速类型">
        <el-select
          v-model="formData.rateType"
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
          v-if="formData.rateType == 1"
          style="color: var(--el-text-color-secondary)"
        >
          {{ rateTypeOptions[1]?.desc }}</el-text
        >
      </el-form-item>
      <el-form-item label="每秒速率">
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

      <el-form-item label="状态">
        <el-select
          v-model="formData.status"
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in bizStatusOptions"
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
          v-if="formData.status == 1"
          style="color: var(--el-text-color-secondary)"
        >
          {{ bizStatusOptions[1]?.desc }}</el-text
        >
      </el-form-item>

      <el-form-item label="操作描述">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2 }"
          :maxlength="1000"
          show-word-limit
          v-model="formData.opRemark"
        />
      </el-form-item>
    </el-form>
    <el-button @click="router.back()">返回</el-button>
  </div>
</template>
