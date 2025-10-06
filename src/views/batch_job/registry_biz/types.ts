export interface FormData {
  bizType: number;
  bizName: string;
  remark: string;

  execType: number;
  cbBeforeCreate: string;
  cbBeforeRun: string;
  cbProcess: string;
  cbProcessStop: string;
  cbBeforeCreateTimeout: number;
  cbBeforeRunTimeout: number;
  cbProcessTimeout: number;
  cbProcessStopTimeout: number;

  rateType: number;
  rateSec: number;

  opRemark?: string;
}

export const execTypeOptions = [
  {
    value: 1,
    label: "http回调"
  }
];

export const rateTypeOptions = [
  {
    value: 0,
    label: "标准限速"
  },
  {
    value: 1,
    label: "串行化限速",
    desc: "使用串行化限速时, 只有1个线程处理数据, 数据按顺序有序处理"
  }
];
