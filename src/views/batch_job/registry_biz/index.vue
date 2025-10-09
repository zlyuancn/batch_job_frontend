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
  BatchJobBizStatus
} from "@/api/batch_job_client";
import { message } from "@/utils/message";
import router from "@/router";
import { useRoute } from "vue-router";
import { execTypeOptions, BizFormData, bizStatusOptions } from "../utils/types";
import { OpSource } from "../utils/types";
import { getToken } from "@/utils/auth";

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

  const req: BatchJobAdminRegistryBizReq = {
    bizType: formData.bizType,
    bizName: formData.bizName,
    remark: formData.remark,

    cbBeforeCreate: formData.cbBeforeCreate,
    cbBeforeRun: formData.cbBeforeRun,
    cbProcess: formData.cbProcess,
    cbProcessStop: formData.cbProcessStop,
    cbBeforeCreateTimeout: formData.cbBeforeCreateTimeout,
    cbBeforeRunTimeout: formData.cbBeforeRunTimeout,
    cbProcessTimeout: formData.cbProcessTimeout,
    cbProcessStopTimeout: formData.cbProcessStopTimeout,

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
  if (!isChange) req.status = BatchJobBizStatus.None;

  if (isChange) {
    await batchJobClient
      .batchJobServiceAdminChangeBiz(req)
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
      <el-form-item label="业务类型" prop="bizType">
        <el-space direction="horizontal">
          <el-input-number
            :min="1"
            v-model="formData.bizType"
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

      <el-space direction="horizontal" size="small">
        <el-form-item label="创建任务回调url" prop="cbBeforeCreate">
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
          prop="cbBeforeCreateTimeout"
        >
          <el-input-number
            :min="0"
            :max="60"
            v-model="formData.cbBeforeCreateTimeout"
          />
        </el-form-item>
      </el-space>
      <el-space direction="horizontal" size="small">
        <el-form-item label="启动前回调" prop="cbBeforeRun">
          <el-input
            maxlength="128"
            show-word-limit
            v-model="formData.cbBeforeRun"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.cbBeforeRun?.length > 0"
          label="超时秒数"
          prop="cbBeforeRunTimeout"
        >
          <el-input-number
            :min="0"
            :max="3600"
            v-model="formData.cbBeforeRunTimeout"
          />
        </el-form-item>
      </el-space>
      <el-space direction="horizontal" size="small">
        <el-form-item label="处理任务回调" prop="cbProcess">
          <el-input
            maxlength="128"
            show-word-limit
            v-model="formData.cbProcess"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.cbProcess?.length > 0"
          label="超时秒数"
          prop="cbProcessTimeout"
        >
          <el-input-number
            :min="0"
            :max="3600"
            v-model="formData.cbProcessTimeout"
          />
        </el-form-item>
      </el-space>
      <el-space direction="horizontal" size="small">
        <el-form-item label="任务停止回调" prop="cbProcessStop">
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
          prop="cbProcessStopTimeout"
        >
          <el-input-number
            :min="0"
            :max="3600"
            v-model="formData.cbProcessStopTimeout"
          />
        </el-form-item>
      </el-space>

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
          >{{ isChange ? "修改" : "注册" }}</el-button
        >
        <el-button @click="router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
