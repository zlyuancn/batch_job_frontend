import { BatchJobBizInfoA, BatchJobJobInfoA } from "@/api/batch_job";
import { BizFormData, JobFormData } from "@/views/batch_job/utils/types";
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

  status: 0,
  opRemark: ""
};

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

    status: Number(line.status ?? 0),
    opRemark: line?.op?.opRemark
  });
};

const initBizListQueryArgs = {
  page: 1,
  pageSize: 20,
  dataTotal: 1,
  opUser: "",
  showHidden: false
};
// 业务列表查询参数
export const bizListQueryArgs = reactive(
  Object.assign({}, initBizListQueryArgs)
);
export const resetBizListQueryArgs = () =>
  Object.assign(bizListQueryArgs, initBizListQueryArgs);

// 任务表单初始化数据
export const jobFormInitData: JobFormData = {
  jobId: 0,
  bizType: 0,
  jobName: "",
  jobData: "",
  processDataTotal: 0,
  processedCount: 0,
  rateType: 0,
  rateSec: 0,

  status: 0,
  opRemark: "",
  statusInfo: ""
};

// 将服务端返回的任务信息转为表单数据
export const BatchJobJobInfoA2JobFormData = (
  formData: JobFormData,
  line: BatchJobJobInfoA
) => {
  Object.assign(formData, <JobFormData>{
    jobId: Number(formData.jobId),
    bizType: Number(line.bizType),
    jobName: line.jobName,
    jobData: line.jobData,
    processDataTotal: Number(line.processDataTotal),
    processedCount: Number(line.processedCount),
    rateType: Number(line.rateType ?? 0),
    rateSec: line.rateSec ?? 0,

    status: Number(line.status ?? 0),
    opRemark: line?.op?.opRemark,
    statusInfo: line.statusInfo
  });
};

const initJobListQueryArgs = {
  page: 1,
  pageSize: 20,
  dataTotal: 1,
  opUser: "",
  bizType: 0,
  status: "0",
  rangeTime: []
};
// 任务列表查询参数
export const jobListQueryArgs = reactive(
  Object.assign({}, initJobListQueryArgs)
);
// 重置查询参数
export const resetJobListQueryArgs = () =>
  Object.assign(jobListQueryArgs, initJobListQueryArgs);

// 业务名映射
export const bizNameMap = {};
