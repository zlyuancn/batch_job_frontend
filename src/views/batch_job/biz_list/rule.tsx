import { Columns } from "element-plus";
import { execType2CnName, raceType2CnName } from "../utils/types";
import { useRouter } from "vue-router";

export const columnsRule: Columns<any> = [
  { key: "bizType", dataKey: "bizType", title: "业务类型", width: 100 },
  { key: "bizName", dataKey: "bizName", title: "业务名", width: 200 },
  {
    key: "execType",
    dataKey: "execType",
    title: "执行类型",
    width: 200,
    cellRenderer: ({ cellData: v }) => <span> {execType2CnName[v]} </span>
  },
  {
    key: "rateType",
    dataKey: "rateType",
    title: "限速类型",
    width: 200,
    cellRenderer: ({ cellData: v }) => <span> {raceType2CnName[v]} </span>
  },
  {
    key: "rateSec",
    dataKey: "rateSec",
    title: "每秒限速",
    width: 200,
    cellRenderer: ({ cellData: v }) => <span> {v} /s</span>
  },
  {
    key: "operations",
    title: "Operations",
    cellRenderer: record => {
      const router = useRouter();
      const handleEdit = () => {
        router.push({
          name: "ChangeBiz",
          query: { biz_type: record.rowData.bizType }
        });
      };

      const handleDelete = () => {
        console.info("删除", record.rowData.bizType);
      };

      return (
        <>
          <ElButton size="small" onClick={handleEdit}>
            编辑
          </ElButton>
          <ElButton size="small" onClick={handleDelete} type="danger">
            删除
          </ElButton>
        </>
      );
    },
    width: 150,
    align: "center"
  }
];
