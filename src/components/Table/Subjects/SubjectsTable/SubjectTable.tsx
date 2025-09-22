import  { useState } from "react";
import type { Subject } from "../Subject.type.ts";
import {Table} from "../../ReusableTable/Table.tsx";
import {useNavigate} from "@tanstack/react-router";
import {useSubjectColumns} from "./SubjectColumns.tsx";
import {UserTableSkeleton} from "../../Users/UsersTable/userTableSkeleton.tsx";
import {Modal} from "../../../Modals/Modal.tsx";
import SubjectForm from "../../../Forms/SubjectForm.tsx";
import {useMutate} from "../../../../hooks/api/useMutate.tsx";
import {useToast} from "../../../../hooks/toast/useToast.tsx";
import type {SingleSubjectApiResponse} from "../SingleSubject.tsx";
import {FilterManager} from "../../ReusableTable/TableActions/FilterManager.tsx";
import { SortManager } from "../../ReusableTable/TableActions/SortManager.tsx";
import type {SubjectApiResponse} from "../../../../routes/_protected/subjects";

interface SubjectTableProps {
    loading: boolean;
    error: unknown;
    data: SubjectApiResponse | null;
}

function SubjectTable({loading, error, data}: SubjectTableProps) {

    const navigate = useNavigate();
    const showToast = useToast();

    const columns = useSubjectColumns();

    const [isCreateOpen, setCreateOpen] = useState(false);



    const subjects: Subject[] = data?.records ?? [];

    // Mutation
    const { mutate: createMutate } = useMutate<
        SingleSubjectApiResponse,
        { name: string; description: string }
    >();

    if (loading) {
        return <UserTableSkeleton rows={8} columns={5} />;
    }

    if (error) {
        return <p className="error">Error: {String(error)}</p>;
    }


    // Handle a whole row click
    const handleRowClick = (row: Subject) => {
        const encodedId = btoa(String(row.id));
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

            {subjects.length> 0 ? (
                <>
                    <div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <FilterManager columns={columns}/>
                            <SortManager columns={columns}/>
                        </div>
                        <Table
                            tableId="usersTable"
                            columns={columns}
                            onRowClick={handleRowClick}
                        />
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
                                );
                                setCreateOpen(false);
                                showToast({
                                    variant: "success",
                                    message: "Subject Created Successfully",
                                    autoClose: 500
                                });
                            }}
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