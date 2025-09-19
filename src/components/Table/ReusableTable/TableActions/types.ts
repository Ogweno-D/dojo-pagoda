export type SortRule ={
    field: string;
    order: "asc" | "desc";
}

export type FilterRule ={
    field: string;
    operator: string;
    value: string;
}

export type Column = {
    id: string;
    caption: string;
}
