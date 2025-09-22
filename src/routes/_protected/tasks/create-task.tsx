import { createFileRoute } from '@tanstack/react-router'
import TaskForm, { type TaskFormData } from "../../../components/Forms/TaskForm.tsx";
import { useMutate } from "../../../hooks/api/useMutate.tsx";
import { useToast } from "../../../hooks/toast/useToast.tsx";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute('/_protected/tasks/create-task')({
    component: RouteComponent,
})

function RouteComponent() {
    const showToast = useToast();
    const navigate = useNavigate();

    const { mutate: createTask, loading } = useMutate<any, TaskFormData>();

    const handleSubmit = async (data: TaskFormData) => {
        try {
            await createTask("/api/admin/tasks", "POST", data, {
                headers: { "Content-Type": "application/json" },
            });
            showToast({
                variant: "success",
                message: "Task created successfully",
                autoClose: 3000,
            });
            navigate({ to: '/tasks' });
        } catch (err) {
            showToast({
                variant: "error",
                message: "Task creation failed",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className={"task-form"}>
            <h1 style={{ fontSize: "2rem", textAlign: "start", margin: "12px" }}>
                Create a Task
            </h1>

            <TaskForm onSubmit={handleSubmit} submitLabel={loading ? "Creating..." : "Create Task"} />
        </div>
    );
}
