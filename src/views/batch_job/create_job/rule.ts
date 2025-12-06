import { reactive, ref } from "vue";
import { JobFormData } from "@/views/batch_job/utils/types";
import type { FormInstance, FormRules } from "element-plus";
export const ruleFormRef = ref<FormInstance>();
export const rules = reactive<FormRules<JobFormData>>({
  bizId: [
    {
      required: true,
      message: "必填项",
      validator: (rule, value, callback) => {
        if (value === undefined || value === null) {
          callback(new Error("请选择业务"));
        } else if (value < 1) {
          callback(new Error("业务无效"));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ],
  processDataTotal: [
    {
      required: true,
      message: "必须>0",
      validator: (rule, value, callback) => {
        if (value === undefined || value === null) {
          callback(new Error("请输入数据量"));
        } else if (value < 1) {
          callback(new Error("数据量无效"));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ]
  // rateSec: { required: true, message: "必填项", trigger: "blur" }
});
