import { BatchJobBizInfoA, BatchJobJobInfoA } from "@/api/batch_job";
import {
  BizExecExtendData,
  BizExecExtendDataHttpCallback,
  BizFormData,
  JobFormData
} from "@/views/batch_job/utils/types";
import { reactive } from "vue";

// 业务表单初始化数据
export const bizFormInitData: BizFormData = {
  bizId: 0,
  bizName: "",
  remark: "",

  execType: 1,
  execExtendData: {
    httpCallback: {
      beforeCreate: "",
      beforeRun: "",
      process: "",
      processStop: "",
      beforeCreateTimeout: 5,
      beforeRunTimeout: 60,
      processTimeout: 60,
      processStopTimeout: 60,
      insecureSkipVerify: false,
      headers: [],
      proxy: ""
    }
  },

  status: 0,
  opRemark: ""
};

// 将服务端返回的业务信息转为表单数据
export const BatchJobBizInfoA2BizFormData = (
  formData: BizFormData,
  line: BatchJobBizInfoA
) => {
  Object.assign(formData, <BizFormData>{
    bizId: line.bizId,
    bizName: line.bizName,
    remark: line.remark,

    execType: Number(line.execType ?? 0),
    execExtendData: <BizExecExtendData>{
      httpCallback: <BizExecExtendDataHttpCallback>{
        beforeCreate: line.execExtendData?.httpCallback?.beforeCreate,
        beforeRun: line.execExtendData?.httpCallback?.beforeRun,
        process: line.execExtendData?.httpCallback?.process,
        processStop: line.execExtendData?.httpCallback?.processStop,
        beforeCreateTimeout:
          line.execExtendData?.httpCallback?.beforeCreateTimeout ?? 0,
        beforeRunTimeout:
          line.execExtendData?.httpCallback?.beforeRunTimeout ?? 0,
        processTimeout: line.execExtendData?.httpCallback?.processTimeout ?? 0,
        processStopTimeout:
          line.execExtendData?.httpCallback?.processStopTimeout ?? 0,
        insecureSkipVerify:
          line.execExtendData?.httpCallback?.insecureSkipVerify,
        headers: line.execExtendData?.httpCallback?.headers ?? [],
        proxy: line.execExtendData?.httpCallback?.proxy
      }
    },

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
  bizId: 0,
  jobName: "",
  jobData: "",
  processDataTotal: 0,
  processedCount: 0,
  concType: 0,
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
    bizId: Number(line.bizId),
    jobName: line.jobName,
    jobData: line.jobData,
    processDataTotal: Number(line.processDataTotal),
    processedCount: Number(line.processedCount),
    concType: Number(line.concType ?? 0),
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
  bizId: 0,
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
