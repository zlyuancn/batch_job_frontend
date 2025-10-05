import { reactive, ref } from "vue";
import type { FormData } from "./types";
import type { FormInstance, FormRules } from "element-plus";
export const ruleFormRef = ref<FormInstance>();
export const rules = reactive<FormRules<FormData>>({
  biz_name: [{ required: true, message: "必填项", trigger: "blur" }],
  cb_process: [{ required: true, message: "必填项", trigger: "blur" }],

  rate_sec: { required: true, message: "必填项", trigger: "blur" }
});
