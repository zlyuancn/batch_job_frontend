// 执行类型转中文名
export const execType2CnName = {
  0: "None",
  1: "http回调"
};

// 限速类型转中文名
export const raceType2CnName = {
  0: "标准限速",
  1: "串行化限速"
};

// 任务状态类型转中文名
export const JobStatus2CnName = {
  0: "已创建",
  1: "等待业务主动启动",
  2: "运行中",
  3: "已完成",
  4: "正在停止",
  5: "已停止"
};

// 操作来源
export enum OpSource {
  Web = "Web"
}

// 业务表单类型
export interface BizFormData {
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

  status: number;
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

export const statusOptions = [
  {
    value: 0,
    label: "正常"
  },
  {
    value: 1,
    label: "隐藏",
    desc: "业务一旦创建后就不应该被删除. 长期不用的业务可以将其隐藏"
  }
];
