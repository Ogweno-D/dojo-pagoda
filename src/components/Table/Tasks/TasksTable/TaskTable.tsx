import type {Task} from "../Task.type.ts";
import {useNavigate} from "@tanstack/react-router";
import {useTaskColumns} from "./TaskColumns.ts";
import {useState} from "react";
import {buildQueryParams} from "../../../../utils/queryParams.ts";
import {UserTableSkeleton} from "../../Users/UsersTable/userTableSkeleton.tsx";
import {Table} from "../../ReusableTable/Table.tsx";
import {useFetch} from "../../../../hooks/api/useFetch.tsx";

interface TaskApiResponse {
    domain:string;
    current_page:number;
    last_page:number;
    page_size:number;
    records: Task[];
}

function TaskTable(){
    const navigate = useNavigate();
    const columns = useTaskColumns();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const params = {
        page,
        page_size:pageSize,
    }
    const url = `/api/admin/tasks/${buildQueryParams(params)}`;

    const fetchOptions = {
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    }

    const { data, loading, error} = useFetch<TaskApiResponse> (
        url,
        fetchOptions
    );

    const tasks: Task[] = data?.records ?? [];

    if (loading) {
        return <UserTableSkeleton rows={8} columns={5} />;
    }
    if(error){
        return (
            <p className={"error"}> Error: {String(error)} </p>
        );
    }


    // Create a new task
    const createTask = () =>{
        navigate({
            to: '/tasks/create-task'
        })
    }

    const handleRowClick = (row: Task) => {
        const encodedId = btoa(row.id)
        navigate({
            to: '/tasks/$taskId',
            params: {taskId: encodedId}
        })
    }

    return (
        <div>
            <button
                onClick={createTask}
            >
                Create Form
            </button>
            <h2>Tasks</h2>

            {error && <div className="error">{String(error)}</div>}

            {tasks.length> 0 ? (
                <>
                    <Table
                        tableId={"tasksTable"}
                        data={tasks}
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
                <p>No tasks found.</p>
            )}
        </div>
    );
}

export default TaskTable;