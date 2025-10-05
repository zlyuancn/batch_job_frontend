import { BatchJobRateType } from "@/api/batch_job";

export const execType2CnName = {
  None: "None",
  HttpCallback: "http回调"
};

export const raceType2CnName = {
  RateSec: "标准限速",
  Serialization: "串行化限速"
};
