import { reactive, ref } from "vue";
import type { FormData } from "./data";
import type { FormInstance, FormRules } from "element-plus";
export const ruleFormRef = ref<FormInstance>();
export const rules = reactive<FormRules<FormData>>({
  biz_name: [{ required: true, message: "必填项", trigger: "blur" }],
  cb_before_create: [
    { type: "url", message: "请输入有效的URL地址", trigger: "blur" }
  ],
  cb_before_run: [
    { type: "url", message: "请输入有效的URL地址", trigger: "blur" }
  ],
  cb_process: [
    { required: true, message: "必填项", trigger: "blur" },
    { type: "url", message: "请输入有效的URL地址", trigger: "blur" }
  ],
  cb_process_stop: [
    { type: "url", message: "请输入有效的URL地址", trigger: "blur" }
  ],

  rate_sec: { required: true, message: "必填项", trigger: "blur" }
});
