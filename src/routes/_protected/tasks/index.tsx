import { createFileRoute } from "@tanstack/react-router";
import TaskTable from "../../../components/Table/Tasks/TasksTable/TaskTable.tsx";
import { DataTableProvider, useDataTable } from "../../../components/Table/providers/DataTableProvider.tsx";
import type { Task } from "../../../components/Table/Tasks/Task.type.ts";
import {buildQueryParams} from "../../../utils/queryParams.ts";
import {useFetch} from "../../../hooks/api/useFetch.tsx";
import PaginationWrapper from "../../../components/Table/ReusableTable/TableActions/PaginationWrapper.tsx";
import {useEffect} from "react";

export interface TaskApiResponse {
  domain: string;
  current_page: number;
  last_page: number;
  page_size: number;
  records: Task[];
}

export const Route = createFileRoute("/_protected/tasks/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
      <DataTableProvider<Task>
          data={[]}
          initialState={{ filters: [], sorts: [], page: 1, pageSize: 5 }}
      >
        <TaskTableWrapper />
      </DataTableProvider>
  );
}
function TaskTableWrapper() {
  const { page, pageSize, setData } = useDataTable<Task>();

  const params = { page, page_size: pageSize };
  const url = `/api/admin/tasks${buildQueryParams(params)}`;

  const { data, loading, error } = useFetch<TaskApiResponse>(url, {
    headers: { "Content-Type": "application/json" },
  });

  const tasks: Task[] = data?.records ?? [];

  // Update provider data when API returns
  useEffect(() => {
    setData(tasks);
  }, [tasks, setData]);

  return (
      <>
        <TaskTable loading={loading} error={error} data={data} />
        <PaginationWrapper data={data} />
      </>
  );
}
