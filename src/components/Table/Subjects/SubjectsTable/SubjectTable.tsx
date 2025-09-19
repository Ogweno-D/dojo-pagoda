import { useState } from "react";
import { useFetch } from "../../../../hooks/api/useFetch.tsx";
import { buildQueryParams } from "../../../../utils/queryParams.ts";
import type { Subject } from "../Subject.type.ts";
import {Table} from "../../ReusableTable/Table.tsx";
import {useNavigate} from "@tanstack/react-router";
import {useSubjectColumns} from "./SubjectColumns.tsx";
import {UserTableSkeleton} from "../../Users/UsersTable/userTableSkeleton.tsx";

interface SubjectApiResponse {
    records: Subject[];
    domain: string;
    current_page: number;
    total_count: number;
    last_page: number;
}

function SubjectTable() {

    const navigate = useNavigate();


    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const columns = useSubjectColumns();

    // Params
    const params = {
        page,
        pageSize,
        search: searchQuery,
        role: roleFilter,
        status: statusFilter,
    };

    const url = `/api/admin/subjects/${buildQueryParams(params)}`;

    const fetchOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };

    const { data, loading, error } = useFetch<SubjectApiResponse>(
        url,
        fetchOptions
    );

    const subjects: Subject[] = data?.records ?? [];

    if (loading) {
        return <UserTableSkeleton rows={8} columns={5} />;
    }

    if (error) {
        return <p className="error">Error: {String(error)}</p>;
    }



    // Handle a whole row click
    const handleRowClick = (row: Subject) => {
        const encodedId = btoa(row.id);
        navigate({
            to: "/subjects/$subjectId",
            params: {subjectId: encodedId}
        })
    }


    return (
        <div>
            <h2>Subjects</h2>

            {error && <div className="error">{String(error)}</div>}

            {subjects.length> 0 ? (
                <>
                    <Table
                        tableId={"usersTable"}
                        data={subjects}
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

export default SubjectTable;