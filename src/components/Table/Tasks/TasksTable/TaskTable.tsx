import type { Task } from "../Task.type.ts";
import { useNavigate } from "@tanstack/react-router";
import { useTaskColumns } from "./TaskColumns.ts";
import { UserTableSkeleton } from "../../Users/UsersTable/userTableSkeleton.tsx";
import { Table } from "../../ReusableTable/Table.tsx";
import "../task.css";
import { TableActions } from "../../ReusableTable/TableActions/TableActions.tsx";
import {DataTableProvider} from "../../providers/DataTableProvider.tsx";
interface TaskApiResponse {
    domain: string;
    current_page: number;
    last_page: number;
    page_size: number;
    records: Task[];
}


interface TaskTableProps {
    loading: boolean;
    error: unknown;
    data: TaskApiResponse | undefined;
}

function TaskTable({ loading, error, data }: TaskTableProps) {
    const navigate = useNavigate();
    const columns = useTaskColumns();

    const tasks: Task[] = data?.records ?? [];

    if (loading) {
        return <UserTableSkeleton rows={8} columns={5} />;
    }

    if (error) {
        return <p className="error">Error: {String(error)}</p>;
    }

    const createTask = () => {
        navigate({ to: "/tasks/create-task" });
    };

    const handleRowClick = (row: Task) => {
        const encodedId = btoa(String(row.id));
        navigate({ to: "/tasks/$taskId", params: { taskId: encodedId } });
    };

    return (
        <div className="task-container">
            <div className="task-container-header">
                <h1>Tasks</h1>
                <button className="btn btn-primary" onClick={createTask}>
                    Create Form
                </button>
            </div>

            {tasks.length > 0 ? (
                <>
                <DataTableProvider<Task> data={tasks}>
                <TableActions
                        columns={columns}
                    />
                    <Table
                        tableId="tasksTable"
                        columns={columns}
                        onRowClick={handleRowClick}
                    />
                </DataTableProvider>

                </>
            ) : (
                <div className="no-data-error">
                    <h2>No tasks found.</h2>
                </div>
            )}
        </div>
    );
}

export default TaskTable;
