// 开始
import {
  BatchJobAdminStartJobReq,
  BatchJobAdminStopJobReq
} from "@/api/batch_job";
import { OpSource } from "@/views/batch_job/utils/types";
import { getToken } from "@/utils/auth";
import { batchJobClient } from "@/api/batch_job_client";

const user = getToken();
export async function startBtn(jobId: string) {
  const req = <BatchJobAdminStartJobReq>{
    jobId: jobId,
    op: {
      opSource: OpSource.Web,
      opUserid: user.username,
      opUserName: user.nickname,
      opRemark: ""
    }
  };
  return batchJobClient.batchJobServiceAdminStartJob(req);
}
// 停止
export async function stopBtn(jobId: string) {
  const req = <BatchJobAdminStopJobReq>{
    jobId: jobId,
    op: {
      opSource: OpSource.Web,
      opUserid: user.username,
      opUserName: user.nickname,
      opRemark: ""
    }
  };
  return batchJobClient.batchJobServiceAdminStopJob(req);
}
