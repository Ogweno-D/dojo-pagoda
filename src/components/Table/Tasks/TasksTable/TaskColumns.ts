import {useNavigate} from "@tanstack/react-router";
import {createTableColumn} from "../../ReusableTable/TableColumn.ts";
import type {Task} from "../Task.type.ts";

export function useTaskColumns(){
    const navigate = useNavigate();

    return [
        createTableColumn<Task>({
            id:"id",
            caption: "Task ID",
            size: 20
        }),
        createTableColumn<Task>({
            id:"title",
            caption: "Task Title",
            size: 60,
        }),
        createTableColumn<Task>({
            id:"description",
            caption: "Task Description",
            size: 80,
        }),
        createTableColumn<Task>({
            id:"subject_name",
            caption: "Subject Name",
            size: 80,
        })
    ]
}