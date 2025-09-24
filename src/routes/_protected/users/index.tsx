import { createFileRoute } from "@tanstack/react-router";
import UserTable from "../../../components/Table/Users/UsersTable/UserTable.tsx";
import type { User } from "../../../components/Table/Users/User.type";
import { buildQueryParams } from "../../../utils/queryParams";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PaginationWrapper from "../../../components/Table/ReusableTable/TableActions/PaginationWrapper.tsx";

export interface UserApiResponse {
  records: User[];
  domain: string;
  current_page: number;
  total_count: number;
  last_page: number;
  page_size: number;
}

async function getUsers(params: {
  page: number;
  page_size: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<UserApiResponse> {
  const token = import.meta.env.VITE_ADMIN_BEARER_TOKEN;
  const url = `/api/admin/users${buildQueryParams(params)}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
}

export const Route = createFileRoute("/_protected/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserTableWrapper />;
}

function UserTableWrapper() {
  const queryClient = useQueryClient();

  // Table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data, isLoading, isError, error, isFetching } = useQuery<UserApiResponse>({
    queryKey: ["users", page, pageSize, debouncedSearch, roleFilter, statusFilter],
    queryFn: () =>
        getUsers({
          page,
          page_size: pageSize,
          search: debouncedSearch || undefined,
          role: roleFilter || undefined,
          status: statusFilter || undefined,
        }),
  });

  // Prefetch next page
  useEffect(() => {
    if (data?.current_page && data?.current_page < (data?.last_page ?? 0)) {
      const nextPage = data.current_page + 1;
      queryClient.prefetchQuery({
        queryKey: ["users", nextPage, pageSize, debouncedSearch, roleFilter, statusFilter],
        queryFn: () =>
            getUsers({
              page: nextPage,
              page_size: pageSize,
              search: debouncedSearch || undefined,
              role: roleFilter || undefined,
              status: statusFilter || undefined,
            }),
      });
    }
  }, [data, pageSize, debouncedSearch, roleFilter, statusFilter, queryClient]);

  return (
      <>
        <UserTable
            loading={isLoading}
            error={isError ? error : null}
            data={data}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
        />

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

   )
}
