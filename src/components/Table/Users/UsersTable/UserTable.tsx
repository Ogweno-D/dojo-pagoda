import type { User } from "../User.type.ts";
import {Table} from "../../ReusableTable/Table.tsx";
import {useUserColumns} from "./UserColumns.tsx";
import {UserTableSkeleton} from "./userTableSkeleton.tsx";
import {useNavigate} from "@tanstack/react-router";
import type { UserApiResponse } from "../../../../routes/_protected/users";
import {TableActions} from "../../ReusableTable/TableActions/TableActions.tsx";
import {DataTableProvider} from "../../providers/DataTableProvider.tsx";

export interface UserTableProps {
    loading: boolean;
    error: unknown;
    data: UserApiResponse | undefined;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    roleFilter: string;
    setRoleFilter: (v: string) => void;
    statusFilter: string;
    setStatusFilter: (v: string) => void;
}

function UserTable({loading, error, data,searchQuery,setSearchQuery,roleFilter,setRoleFilter,setStatusFilter,statusFilter}: UserTableProps) {

    const navigate = useNavigate();

    const columns = useUserColumns();

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
                    <div className="form-search">
                        <input
                            type="search"
                            placeholder="Search by name or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search users"
                            style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" }}
                        />
                    </div>

                    <div className="form-filters">
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
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


            {users.length> 0 ? (
                <DataTableProvider<User> data={users}>
                    <div className={"results-table"}>
                        <TableActions
                            columns={columns}
                        />
                        <Table
                            tableId={"usersTable"}
                            columns={columns}
                            onRowClick={handleRowClick}
                        />
                    </div>
                </DataTableProvider>

            ) : (
                <div className={"no-data-error"}>
                    <h2> No users found.</h2>
                </div>
            )}
        </div>
    );
}

export default UserTable;