import { createFileRoute } from '@tanstack/react-router'
import SubjectTable from "../../../components/Table/Subjects/SubjectsTable/SubjectTable.tsx";
import type {Subject} from "../../../components/Table/Subjects/Subject.type.ts";
import {DataTableProvider, useDataTable} from "../../../components/Table/providers/DataTableProvider.tsx";
import type {Task} from "../../../components/Table/Tasks/Task.type.ts";
import {buildQueryParams} from "../../../utils/queryParams.ts";
import {useFetch} from "../../../hooks/api/useFetch.tsx";
import {useEffect} from "react";
import PaginationWrapper from "../../../components/Table/ReusableTable/TableActions/PaginationWrapper.tsx";

export  interface SubjectApiResponse {
    records: Subject[];
    domain: string;
    current_page: number;
    total_count: number;
    last_page: number;
    page_size: number;
}
export const Route = createFileRoute('/_protected/subjects/')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <DataTableProvider<Task>
            data={[]}
            initialState={{ filters: [], sorts: [], page: 1, pageSize: 5 }}
        >
            <SubjectTableWrapper />
        </DataTableProvider>
    );
}
function SubjectTableWrapper() {
    const { page, pageSize, setData} = useDataTable<Subject>();

    const params = { page, page_size: pageSize };
    const url = `/api/admin/tasks${buildQueryParams(params)}`;

    const { data, loading, error } = useFetch<SubjectApiResponse>(url, {
        headers: { "Content-Type": "application/json" },
    });

    const subjects: Subject[] = data?.records ?? [];

    // Update provider data when API returns
    useEffect(() => {
        setData(subjects);
    }, [subjects, setData]);

    return (
        <>
            <SubjectTable loading={loading} error={error} data={data} />
            <PaginationWrapper data={data} />
        </>
    );
}
