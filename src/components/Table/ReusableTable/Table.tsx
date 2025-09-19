import type { TableColumn } from "./TableColumn.type";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import "./table.css";
import {useDataTable} from "../providers/DataTableProvider.tsx";

interface TableProps<T extends object> {
    tableId: string;
    columns: TableColumn<T, any>[];
    onRowClick: (row: T) => void;
}

export function Table<T extends object>({ tableId, columns, onRowClick}: TableProps<T>) {
    const { filteredAndSortedData } = useDataTable<T>();

    if (!columns || columns.length === 0) {
        return <p>No columns defined</p>;
    }

    return (
        <div>
            <table id={tableId} className={"stat-table"}>
                <TableHeader columns={columns} />
                <TableBody data={filteredAndSortedData} columns={columns} onRowClick={onRowClick} />
            </table>
        </div>
       
    );
}
