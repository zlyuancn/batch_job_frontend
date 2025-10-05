export interface FormData {
  biz_type: number;
  biz_name: string;
  remark: string;

  exec_type: number;
  cb_before_create: string;
  cb_before_run: string;
  cb_process: string;
  cb_process_stop: string;
  cb_before_create_timeout: number;
  cb_before_run_timeout: number;
  cb_process_timeout: number;
  cb_process_stop_timeout: number;

  rate_type: number;
  rate_sec: number;
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
