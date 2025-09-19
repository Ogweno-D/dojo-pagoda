import type {Task} from "./Task.type.ts";
import {useToast} from "../../../hooks/toast/useToast.tsx";
import {useFetch} from "../../../hooks/api/useFetch.tsx";

interface SingleTaskProp{
    id:number;
}

interface SingleTaskApiResponse{
    task : Task;
    message: string;
}


function SingleTask({id}: SingleTaskProp) {
    const showToast =  useToast()


    const url = `/api/admin/tasks/${id}`;


    const fetchOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    }

    const {data,loading,error,refetch} = useFetch<SingleTaskApiResponse>(
        url,
        fetchOptions
    );

    const task: Task | undefined = data?.task

    if(error){
        return(
            <p className={"error"}> Error: {String(error)} </p>
        );
    }
    return (
        <div>
            <p>{task?.subject_name}</p>
            <p>{task?.title}</p>
        </div>
    );
}

export default SingleTask;