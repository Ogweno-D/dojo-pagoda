import { useState } from "react";
import { useFetch } from "../../../../hooks/api/useFetch.tsx";
import { buildQueryParams } from "../../../../utils/queryParams.ts";
import type { User } from "../User.type.ts";
import {Table} from "../../ReusableTable/Table.tsx";
import {useUserColumns} from "./UserColumns.tsx";
import {UserTableSkeleton} from "./userTableSkeleton.tsx";
import {useNavigate} from "@tanstack/react-router";
import PaginationWrapper from "../../ReusableTable/TableActions/PaginationWrapper.tsx";

interface UserApiResponse {
    records: User[];
    domain: string;
    current_page: number;
    total_count: number;
    last_page: number;
}

function UserTable() {

    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const columns = useUserColumns();
    const params = {
        page,
        pageSize,
        search: searchQuery,
        role: roleFilter,
        status: statusFilter,
    };


    const url = `/api/admin/users/${buildQueryParams(params)}`;

    const fetchOptions = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const { data, loading, error } = useFetch<UserApiResponse>(
        url,
        fetchOptions
    );

    const users: User[] = data?.records ?? [];

    if (loading) {
        return <UserTableSkeleton rows={8} columns={5} />;
    }

    if (error) {
        return <p className="error">Error: {String(error)}</p>;
    }



    // Handle a whole row click
    const handleRowClick = (row: User) => {
        const encodedId = btoa(row.id);
        navigate({
            to: "/users/$userId",
            params: {userId: encodedId}
        })
    }


    return (
        <div className={"users-container"}>
            <div>
                <h1>Users</h1>
                {/* Filter and Search Controls */}
                <div className="form-controls">
                    <div className={"form-search"}>
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={"form-filters"}>
                        <select value={roleFilter} onChange={(e) =>  setRoleFilter(e.target.value)}>
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="trainee">Trainee</option>
                        </select>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                </div>
            </div>

            {error && <div className="error">{String(error)}</div>}

            {users.length> 0 ? (
                <div className={"results-table"}>
                    <Table
                        tableId={"usersTable"}
                        data={users}
                        columns={columns}
                        onRowClick={handleRowClick}
                    />

                    {/* Pagination Controls */}
                    <PaginationWrapper page={page} onClick={() => setPage(page - 1)} data={data}
                                       onClick1={() => setPage(page + 1)} value={pageSize} onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                    }}/>
                </div>
            ) : (
                <div className={"no-data-error"}>
                    <h2> No users found.</h2>
                </div>
            )}
        </div>
    );
}

export default UserTable;