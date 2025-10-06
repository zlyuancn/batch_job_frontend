<script setup lang="ts">
import { formData, initData } from "./data";
import { rules, ruleFormRef } from "./rule";
import { ref } from "vue";
import {
  type BatchJobAdminRegistryBizReq,
  type BatchJobOpInfoQ,
  batchJobClient,
  BatchJobExecType,
  BatchJobQueryBizInfoReq,
  BatchJobRateType
} from "@/api/batch_job_client";
import { message } from "@/utils/message";
import router from "@/router";
import { useRoute } from "vue-router";
import { execTypeOptions, FormData, rateTypeOptions } from "./types";
import { OpSource } from "@/views/batch_job/utils/types";
import { getToken } from "@/utils/auth";

// 注册业务/修改业务
defineOptions({
  name: "RegistryBiz"
});

const user = getToken();

const route = useRoute();

const loading = ref(false);

const onSubmit = async () => {
  if (!ruleFormRef.value) return;
  loading.value = true;
  try {
    await ruleFormRef.value.validate();
    console.log("submit!", formData);

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

      rateSec: formData.rateSec,

      op: {
        opSource: OpSource.Web,
        opUserid: user.username,
        opUserName: user.nickname,
        opRemark: formData.opRemark
      }
    };
    switch (formData.execType) {
      case 1:
        req.execType = BatchJobExecType.HttpCallback;
        break;
    }
    switch (formData.rateType) {
      case 0:
        req.rateType = BatchJobRateType.RateSec;
        break;
      case 1:
        req.rateType = BatchJobRateType.Serialization;
        break;
    }

    if (isChange) {
      batchJobClient
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
      batchJobClient
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
  } catch (error) {
    console.log("error submit!", error);
  }
  loading.value = false;
};

// 重置数据
// Object.assign(formData, initData);

// 对于修改数据, 使用服务端的数据填充
const isChange: boolean = route.name == "ChangeBiz";
if (isChange) {
  formData.bizType = Number(route.query["bizType"]);
  // 查询业务信息
  const req: BatchJobQueryBizInfoReq = {
    bizType: Number(route.query["bizType"])
  };
  loading.value = true;
  batchJobClient
    .batchJobServiceQueryBizInfo(req)
    .then(result => {
      console.log("query biz result", result);
      const line = result?.data?.line;
      if (!line) {
        message("查询数据失败\n无法获取到 line", { type: "error" });
      } else {
        console.log("query biz line result", line);
        Object.assign(formData, <FormData>{
          bizType: line.bizType,
          bizName: line.bizName,
          remark: line.remark,

          execType: Number(line.execType ?? 0),
          cbBeforeCreate: line.cbBeforeCreate,
          cbBeforeRun: line.cbBeforeRun,
          cbProcess: line.cbProcess,
          cbProcessStop: line.cbProcessStop,
          cbBeforeCreateTimeout: line.cbBeforeCreateTimeout,
          cbBeforeRunTimeout: line.cbBeforeRunTimeout,
          cbProcessTimeout: line.cbProcessTimeout,
          cbProcessStopTimeout: line.cbProcessStopTimeout,

          rateType: Number(line.rateType ?? 0),
          rateSec: line.rateSec,

          opRemark: line?.op?.opRemark
        });
        console.info("query biz update formData", formData);
      }
    })
    .catch(err => {
      const errMsg = err?.response?.data?.message ?? err;
      message("查询数据失败\n" + errMsg, { type: "error" });
    })
    .finally(() => {
      loading.value = false;
    });
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

      <el-form-item label="限速类型" prop="rateType">
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
          :loading="loading"
          :disabled="loading"
          @click="onSubmit"
          >{{ isChange ? "修改" : "注册" }}</el-button
        >
        <el-button @click="router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
