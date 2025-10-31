<script setup lang="ts">
import {
  BatchJobBizInfoA2BizFormData,
  bizFormInitData,
  jobListQueryArgs
} from "../utils/data";
import { rules, ruleFormRef } from "./rule";
import { reactive, ref } from "vue";
import {
  type BatchJobAdminRegistryBizReq,
  batchJobClient,
  BatchJobQueryBizInfoReq,
  BatchJobBizStatus,
  BatchJobAdminUpdateBizReq,
  BatchJobExecType,
  BatchJobExecExtendDataQ,
  BatchJobExecExtendDataHttpCallbackQ
} from "@/api/batch_job_client";
import { message } from "@/utils/message";
import router from "@/router";
import { useRoute } from "vue-router";
import { execTypeOptions, BizFormData, bizStatusOptions } from "../utils/types";
import { OpSource } from "../utils/types";
import { getToken } from "@/utils/auth";

import iconCheck from "~icons/ep/check";
import iconClose from "~icons/ep/close";

// 注册业务/修改业务
defineOptions({
  name: "RegistryBiz"
});

const user = getToken();

const route = useRoute();

const isLoading = ref(false);

const formData = reactive<BizFormData>(Object.assign({}, bizFormInitData));

const onSubmit = async () => {
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

  if (isChange) {
    const req: BatchJobAdminUpdateBizReq = {
      bizId: formData.bizId,
      bizName: formData.bizName,
      remark: formData.remark,

      op: {
        opSource: OpSource.Web,
        opUserid: user.username,
        opUserName: user.nickname,
        opRemark: formData.opRemark
      }
    };
    switch (formData.status) {
      case 0:
        req.status = BatchJobBizStatus.None;
        break;
      case 1:
        req.status = BatchJobBizStatus.Hidden;
        break;
    }
    switch (formData.execType) {
      case 1:
        req.execType = BatchJobExecType.HttpCallback;
        req.execExtendData = <BatchJobExecExtendDataQ>{
          httpCallback: <BatchJobExecExtendDataHttpCallbackQ>{
            cbBeforeCreate:
              formData.execExtendData?.httpCallback?.cbBeforeCreate,
            cbBeforeRun: formData.execExtendData?.httpCallback?.cbBeforeRun,
            cbProcess: formData.execExtendData?.httpCallback?.cbProcess,
            cbProcessStop: formData.execExtendData?.httpCallback?.cbProcessStop,
            cbBeforeCreateTimeout:
              formData.execExtendData?.httpCallback?.cbBeforeCreateTimeout,
            cbBeforeRunTimeout:
              formData.execExtendData?.httpCallback?.cbBeforeRunTimeout,
            cbProcessTimeout:
              formData.execExtendData?.httpCallback?.cbProcessTimeout,
            cbProcessStopTimeout:
              formData.execExtendData?.httpCallback?.cbProcessStopTimeout
          }
        };
        break;
    }

    await batchJobClient
      .batchJobServiceAdminUpdateBiz(req)
      .then(result => {
        console.log(result);
        message("修改成功", { type: "success" });
        router.back();
      })
      .catch(err => {
        console.log(err);
        const errMsg = err?.response?.data?.message ?? err;
        message("修改失败\n" + errMsg, { type: "error" });
      });
  } else {
    const req: BatchJobAdminRegistryBizReq = {
      bizName: formData.bizName,
      remark: formData.remark,

      op: {
        opSource: OpSource.Web,
        opUserid: user.username,
        opUserName: user.nickname,
        opRemark: formData.opRemark
      },

      status: BatchJobBizStatus.None
    };
    switch (formData.execType) {
      case 1:
        req.execType = BatchJobExecType.HttpCallback;
        req.execExtendData = <BatchJobExecExtendDataQ>{
          httpCallback: <BatchJobExecExtendDataHttpCallbackQ>{
            cbBeforeCreate:
              formData.execExtendData?.httpCallback?.cbBeforeCreate,
            cbBeforeRun: formData.execExtendData?.httpCallback?.cbBeforeRun,
            cbProcess: formData.execExtendData?.httpCallback?.cbProcess,
            cbProcessStop: formData.execExtendData?.httpCallback?.cbProcessStop,
            cbBeforeCreateTimeout:
              formData.execExtendData?.httpCallback?.cbBeforeCreateTimeout,
            cbBeforeRunTimeout:
              formData.execExtendData?.httpCallback?.cbBeforeRunTimeout,
            cbProcessTimeout:
              formData.execExtendData?.httpCallback?.cbProcessTimeout,
            cbProcessStopTimeout:
              formData.execExtendData?.httpCallback?.cbProcessStopTimeout
          }
        };
        break;
    }

    await batchJobClient
      .batchJobServiceAdminRegistryBiz(req)
      .then(result => {
        console.log(result);
        message("创建成功", { type: "success" });
        router.back();
      })
      .catch(err => {
        console.log(err);
        const errMsg = err?.response?.data?.message ?? err;
        message("创建失败\n" + errMsg, { type: "error" });
      });
  }
  isLoading.value = false;
};

// 对于修改页面, 从服务端加载相关数据
function changePageInit() {
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

// 对于修改数据, 使用服务端的数据填充
const isChange: boolean = route.name == "ChangeBiz";
if (isChange) changePageInit();
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
      <el-form-item label="业务类型" prop="bizId" v-if="isChange">
        <el-space direction="horizontal">
          <el-input-number
            :min="1"
            v-model="formData.bizId"
            :disabled="isChange"
          />
          <el-text style="color: var(--el-text-color-secondary)"
            >全局唯一的值, 表示一个业务的id</el-text
          >
        </el-space>
      </el-form-item>
      <el-form-item label="业务名" prop="bizName">
        <el-input maxlength="32" show-word-limit v-model="formData.bizName" />
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

      <el-form-item label="执行类型" prop="execType">
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
          <el-form-item label="创建任务回调url" prop="cbBeforeCreate">
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
            prop="cbBeforeCreateTimeout"
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
          <el-form-item label="启动前回调" prop="cbBeforeRun">
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
            prop="cbBeforeRunTimeout"
          >
            <el-input-number
              :min="0"
              :max="3600"
              v-model="formData.execExtendData.httpCallback.cbBeforeRunTimeout"
            />
          </el-form-item>
        </el-space>
        <el-space direction="horizontal" size="small">
          <el-form-item
            label="处理任务回调"
            prop="execExtendData.httpCallback.cbProcess"
          >
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
            prop="cbProcessTimeout"
          >
            <el-input-number
              :min="0"
              :max="3600"
              v-model="formData.execExtendData.httpCallback.cbProcessTimeout"
            />
          </el-form-item>
        </el-space>
        <el-space direction="horizontal" size="small">
          <el-form-item label="任务停止回调" prop="cbProcessStop">
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
            prop="cbProcessStopTimeout"
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

      <el-form-item label="状态" prop="status" v-if="isChange">
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
          @click="onSubmit"
          :icon="iconCheck"
          >{{ isChange ? "修改" : "注册" }}</el-button
        >
        <el-button @click="router.back()" :icon="iconClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
