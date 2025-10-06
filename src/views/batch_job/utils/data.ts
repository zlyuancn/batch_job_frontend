import { BatchJobBizInfoA } from "@/api/batch_job";
import { BizFormData } from "@/views/batch_job/utils/types";
import { reactive } from "vue";

// 业务表单初始化数据
export const bizFormInitData: BizFormData = {
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

  status: 0,
  opRemark: ""
};

// 业务列表查询参数
export const bizListQueryArgs = reactive({
  page: 1,
  pageSize: 20,
  dataTotal: 1,
  opUser: "",
  showHidden: false
});

// 将服务端返回的业务信息转为表单数据
export const BatchJobBizInfoA2BizFormData = (
  formData: BizFormData,
  line: BatchJobBizInfoA
) => {
  Object.assign(formData, <BizFormData>{
    bizType: line.bizType,
    bizName: line.bizName,
    remark: line.remark,

    execType: Number(line.execType ?? 0),
    cbBeforeCreate: line.cbBeforeCreate,
    cbBeforeRun: line.cbBeforeRun,
    cbProcess: line.cbProcess,
    cbProcessStop: line.cbProcessStop,
    cbBeforeCreateTimeout: line.cbBeforeCreateTimeout ?? 0,
    cbBeforeRunTimeout: line.cbBeforeRunTimeout ?? 0,
    cbProcessTimeout: line.cbProcessTimeout ?? 0,
    cbProcessStopTimeout: line.cbProcessStopTimeout ?? 0,

    rateType: Number(line.rateType ?? 0),
    rateSec: line.rateSec ?? 0,

    status: Number(line.status ?? 0),
    opRemark: line?.op?.opRemark
  });
};
