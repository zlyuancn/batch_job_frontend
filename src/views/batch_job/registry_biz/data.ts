import { reactive } from "vue";
import { FormData } from "./types";

export const formData = reactive<FormData>({
  biz_type: 0,
  biz_name: "",
  remark: "",

  exec_type: 1,
  cb_before_create: "",
  cb_before_run: "",
  cb_process: "",
  cb_process_stop: "",
  cb_before_create_timeout: 5,
  cb_before_run_timeout: 60,
  cb_process_timeout: 60,
  cb_process_stop_timeout: 60,

  rate_type: 0,
  rate_sec: 1000
});
