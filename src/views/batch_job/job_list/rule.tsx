import { Columns } from "element-plus";
import { JobStatus2CnName, raceType2CnName } from "../utils/types";
import { useRouter } from "vue-router";
import { formatTimestamp } from "@/views/batch_job/utils/time";

import { ElProgress } from "element-plus";

export const columnsRule: Columns<any> = [
  { key: "jobId", dataKey: "jobId", title: "任务id", width: 100 },
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
    // v?.rowData?.processedNum
    cellRenderer: v => {
      return (
        <div class="flex items-center gap-2">
          <el-Progress percentage={100} style={"width: 300px"} />
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
    cellRenderer: ({ cellData: v }) => <span> {raceType2CnName[v]} </span>
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
        {JobStatus2CnName[v?.rowData?.status]} ({v?.rowData?.statusInfo}){" "}
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
  { key: "opRemark", dataKey: "op.opRemark", title: "操作描述", width: 300 },
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
        // router.push({
        //   name: "ChangeBiz",
        //   query: { bizType: v.rowData.bizType }
        // });
      };

      return (
        <>
          <el-button size="small" onClick={handleView} type="primary">
            查看
          </el-button>
          <el-button size="small" onClick={handleEdit}>
            编辑
          </el-button>
          {/*<el-button size="small" onClick={handleDelete} type="danger">删除</el-button>*/}
        </>
      );
    },
    width: 200,
    align: "center"
  }
];
