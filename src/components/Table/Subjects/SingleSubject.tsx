import { useFetch } from "../../../hooks/api/useFetch.tsx";
import { useMutate } from "../../../hooks/api/useMutate.tsx";
import React, { useEffect, useState } from "react";
import { useToast } from "../../../hooks/toast/useToast.tsx";
import type { Subject } from "./Subject.type.ts";
import type {Task} from "../Tasks/Task.type.ts";
import {useUserColumns} from "../Users/UsersTable/UserColumns.tsx";
import {buildQueryParams} from "../../../utils/queryParams.ts";

interface SingleSubjectProps {
    subjectId: number;
}

interface SingleSubjectApiResponse {
    subject: Subject;
    message: string;
}

interface TaskApiResponse {
    domain:string;
    current_page:number;
    last_page:number;
    page_size:number;
    records: Task[];
}

function SingleSubject({ subjectId }: SingleSubjectProps) {

    //Build up the url for the task
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const params = {
        page,
        page_size: pageSize,
        subject_id: subjectId,
    };

    const taskUrl= `/api/admin/tasks/${buildQueryParams(params)}`

    // Hooks
    const showToast = useToast();


    const subjectUrl = `/api/admin/subjects/${subjectId}`;

    // const updateSubject = `/api/admin/subjects/${subjectId}`;

    const fetchOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };

    //Subject Data
    const {
        data:subjectData,
        loading:subjectLoading,
        error:subjectError,
        refetch:subjectRefetch,
    } = useFetch<SingleSubjectApiResponse>(subjectUrl, fetchOptions);

    const subject: Subject | undefined = subjectData?.subject;

    //TaskData
    const {
        data: taskData,
        loading: tasksLoading,
        error: tasksError,
        refetch: refetchTasks,
    } = useFetch<TaskApiResponse>(taskUrl, fetchOptions);

    const tasks: Task |undefined = taskData?.records ?? [];

    // Mutations
    const {
        mutate: updateMutate,
        loading: updateLoading,
        error: updateError,
    } = useMutate<SingleSubjectApiResponse, { name: string; description: string }>(
        subjectUrl
    );

    const {
        mutate: deleteMutate,
        loading: deleteLoading,
        error: deleteError,
    } = useMutate<any, null>(subjectUrl);

    // Form state
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    // Populate form when subject data loads
    useEffect(() => {
        if (subject) {
            setName(subject.name);
            setDescription(subject.description);
        }
    }, [subject]);

    // Handle update
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (updateLoading) return;

        try {
            await updateMutate(url, "PUT", { name, description }, fetchOptions);

            await subjectRefetch();

            showToast({
                variant: "success",
                title: "Subject updated successfully",
                autoClose: 500,
            });
        } catch (error) {
            showToast({
                variant: "error",
                title: "Error updating the subject",
                autoClose: 500,
            });
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            try {
                await deleteMutate("DELETE", null, fetchOptions);

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
    if (subjectError) return <p className="error">Error: {String(error)}</p>;
    if (!subject) return <p>No subject found for this ID.</p>;

    // Render
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

            <hr className="divider" />

            <form onSubmit={handleUpdate} className="card form">
                <h2 className="form-title">Update Subject</h2>

                <div className="form-group">
                    <label>Subject Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={updateLoading}
                    >
                        {updateLoading ? "Updating..." : "Update Subject"}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="btn btn-danger"
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? "Deleting..." : "Delete Subject"}
                    </button>
                </div>
            </form>

            {updateError && (
                <p className="error-text">Update failed: {String(updateError)}</p>
            )}
            {deleteError && (
                <p className="error-text">Delete failed: {String(deleteError)}</p>
            )}

        {/*    Task List*/}
            <hr className="divider" />

            <h2 className="tasks-title">Tasks under this subject</h2>
            {tasksLoading && <p>Loading tasks...</p>}
            {tasksError && <p className="error">Error fetching tasks: {String(tasksError)}</p>}
            {!tasksLoading && tasks.length === 0 && <p>No tasks found for this subject.</p>}

            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id} className="task-item">
                        <strong>{task.title}</strong>
                        <p>{task.description}</p>
                        <small>Status: {task.status}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SingleSubject;
