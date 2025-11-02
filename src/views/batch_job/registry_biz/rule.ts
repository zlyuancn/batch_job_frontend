import { reactive, ref } from "vue";
import { BizFormData } from "@/views/batch_job/utils/types";
import type { FormInstance, FormRules } from "element-plus";
export const ruleFormRef = ref<FormInstance>();
export const rules = reactive<FormRules>({
  bizName: [{ required: true, message: "必填项", trigger: "blur" }],
  "execExtendData.httpCallback.process": [
    { required: true, message: "必填项", trigger: "blur" }
  ],
  rateSec: { required: true, message: "必填项", trigger: "blur" }
});
