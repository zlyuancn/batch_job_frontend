import { BatchJobQueryJobListRsp } from "@/api/batch_job_client";

// 样例数据
export const mockData: BatchJobQueryJobListRsp = {
  total: 250,
  pageSize: 20,
  line: [
    {
      jobId: "12",
      processDataTotal: "1000",
      processedNum: "300",
      errLogNum: "12",

      status: 2,
      createTime: "1759724919",

      rateType: 1,
      rateSec: 300,

      statusInfo: "user op",

      op: {
        opUserid: "123",
        opUserName: "我是谁",
        opTime: "1759724919",
        opRemark: "操作描述"
      }
    }
  ]
};
