import type { TableColumn } from "./TableColumn.type";
import { TableRow } from "./TableRow";

interface TableBodyProps<T extends object> {
    data: T[];
    columns: TableColumn<T, any>[];
    onRowClick?: (rowData: T) => void;
}

export function TableBody<T extends object>(
    {
        data,
        columns,
        onRowClick,
    }: TableBodyProps<T>) {

    if (!data || data.length === 0) {
        return (
            <tbody>
                <tr>
                    <td
                        colSpan={columns.filter((c) => !c.hide).length}
                        style={{ textAlign: "center", padding: "12px" }}
                    >
                        No records found.
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody>
            {data.map((row, index) => (
                <TableRow
                    key={index}
                    row={row}
                    columns={columns}
                    rowIndex={index}
                    onRowClick={onRowClick}
                />
            ))}
        </tbody>
    );
}
