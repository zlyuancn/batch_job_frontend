import { Columns } from "element-plus";
import { JobStatus2CnName, raceType2CnName } from "../utils/types";
import { formatTimestamp } from "@/views/batch_job/utils/time";

import { bizNameMap } from "@/views/batch_job/utils/data";

import { h, ref } from "vue";
import OptionButton from "./OptionButton.vue";

export const columnsRule: Columns<any> = [
  { key: "jobId", dataKey: "jobId", title: "任务id", width: 100 },
  {
    key: "bizId",
    title: "业务",
    width: 200,
    cellRenderer: v => {
      return (
        <span>
          {"(" +
            String(v?.rowData?.bizId) +
            ") " +
            bizNameMap[v?.rowData?.bizId]}
        </span>
      );
    }
  },
  {
    key: "processDataTotal",
    dataKey: "processDataTotal",
    title: "数据总数",
    width: 100
  },
  {
    key: "progress",
    title: "已处理数据量",
    width: 300,
    cellRenderer: v => {
      let p = 0;
      if (v?.rowData?.processDataTotal > 0) {
        p = Math.floor(
          ((v?.rowData?.processedCount ?? 0) * 100) /
            v?.rowData?.processDataTotal
        );
      }
      if (p > 100) p = 100;
      return (
        <div class="flex items-center gap-2">
          <el-Progress percentage={p} style={"width: 300px"} />
        </div>
      );
    }
  },
  { key: "errLogNum", dataKey: "errLogNum", title: "错误日志数", width: 100 },
  {
    key: "rateType",
    dataKey: "rateType",
    title: "限速类型",
    width: 100,
    cellRenderer: ({ cellData: v }) => <span> {raceType2CnName[v ?? 0]} </span>
  },
  {
    key: "rateSec",
    dataKey: "rateSec",
    title: "每秒限速",
    width: 100,
    cellRenderer: ({ cellData: v }) => <span> {v} /s</span>
  },
  {
    key: "status",
    title: "任务状态",
    width: 150,
    cellRenderer: v => (
      <span>
        {JobStatus2CnName[v?.rowData?.status ?? 0]} <br /> (
        {v?.rowData?.statusInfo}){" "}
      </span>
    )
  },
  {
    key: "createTime",
    dataKey: "createTime",
    title: "创建时间",
    width: 150,
    cellRenderer: ({ cellData: v }) => <span>{formatTimestamp(v)}</span>
  },
  {
    key: "opTime",
    title: "更新时间",
    width: 150,
    cellRenderer: v => <span>{formatTimestamp(v?.rowData?.op?.opTime)}</span>
  },
  {
    key: "opUser",
    title: "操作用户",
    width: 150,
    cellRenderer: v => (
      <span>
        {v?.rowData?.op?.opUserid} ({v?.rowData?.op?.opUserName})
      </span>
    )
  },
  { key: "opRemark", dataKey: "op.opRemark", title: "操作描述", width: 200 },
  {
    key: "operations",
    title: "",
    cellRenderer: v => {
      // return h(OptionButton, v.rowData)
      const updateStatus = status => {
        v.rowData.status = status;
      };
      return h(OptionButton, {
        jobId: String(v.rowData.jobId),
        status: v.rowData.status ?? 0,
        updateStatus: updateStatus
      });
    },
    width: 300,
    align: "left"
  }
];
