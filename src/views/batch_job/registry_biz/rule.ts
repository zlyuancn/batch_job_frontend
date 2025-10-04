import { reactive, ref } from "vue";
import type { FormData } from "./data";
import type { FormInstance, FormRules } from "element-plus";
export const ruleFormRef = ref<FormInstance>();
export const rules = reactive<FormRules<FormData>>({
  cb_before_create: [
    { min: 5, max: 10, message: "Length should be 3 to 5", trigger: "change" }
  ]
});
