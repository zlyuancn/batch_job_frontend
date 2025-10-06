import { reactive, ref } from "vue";
import type { FormData } from "./types";
import type { FormInstance, FormRules } from "element-plus";
export const ruleFormRef = ref<FormInstance>();
export const rules = reactive<FormRules<FormData>>({
  bizName: [{ required: true, message: "必填项", trigger: "blur" }],
  cbProcess: [{ required: true, message: "必填项", trigger: "blur" }],

  rateSec: { required: true, message: "必填项", trigger: "blur" }
});
