import { Columns } from "element-plus";
import { execType2CnName, raceType2CnName } from "../utils/types";
import { useRouter } from "vue-router";
import { formatTimestamp } from "@/views/batch_job/utils/time";

export const columnsRule: Columns<any> = [
  { key: "bizType", dataKey: "bizType", title: "业务类型", width: 100 },
  { key: "bizName", dataKey: "bizName", title: "业务名", width: 200 },
  {
    key: "execType",
    dataKey: "execType",
    title: "执行类型",
    width: 100,
    cellRenderer: ({ cellData: v }) => <span> {execType2CnName[v]} </span>
  },
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
    key: "opUser",
    title: "操作用户",
    width: 150,
    cellRenderer: v => (
      <span>
        {v?.rowData?.op?.opUserid} ({v?.rowData?.op?.opUserName})
      </span>
    )
  },
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
      const handleEdit = () => {
        router.push({
          name: "ChangeBiz",
          query: { bizType: v.rowData.bizType }
        });
      };

      const handleDelete = () => {
        console.info("删除", v.rowData.bizType);
      };

      return (
        <>
          <el-button size="small" onClick={handleEdit}>
            编辑
          </el-button>
          <el-button size="small" onClick={handleDelete} type="danger">
            删除
          </el-button>
        </>
      );
    },
    width: 150,
    align: "center"
  }
];
