import { createFileRoute } from "@tanstack/react-router";
import TaskTable from "../../../components/Table/Tasks/TasksTable/TaskTable.tsx";
import type { Task } from "../../../components/Table/Tasks/Task.type.ts";
import {buildQueryParams} from "../../../utils/queryParams.ts";
import {useEffect, useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import PaginationWrapper from "../../../components/Table/ReusableTable/TableActions/PaginationWrapper.tsx";

export interface TaskApiResponse {
  domain: string;
  current_page: number;
  last_page: number;
  page_size: number;
  records: Task[];
}

async function getTasks(page: number, pageSize: number): Promise<TaskApiResponse> {
  const params = { page, page_size: pageSize };
  const token = import.meta.env.VITE_ADMIN_BEARER_TOKEN;
  const url = `api/admin/tasks${buildQueryParams(params)}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });
  if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`);

  return res.json();

}


export const Route = createFileRoute("/_protected/tasks/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
      <TaskTableWrapper />
  );
}
function TaskTableWrapper() {
  // const { page, pageSize, setData } = useDataTable<Task>();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const queryClient = useQueryClient();

  const {data, isLoading, isError, error, isFetching}  = useQuery<TaskApiResponse>({
    queryKey: ['tasks', page, pageSize],
    queryFn: () => getTasks(page, pageSize),
  })

  useEffect(() => {
    if (data?.current_page && data?.current_page < (data?.last_page ?? 0)) {
      const nextPage = data.current_page + 1;
      queryClient.prefetchQuery({
        queryKey: ["tasks", nextPage, pageSize],
        queryFn: () => getTasks(nextPage, pageSize),
      });
    }
  }, [data, pageSize, queryClient]);

  // const tasks: Task[] = data?.records ?? [];

  return (
      <>
        <TaskTable loading={isLoading} error={isError? error : null } data={data} />
        {data && (
            <PaginationWrapper
                currentPage={data.current_page}
                lastPage={data.last_page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                isFetching={isFetching}
            />
        )}
      </>
  );
}
