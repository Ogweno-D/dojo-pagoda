import { useFetch } from "../../../hooks/api/useFetch.tsx";
import { useMutate } from "../../../hooks/api/useMutate.tsx";
import React, { useState } from "react";
import { useToast } from "../../../hooks/toast/useToast.tsx";
import type { Subject } from "./Subject.type.ts";
import type { Task } from "../Tasks/Task.type.ts";
import { buildQueryParams } from "../../../utils/queryParams.ts";
import SubjectForm from "../../Forms/SubjectForm.tsx";
import SingleTask from "../Tasks/SingleTask.tsx";
import TaskForm from "../../Forms/TaskForm.tsx";
import {Modal} from "../../Modals/Modal.tsx";

interface SingleSubjectProps {
    subjectId: number;
}

interface SingleSubjectApiResponse {
    subject: Subject;
    message: string;
}

interface TaskApiResponse {
    domain: string;
    current_page: number;
    last_page: number;
    page_size: number;
    records: Task[];
}

function SingleSubject({ subjectId }: SingleSubjectProps) {
    // Pagination for tasks
    const [page] = useState(1);
    const [pageSize] = useState(10);
    const params = { page, page_size: pageSize, subject_id: subjectId };
    const taskUrl = `/api/admin/tasks/${buildQueryParams(params)}`;

    // Hooks
    const showToast = useToast();
    const subjectUrl = `/api/admin/subjects/${subjectId}`;
    const fetchOptions = { headers: { "Content-Type": "application/json" } };

    // Subject Data
    const {
        data: subjectData,
        loading: subjectLoading,
        error: subjectError,
        refetch: subjectRefetch,
    } = useFetch<SingleSubjectApiResponse>(subjectUrl, fetchOptions);

    const subject: Subject | undefined = subjectData?.subject;

    // Task Data
    const {
        data: taskData,
        loading: tasksLoading,
        error: tasksError,
        refetch: refetchTasks,
    } = useFetch<TaskApiResponse>(taskUrl, fetchOptions);

    const tasks: Task[] = taskData?.records ?? [];

    // Mutations
    const { mutate: updateMutate } = useMutate<
        SingleSubjectApiResponse,
        { name: string; description: string }
    >(subjectUrl);

    const { mutate: createMutate } = useMutate<
        SingleSubjectApiResponse,
        { name: string; description: string }
    >("/api/admin/subjects");

    const { mutate: deleteMutate, loading: deleteLoading } = useMutate<any, null>();

    // Modal state
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isTaskCreateOpen, setTaskCreateOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    // Handle delete
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            try {
                await deleteMutate(subjectUrl,"DELETE", null, fetchOptions);

                showToast({
                    variant: "success",
                    title: "Subject deleted successfully",
                    autoClose: 500,
                });

                window.location.href = "/subjects";
            } catch (error) {
                showToast({
                    variant: "error",
                    title: "Delete failed",
                    autoClose: 500,
                });
            }
        }
    };

    // States
    if (subjectLoading) return <p>Loading subject data...</p>;
    if (subjectError) return <p className="error">Error: {String(subjectError)}</p>;
    if (!subject) return <p>No subject found for this ID.</p>;

    return (
        <div className="subject-container">
            <h1 className="subject-title">Subject Details</h1>

            <div className="card">
                <p>
                    <strong>Name:</strong> {subject.name}
                </p>
                <p>
                    <strong>Description:</strong> {subject.description}
                </p>
            </div>

            {/* Actions */}
            <div className="form-actions" style={{ marginTop: "1rem" }}>
                <button className="btn btn-primary" onClick={() => setEditOpen(true)}>
                    Edit Subject
                </button>

                <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                >
                    {deleteLoading ? "Deleting..." : "Delete Subject"}
                </button>
                <button
                    className="btn btn-accent"
                    onClick={() => setTaskCreateOpen(true)}
                >
                    Create Task
                </button>
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setEditOpen(false)}>
                <h2>Edit Subject</h2>
                <SubjectForm
                    initialData={{
                        name: subject.name,
                        description: subject.description,
                    }}
                    submitLabel="Update Subject"
                    onSubmit={async (formData) => {
                        await updateMutate(subjectUrl, "PUT", formData, fetchOptions);
                        await subjectRefetch();
                        showToast({ variant: "success", title: "Subject updated!" });
                        setEditOpen(false);
                    }}
                />
            </Modal>

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
                        showToast({ variant: "success", title: "Subject created!" });
                        setCreateOpen(false);
                    }}
                />
            </Modal>

            {/* Create Task Modal */}
            <Modal isOpen={isTaskCreateOpen} onClose={() => setTaskCreateOpen(false)}>
                <h2>Create Task for {subject.name}</h2>
                <TaskForm
                    initialData={{
                        subject_id: subjectId,
                        title: "",
                        description: "",
                        requirements: "",
                        due_date: "",
                        max_score: 100,
                    }}
                    submitLabel="Create Task"
                    onSubmit={async (formData) => {
                        await createMutate("/api/admin/tasks", "POST", formData, fetchOptions);
                        await refetchTasks(); // refresh task list
                        showToast({ variant: "success", title: "Task created!" });
                        setTaskCreateOpen(false);
                    }}
                />
            </Modal>

            <hr className="divider" />

            {/* Task List */}
            <h2 className="tasks-title">Tasks under this subject</h2>
            {tasksLoading && <p>Loading tasks...</p>}
            {tasksError && (
                <p className="error">Error fetching tasks: {String(tasksError)}</p>
            )}
            {!tasksLoading && tasks.length === 0 && <p>No tasks found for this subject.</p>}

            <ul className="task-list">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className="task-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedTaskId(task.id)}
                    >
                        <strong>{task.title}</strong>
                        <p>{task.description}</p>
                        <small>Status: {task.status}</small>
                    </li>
                ))}
            </ul>

            {/* Task Modal */}
            <Modal isOpen={!!selectedTaskId} onClose={() => setSelectedTaskId(null)}>
                {selectedTaskId && <SingleTask id={selectedTaskId} />}
            </Modal>
        </div>
    );
}

export default SingleSubject;
