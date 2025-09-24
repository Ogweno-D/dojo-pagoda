import { createFileRoute } from '@tanstack/react-router'
import SubjectTable from "../../../components/Table/Subjects/SubjectsTable/SubjectTable.tsx";
import type {Subject} from "../../../components/Table/Subjects/Subject.type.ts";
import {buildQueryParams} from "../../../utils/queryParams.ts";
import {useEffect, useState} from "react";
import PaginationWrapper from "../../../components/Table/ReusableTable/TableActions/PaginationWrapper.tsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";

export  interface SubjectApiResponse {
    records: Subject[];
    domain: string;
    current_page: number;
    total_count: number;
    last_page: number;
    page_size: number;
}

async function getSubjects(page: number, pageSize: number): Promise<SubjectApiResponse> {
    const params = { page, page_size: pageSize };
    const token = import.meta.env.VITE_ADMIN_BEARER_TOKEN;
    const url = `api/admin/subjects${buildQueryParams(params)}`;
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error(`Failed to fetch subjects: ${res.status}`);

    return res.json();
}

export const Route = createFileRoute('/_protected/subjects/')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <SubjectTableWrapper />
    );
}
function SubjectTableWrapper() {
    // const { page, pageSize, setData} = useDataTable<Subject>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const queryClient = useQueryClient();

    // const params = { page, page_size: pageSize };
    // const url = `/api/admin/subjects/${buildQueryParams(params)}`;
    //
    // const { data, loading, error } = useFetch<SubjectApiResponse>(url, {
    //     headers: { "Content-Type": "application/json" },
    // });
    const {data, isLoading, isError, error, isFetching}  = useQuery<SubjectApiResponse>(
        {
        queryKey: ['subjects', page, pageSize],
        queryFn:()=>getSubjects(page,pageSize)
        }
    )

    useEffect(() => {
        if (data?.current_page && data?.current_page < (data?.last_page ?? 0)) {
            const nextPage = data.current_page + 1;
            queryClient.prefetchQuery({
                queryKey: ["tasks", nextPage, pageSize],
                queryFn: () => getSubjects(nextPage, pageSize),
            });
        }
    }, [data, pageSize, queryClient]);


    // const subjects: Subject[] = data?.records ?? [];


    return (
        <>
            <SubjectTable loading={isLoading} error={isError ? error : null } data={data} />
            {data && (
                <PaginationWrapper
                    currentPage={data.current_page}
                    lastPage={data.last_page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    isFetching={isFetching}
                />
            )}
        </>
    );
}
