import { Columns } from "element-plus";
import { JobStatus2CnName, raceType2CnName } from "../utils/types";
import { useRouter } from "vue-router";
import { formatTimestamp } from "@/views/batch_job/utils/time";

import { bizNameMap } from "@/views/batch_job/utils/data";

import iconView from "~icons/ep/view";
import iconEdit from "~icons/ep/edit";
import iconVideoPlay from "~icons/ep/video-play";
import iconVideoPause from "~icons/ep/video-pause";

export const columnsRule: Columns<any> = [
  { key: "jobId", dataKey: "jobId", title: "任务id", width: 100 },
  {
    key: "bizType",
    title: "业务",
    width: 200,
    cellRenderer: v => {
      return (
        <span>
          {"(" +
            String(v?.rowData?.bizType) +
            ") " +
            bizNameMap[v?.rowData?.bizType]}
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
      const router = useRouter();
      const handleView = () => {
        // router.push({
        //   name: "BizInfo",
        //   query: { bizType: v.rowData.bizType }
        // });
      };

      const handleEdit = () => {
        router.push({
          name: "ChangeJob",
          query: { jobId: v.rowData.jobId }
        });
      };

      const handleStart = () => {};
      const handleStop = () => {};

      const status = v.rowData.status ?? 0;
      const allowEdit = status == 0 || status == 5;
      const allowStop = status == 1 || status == 2;
      const allowRun = status == 0 || status == 5;

      return (
        <>
          <el-button
            size="small"
            onClick={handleView}
            type="primary"
            icon={iconView}
          >
            查看
          </el-button>
          {allowRun && (
            <el-button
              size="small"
              onClick={handleStart}
              type="success"
              icon={iconVideoPlay}
            >
              运行
            </el-button>
          )}
          {allowStop && (
            <el-button
              size="small"
              onClick={handleStop}
              type="danger"
              icon={iconVideoPause}
            >
              停止
            </el-button>
          )}
          {allowEdit && (
            <el-button size="small" onClick={handleEdit} icon={iconEdit}>
              编辑
            </el-button>
          )}
        </>
      );
    },
    width: 200,
    align: "center"
  }
];
