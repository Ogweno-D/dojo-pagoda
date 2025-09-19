import type {Task} from "../Task.type.ts";
import {useNavigate} from "@tanstack/react-router";
import {useTaskColumns} from "./TaskColumns.ts";
import {useState} from "react";
import {buildQueryParams} from "../../../../utils/queryParams.ts";
import {UserTableSkeleton} from "../../Users/UsersTable/userTableSkeleton.tsx";
import {Table} from "../../ReusableTable/Table.tsx";
import {useFetch} from "../../../../hooks/api/useFetch.tsx";
import "../task.css"
import PaginationWrapper from "../../ReusableTable/TableActions/PaginationWrapper.tsx";

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
        <div className={"task-container"}>
            <div className={"task-container-header"}>
                <h1>Tasks</h1>
                <button
                    className={"btn btn-primary"}
                    onClick={createTask}
                >
                    Create Form
                </button>
            </div>


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
                    <PaginationWrapper page={page} onClick={() => setPage(page - 1)} data={data}
                                       onClick1={() => setPage(page + 1)} value={pageSize} onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                    }}/>
                </>
            ) : (
                <div className={"no-data-error"}>
                    <h2> No tasks found.</h2>
                </div>
            )}
        </div>
    );
}

export default TaskTable;