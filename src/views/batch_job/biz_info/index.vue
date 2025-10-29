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
  formData.bizId = Number(route.query["bizId"]);
  // 查询业务信息
  const req: BatchJobQueryBizInfoReq = {
    bizId: Number(route.query["bizId"])
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
          <el-input-number :min="1" v-model="formData.bizId" />
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

      <div v-if="formData?.execType == 1">
        <el-space direction="horizontal" size="small">
          <el-form-item label="创建任务回调url">
            <el-input
              maxlength="128"
              show-word-limit
              v-model="formData.execExtendData.httpCallback.cbBeforeCreate"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item
            v-if="
              formData.execExtendData?.httpCallback?.cbBeforeCreate?.length > 0
            "
            label="超时秒数"
          >
            <el-input-number
              :min="0"
              :max="60"
              v-model="
                formData.execExtendData.httpCallback.cbBeforeCreateTimeout
              "
            />
          </el-form-item>
        </el-space>
        <el-space direction="horizontal" size="small">
          <el-form-item label="启动前回调">
            <el-input
              maxlength="128"
              show-word-limit
              v-model="formData.execExtendData.httpCallback.cbBeforeRun"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item
            v-if="
              formData.execExtendData?.httpCallback?.cbBeforeRun?.length > 0
            "
            label="超时秒数"
          >
            <el-input-number
              :min="0"
              :max="3600"
              v-model="formData.execExtendData.httpCallback.cbBeforeRunTimeout"
            />
          </el-form-item>
        </el-space>
        <el-space direction="horizontal" size="small">
          <el-form-item label="处理任务回调">
            <el-input
              maxlength="128"
              show-word-limit
              v-model="formData.execExtendData.httpCallback.cbProcess"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item
            v-if="formData.execExtendData?.httpCallback?.cbProcess?.length > 0"
            label="超时秒数"
          >
            <el-input-number
              :min="0"
              :max="3600"
              v-model="formData.execExtendData.httpCallback.cbProcessTimeout"
            />
          </el-form-item>
        </el-space>
        <el-space direction="horizontal" size="small">
          <el-form-item label="任务停止回调">
            <el-input
              maxlength="128"
              show-word-limit
              v-model="formData.execExtendData.httpCallback.cbProcessStop"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item
            v-if="
              formData.execExtendData?.httpCallback?.cbProcessStop?.length > 0
            "
            label="超时秒数"
          >
            <el-input-number
              :min="0"
              :max="3600"
              v-model="
                formData.execExtendData.httpCallback.cbProcessStopTimeout
              "
            />
          </el-form-item>
        </el-space>
      </div>

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
