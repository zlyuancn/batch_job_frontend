import {
  BatchJobExecType,
  BatchJobQueryBizListRsp,
  BatchJobRateType
} from "@/api/batch_job_client";

// 样例数据
export const mockData: BatchJobQueryBizListRsp = {
  total: 250,
  pageSize: 20,
  line: [
    {
      bizId: 23,
      bizName: "测试名",
      remark: "备注数据",
      execType: 1,
      op: {
        opUserid: "123",
        opUserName: "我是谁",
        opTime: "1759724919"
      }
    }
  ]
};
