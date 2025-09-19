import type { Task } from "./Task.type.ts";
import { useToast } from "../../../hooks/toast/useToast.tsx";
import { useFetch } from "../../../hooks/api/useFetch.tsx";
import { useNavigate } from "@tanstack/react-router";
import { useMutate } from "../../../hooks/api/useMutate.tsx";
import{ useState } from "react";
import { Modal } from "../../Modals/Modal.tsx";
import TaskForm from "../../Forms/TaskForm.tsx";
import "./task.css";
import Spinner from "../../Spinner/Spinner.tsx";

interface SingleTaskProp {
    id: number;
}

interface SingleTaskApiResponse {
    task: Task;
    message: string;
}

function SingleTask({ id }: SingleTaskProp) {
    const showToast = useToast();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const url = `/api/admin/tasks/${id}`;
    const fetchOptions = {
        headers: { "Content-Type": "application/json" },
    };

    // Fetch task
    const { data, loading, error, refetch } = useFetch<SingleTaskApiResponse>(
        url,
        fetchOptions
    );
    const task: Task | undefined = data?.task;

    // Mutations (update & delete)
    const { mutate, loading: mutateLoading } = useMutate<any, Partial<Task> | null>();

    // Delete task
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete?")) {
            try {
                await mutate(url, "DELETE", null, fetchOptions);
                showToast({
                    variant: "success",
                    message: "Task deleted successfully",
                    autoClose: 500,
                });
                navigate({ to: "/tasks" });
            } catch (err) {
                showToast({
                    variant: "error",
                    message: "Delete failed",
                    autoClose: 500,
                });
            }
        }
    };

    // Navigate back
    const goToAllTasks = () => {
        navigate({ to: "/tasks" });
    };

    if (loading) return <Spinner />;
    if (error) return <p className="error">Error: {String(error)}</p>;

    return (
        <div className="task-container">
            <div
                className="card"
                style={{
                    background: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "50%",
                }}
            >
                <div className="task-card-header">{task?.title}</div>

                <div className="task-card-body">
                    <p>{task?.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>Requirements: {task?.requirements}</strong>
                    </div>
                </div>

                <div className="task-card-footer">
                    <span>{task && new Date(task.due_date).toLocaleString()}</span>
                    <span>{task?.max_score}</span>
                </div>

                {/* Action buttons */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={goToAllTasks}
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDelete}
                        disabled={mutateLoading}
                    >
                        {mutateLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>

                {/* Edit Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2>Edit Task</h2>
                    <TaskForm
                        initialData={{
                            subject_id: task?.subject_id,
                            title: task?.title,
                            description: task?.description,
                            requirements: task?.requirements,
                            due_date: task ? task.due_date.slice(0, 16) : "",
                            max_score: task?.max_score,
                        }}
                        submitLabel="Update Task"
                        onSubmit={async (formData) => {
                            try {
                                await mutate(url, "PUT", formData, fetchOptions);
                                await refetch();
                                setIsModalOpen(false);
                                showToast({
                                    variant: "success",
                                    message: "Task updated successfully",
                                    autoClose: 500,
                                });
                            } catch (err) {
                                showToast({
                                    variant: "error",
                                    message: "Error updating task",
                                    autoClose: 500,
                                });
                            }
                        }}
                    />
                </Modal>
            </div>
        </div>
    );
}

export default SingleTask;
