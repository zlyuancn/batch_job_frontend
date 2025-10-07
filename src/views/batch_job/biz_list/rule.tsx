import { Columns } from "element-plus";
import { execType2CnName } from "../utils/types";
import { useRouter } from "vue-router";
import { formatTimestamp } from "@/views/batch_job/utils/time";

export const columnsRule: Columns<any> = [
  { key: "bizType", dataKey: "bizType", title: "业务类型", width: 100 },
  { key: "bizName", dataKey: "bizName", title: "业务名", width: 300 },
  {
    key: "execType",
    dataKey: "execType",
    title: "执行类型",
    width: 100,
    cellRenderer: ({ cellData: v }) => <span> {execType2CnName[v]} </span>
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
    key: "opTime",
    title: "更新时间",
    width: 150,
    cellRenderer: v => <span>{formatTimestamp(v?.rowData?.op?.opTime)}</span>
  },
  {
    key: "operations",
    title: "",
    cellRenderer: v => {
      const router = useRouter();
      const handleJobList = () => {
        router.push({
          name: "JobList",
          query: { bizType: v.rowData.bizType }
        });
      };

      const handleView = () => {
        router.push({
          name: "BizInfo",
          query: { bizType: v.rowData.bizType }
        });
      };

      const handleEdit = () => {
        router.push({
          name: "ChangeBiz",
          query: { bizType: v.rowData.bizType }
        });
      };

      return (
        <>
          <el-button size="small" onClick={handleJobList} type="success">
            任务列表
          </el-button>
          <el-button size="small" onClick={handleView}>
            查看
          </el-button>
          <el-button size="small" onClick={handleEdit}>
            编辑
          </el-button>
        </>
      );
    },
    width: 200,
    align: "center"
  }
];
