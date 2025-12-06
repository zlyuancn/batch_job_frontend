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
      let status = undefined;
      switch (v?.rowData?.status ?? 0) {
        case 3:
          status = "success";
          break;
        case 1:
        case 4:
        case 5:
          status = "warning";
          break;
      }
      return (
        <div class="flex items-center gap-2">
          <el-Progress
            stroke-width={10}
            status={status}
            percentage={p}
            style={"width: 300px"}
          />
        </div>
      );
    }
  },
  {
    key: "processDataTotal",
    title: "数据量",
    width: 150,
    cellRenderer: v => {
      if (v?.rowData?.status == 3) {
        if (v?.rowData?.processedCount == v?.rowData?.processDataTotal) {
          return (
            <span style="color: darkgreen; font-weight: bold;">
              {v?.rowData?.processDataTotal}
            </span>
          );
        } else {
          return (
            <span style="color: #f17619; font-weight: bold;">
              {v?.rowData?.processedCount ?? 0} / {v?.rowData?.processDataTotal}
            </span>
          );
        }
      }
      return (
        <span style="font-weight: bold;">
          {v?.rowData?.processedCount ?? 0} / {v?.rowData?.processDataTotal}
        </span>
      );
    }
  },
  {
    key: "errLogCount",
    dataKey: "errLogCount",
    title: "错误日志数",
    width: 100
  },
  {
    key: "concType",
    dataKey: "concType",
    title: "并发类型",
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
    cellRenderer: v => {
      let style = "font-weight: bold;";
      switch (v?.rowData?.status ?? 0) {
        case 3:
          style = "color: darkgreen; font-weight: bold;";
          break;
        case 1:
        case 4:
        case 5:
          style = "color: #f17619; font-weight: bold;";
          break;
      }
      return (
        <div>
          <span style={style}>{JobStatus2CnName[v?.rowData?.status ?? 0]}</span>
          <br />
          <span>{v?.rowData?.statusInfo}</span>
        </div>
      );
    }
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
