import { useState } from "react";
import { useFetch } from "../../../../hooks/api/useFetch.tsx";
import { buildQueryParams } from "../../../../utils/queryParams.ts";
import type { User } from "../User.type.ts";
import {Table} from "../../ReusableTable/Table.tsx";
import {useUserColumns} from "./UserColumns.tsx";
import {UserTableSkeleton} from "./userTableSkeleton.tsx";
import {useNavigate} from "@tanstack/react-router";

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
        <div>
            <h2>Users</h2>
            {/* Filter and Search Controls */}
            <div className="">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select value={roleFilter} onChange={(e) =>  setRoleFilter(e.target.value)}>
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="client">Client</option>
                    <option value="vendor">Vendor</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="deactivated">Deactivated</option>
                </select>
            </div>

            {error && <div className="error">{String(error)}</div>}

            {users.length> 0 ? (
                <>
                    <Table
                        tableId={"usersTable"}
                        data={users}
                        columns={columns}
                        onRowClick={handleRowClick}
                    />

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center my-4">
                    <span>
                        Page{" "}
                        <strong>
                            {data?.current_page ?? 1} of {data?.last_page ?? 1}
                        </strong>{" "}
                        (Total Records: {data?.total_count ?? 0})
                    </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === (data?.last_page ?? 1)}
                            >
                                Next
                            </button>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1); // Reset to page 1 when pageSize changes
                                }}
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                            </select>
                        </div>
                    </div>
                </>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
}

export default UserTable;