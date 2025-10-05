import {
  BatchJobExecType,
  BatchJobQueryBizListRsp,
  BatchJobRateType
} from "@/api/batch_job_client";

// 样例数据
export const mockData: BatchJobQueryBizListRsp = {
  total: 250,
  pageSize: 1,
  line: [
    {
      bizType: 1,
      bizName: "测试名",
      remark: "备注数据",
      execType: BatchJobExecType.HttpCallback,
      rateType: BatchJobRateType.RateSec,
      rateSec: 300
    }
  ]
};
