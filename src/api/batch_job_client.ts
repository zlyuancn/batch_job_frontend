import { BatchJobServiceApi } from "./batch_job";
import { http } from "@/utils/http";

export * from "./batch_job/models";
export const batchJobClient = new BatchJobServiceApi(
  null,
  import.meta.env.VITE_SERVER_BATCH_JOB,
  http.getAxiosInstance()
);
