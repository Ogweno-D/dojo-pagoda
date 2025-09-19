import React, { useState } from "react";
import { useFetch } from "../../../../hooks/api/useFetch.tsx";
import { buildQueryParams } from "../../../../utils/queryParams.ts";
import type { Subject } from "../Subject.type.ts";
import {Table} from "../../ReusableTable/Table.tsx";
import {useNavigate} from "@tanstack/react-router";
import {useSubjectColumns} from "./SubjectColumns.tsx";
import {UserTableSkeleton} from "../../Users/UsersTable/userTableSkeleton.tsx";
import {Modal} from "../../../Modals/Modal.tsx";
import SubjectForm from "../../../Forms/SubjectForm.tsx";
import {useMutate} from "../../../../hooks/api/useMutate.tsx";

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

    const [isCreateOpen, setCreateOpen] = useState(false);

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
        },
    };

    const { data, loading, error , refetch: refetchSubjects} = useFetch<SubjectApiResponse>(
        url,
        fetchOptions
    );

    const subjects: Subject[] = data?.records ?? [];

    // Mutation
    const { mutate: createMutate } = useMutate<
        SingleSubjectApiResponse,
        { name: string; description: string }
    >("/api/admin/subjects");

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
        <div className={"subject-container"}>
            <div className={"subject-container-header"}>
                <div>
                    <h2>Subjects</h2>
                </div>

                <div className={""}>
                    <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
                        Create New Subject
                    </button>
                </div>
            </div>

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
                    <div className={"table-footer"}>
                        <div className="table-pagination">
                            <div>
                                <button
                                    className={`pagination-btn ${page === 1 ? "disabled" : ""}`}
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                                <span style={{ marginLeft: "5px" }}>
                                 Page{" "}
                                    <strong>
                                    {data?.current_page ?? 1} of {data?.last_page ?? 1}
                                    </strong>{" "}
                                    {/*(Total Records: {data?.total_count ?? 0})*/}
                                 </span>
                                <button
                                    className={`pagination-btn ${page === (data?.last_page ?? 1) ? "disabled" : ""}`}
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === (data?.last_page ?? 1)}
                                >
                                    Next
                                </button>
                            </div>

                            <div>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setPage(1);
                                    }}
                                >
                                    <option value={5}>5 per page</option>
                                    <option value={10}>10 per page</option>
                                    <option value={20}>20 per page</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* Create Modal */}
                    <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)}>
                        <h2>Create Subject</h2>
                        <SubjectForm
                            submitLabel="Create Subject"
                            onSubmit={async (formData) => {
                                await createMutate(
                                    "/api/admin/subjects",
                                    "POST",
                                    formData,
                                    fetchOptions
                                );
                                setCreateOpen(false);
                                showToast({ variant: "success", title: "Subject created!" });
                            }}
                            refetch={refetchSubjects}
                        />
                    </Modal>

                </>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
}

export default SubjectTable;