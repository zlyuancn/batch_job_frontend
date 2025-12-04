<script setup lang="ts">
import {
  BatchJobBizInfoA2BizFormData,
  bizFormInitData,
  bizListQueryArgs,
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
import Headers from "@/views/batch_job/components/Headers/index.vue";

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
            beforeCreate: formData.execExtendData?.httpCallback?.beforeCreate,
            beforeRun: formData.execExtendData?.httpCallback?.beforeRun,
            process: formData.execExtendData?.httpCallback?.process,
            processStop: formData.execExtendData?.httpCallback?.processStop,
            beforeCreateTimeout:
              formData.execExtendData?.httpCallback?.beforeCreateTimeout,
            beforeRunTimeout:
              formData.execExtendData?.httpCallback?.beforeRunTimeout,
            processTimeout:
              formData.execExtendData?.httpCallback?.processTimeout,
            processStopTimeout:
              formData.execExtendData?.httpCallback?.processStopTimeout,
            insecureSkipVerify:
              formData.execExtendData?.httpCallback?.insecureSkipVerify,
            headers: formData.execExtendData?.httpCallback?.headers,
            proxy: formData.execExtendData?.httpCallback?.proxy,
            rspParseField: formData.execExtendData?.httpCallback?.rspParseField
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
            beforeCreate: formData.execExtendData?.httpCallback?.beforeCreate,
            beforeRun: formData.execExtendData?.httpCallback?.beforeRun,
            process: formData.execExtendData?.httpCallback?.process,
            processStop: formData.execExtendData?.httpCallback?.processStop,
            beforeCreateTimeout:
              formData.execExtendData?.httpCallback?.beforeCreateTimeout,
            beforeRunTimeout:
              formData.execExtendData?.httpCallback?.beforeRunTimeout,
            processTimeout:
              formData.execExtendData?.httpCallback?.processTimeout,
            processStopTimeout:
              formData.execExtendData?.httpCallback?.processStopTimeout,
            insecureSkipVerify:
              formData.execExtendData?.httpCallback?.insecureSkipVerify,
            headers: formData.execExtendData?.httpCallback?.headers,
            proxy: formData.execExtendData?.httpCallback?.proxy,
            rspParseField: formData.execExtendData?.httpCallback?.rspParseField
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
      style="max-width: 1000px"
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
        <el-input
          clearable
          maxlength="32"
          show-word-limit
          v-model="formData.bizName"
        />
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

      <div v-if="formData?.execType == 1" class="box-frame">
        <el-space direction="vertical" alignment="normal" size="small">
          <el-space direction="horizontal" size="small">
            <el-form-item label="创建任务回调url" prop="beforeCreate">
              <el-input
                maxlength="128"
                show-word-limit
                v-model="formData.execExtendData.httpCallback.beforeCreate"
                style="width: 600px"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="
                formData.execExtendData?.httpCallback?.beforeCreate?.length > 0
              "
              label="超时秒数"
              prop="beforeCreateTimeout"
            >
              <el-input-number
                :min="0"
                :max="60"
                v-model="
                  formData.execExtendData.httpCallback.beforeCreateTimeout
                "
              />
            </el-form-item>
          </el-space>
          <el-space direction="horizontal" size="small">
            <el-form-item label="启动前回调" prop="beforeRun">
              <el-input
                maxlength="128"
                show-word-limit
                v-model="formData.execExtendData.httpCallback.beforeRun"
                style="width: 600px"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="
                formData.execExtendData?.httpCallback?.beforeRun?.length > 0
              "
              label="超时秒数"
              prop="beforeRunTimeout"
            >
              <el-input-number
                :min="0"
                :max="3600"
                v-model="formData.execExtendData.httpCallback.beforeRunTimeout"
              />
            </el-form-item>
          </el-space>
          <el-space direction="horizontal" size="small">
            <el-form-item
              label="处理任务回调"
              prop="execExtendData.httpCallback.process"
            >
              <el-input
                maxlength="128"
                show-word-limit
                v-model="formData.execExtendData.httpCallback.process"
                style="width: 600px"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="formData.execExtendData?.httpCallback?.process?.length > 0"
              label="超时秒数"
              prop="processTimeout"
            >
              <el-input-number
                :min="0"
                :max="3600"
                v-model="formData.execExtendData.httpCallback.processTimeout"
              />
            </el-form-item>
          </el-space>
          <el-space direction="horizontal" size="small">
            <el-form-item label="任务停止回调" prop="processStop">
              <el-input
                maxlength="128"
                show-word-limit
                v-model="formData.execExtendData.httpCallback.processStop"
                style="width: 600px"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="
                formData.execExtendData?.httpCallback?.processStop?.length > 0
              "
              label="超时秒数"
              prop="processStopTimeout"
            >
              <el-input-number
                :min="0"
                :max="3600"
                v-model="
                  formData.execExtendData.httpCallback.processStopTimeout
                "
              />
            </el-form-item>
          </el-space>
          <el-space direction="horizontal" size="small">
            <el-form-item label="回调响应解析字段">
              <el-input
                maxlength="64"
                show-word-limit
                v-model="formData.execExtendData.httpCallback.rspParseField"
                style="width: 400px"
                clearable
              />
              <el-text style="color: var(--el-text-color-secondary)"
                >有些网关会对响应数据包装一层,
                这里告诉批量工具实际响应数据是哪个字段. 只允许一层</el-text
              >
            </el-form-item>
          </el-space>
          <el-space direction="horizontal" size="small">
            <el-form-item label="不安全的连接">
              <el-switch
                v-model="
                  formData.execExtendData.httpCallback.insecureSkipVerify
                "
                size="large"
              />
            </el-form-item>
            <el-text style="color: var(--el-text-color-secondary)"
              >启用不安全的连接时不会验证https证书</el-text
            >
          </el-space>
          <el-space direction="horizontal" size="small">
            <el-form-item label="Headers">
              <Headers
                v-model="formData.execExtendData.httpCallback.headers"
              ></Headers>
            </el-form-item>
          </el-space>
          <el-form-item label="代理">
            <el-input
              maxlength="128"
              show-word-limit
              v-model="formData.execExtendData.httpCallback.proxy"
              style="width: 800px"
              clearable
            />
            <el-text style="color: var(--el-text-color-secondary)"
              >支持 http, https, socks5, socks5h. 示例: https://127.0.0.1:1080
              https://user:pwd@127.0.0.1:1080</el-text
            >
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

<style scoped>
@import url("@/style/box-frame.css");
</style>
