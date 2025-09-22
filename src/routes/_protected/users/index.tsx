import { createFileRoute } from '@tanstack/react-router'
import UserTable from "../../../components/Table/Users/UsersTable/UserTable.tsx";
import type {User} from "../../../components/Table/Users/User.type.ts";
import {DataTableProvider, useDataTable} from "../../../components/Table/providers/DataTableProvider.tsx";
import {buildQueryParams} from "../../../utils/queryParams.ts";
import {useFetch} from "../../../hooks/api/useFetch.tsx";
import {useEffect, useState} from "react";
import PaginationWrapper from "../../../components/Table/ReusableTable/TableActions/PaginationWrapper.tsx";

export interface UserApiResponse {
  records: User[];
  domain: string;
  current_page: number;
  total_count: number;
  last_page: number;
  page_size: number;
}

export const Route = createFileRoute('/_protected/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <DataTableProvider<User>
          data={[]}
          initialState={{filters:[], sorts: [], page:1, pageSize:5}}
        >

      <UserTableWrapper />
    </DataTableProvider>
  );
}

function UserTableWrapper() {
  const {page, pageSize, setData,setPage} = useDataTable<User>()
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);

  //Debounce the input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 1000);
    return ()=> clearTimeout(t);
  }, [searchQuery]);

  //Decounced search
  useEffect(()=>{
    setPage(1);
  },[debouncedSearch,setPage])


  const params = {
    page,
    page_size: pageSize,
    ...(debouncedSearch ? { search:debouncedSearch } :{}),
    role: roleFilter,
    status: statusFilter,
  }
  const url = `/api/admin/users/${buildQueryParams(params)}`;

  const { data, loading, error } = useFetch<UserApiResponse>(url,{
    headers: { "Content-Type": "application/json" },
  });

  const users: User[] = data?.records ?? [];

  useEffect(() => {
    setData(users)
  }, [users, setData]);

  return(
      <>
        <UserTable
            loading={loading}
            error={error}
            data={data}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}

        />
        <PaginationWrapper data={data} />
        </>
  );
}
