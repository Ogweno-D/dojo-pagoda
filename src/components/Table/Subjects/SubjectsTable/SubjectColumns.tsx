import {createTableColumn} from "../../ReusableTable/TableColumn.ts";
import type {Subject} from "../Subject.type.ts";
import {useNavigate} from "@tanstack/react-router";

export function useSubjectColumns(){
    const navigate  = useNavigate();

    return [
        createTableColumn<Subject>({
                id: "id",
                caption: "Subject ID",
                size: 80,
                onClick: (id) => {
                    const encodedId = btoa(id);
                    navigate({
                        to: "/subject/subjectId ",
                        params: {userId: encodedId}
                    })

                },
            }),
        createTableColumn<Subject>({
            id: "name",
            caption: "Name",
            size: 80,
        }),
        createTableColumn<Subject>({
            id:"description",
            caption: "Description",
            size: 120,
        }),
        createTableColumn<Subject>({
            id:"created_by_name",
            caption: "Created By",
            size: 80,
        }),
        createTableColumn<Subject>({
            id: "created_at",
            caption: "Created By",
            size: 80,
        }),
    ]
}