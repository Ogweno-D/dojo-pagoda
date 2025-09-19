import type { TableColumn } from "./TableColumn.type";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import "./table.css";

interface TableProps<T extends object> {
    tableId: string;
    data: T[];
    columns: TableColumn<T, any>[];
    onRowClick: (row: T) => void;
}

export function Table<T extends object>({ tableId, data, columns, onRowClick}: TableProps<T>) {
    if (!columns || columns.length === 0) {
        return <p>No columns defined</p>;
    }

    return (
        <div>
            <table id={tableId} className={"stat-table"}>
                <TableHeader columns={columns} />
                <TableBody data={data} columns={columns} onRowClick={onRowClick} />
            </table>
        </div>
       
    );
}
