import { reactive } from "vue";
import { FormData } from "./types";

export const initData = {
  bizType: 0,
  bizName: "",
  remark: "",

  execType: 1,
  cbBeforeCreate: "",
  cbBeforeRun: "",
  cbProcess: "",
  cbProcessStop: "",
  cbBeforeCreateTimeout: 5,
  cbBeforeRunTimeout: 60,
  cbProcessTimeout: 60,
  cbProcessStopTimeout: 60,

  rateType: 0,
  rateSec: 1000,

  opRemark: ""
};
export const formData = reactive<FormData>(Object.assign({}, initData));
