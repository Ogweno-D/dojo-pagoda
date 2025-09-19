import type {TableColumn, TableColumnWithRowProps} from "./TableColumn.type.ts";
import type {HTMLAttributes} from "react";

interface TableRowProps<T extends object> {
    row: T;
    columns: TableColumn<T, any>[];
    rowIndex: number;
    onRowClick?: (rowData: T) => void;
}

export function TableRow<T extends object>({
                                               row,
                                               columns,
                                               rowIndex,
                                                onRowClick,
                                           }: TableRowProps<T>) {

    const rowPropsColumn = columns.find((col): col is TableColumnWithRowProps<T> => 'rowProps' in col && typeof col.rowProps === 'function');
    const rowAttributes: HTMLAttributes<HTMLTableRowElement> = rowPropsColumn?.rowProps?.(row) ?? {};

    return (
        <tr
            key={rowIndex}
            {...rowAttributes}

            onClick={onRowClick ? () => onRowClick(row) : undefined}
            style={{
                cursor: onRowClick ? 'pointer' : 'default',
            }}
        >
            {columns.map((col) => {
                if (col.hide) return null;

                const value =
                    (col.id as string | number) in row
                        ? (row as any)[col.id as keyof T]
                        : undefined;

                    // "id" in col && col.id in row
                    //     ? (row as any)[col.id]
                    //     : undefined;

                return (
                    <td
                        key={String(col.id)}
                        style={{
                            textAlign: col.align,
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                            cursor: col.onClick ? "pointer": undefined,
                        }}
                        onClick={() => col.onClick?.(value,row,rowIndex)}
                        ref={(el) => {
                            if (el && col.onRendered) {
                                col.onRendered(el, row);
                            }
                        }}
                    >
                        {/* * CORRECT: The render function receives three arguments:
                         * 1. cellData: The value for the current cell.
                         * 2. rowData: The entire row object.
                         * 3. rowIndex: The index of the current row.
                         * * Use col.render ? col.render(value, row, rowIndex) : value ?? "-".
                         * If col.id doesn't exist in row (like in a generic "actions" column),
                         * the first argument to render will be `undefined`, which is expected behavior.
                         */}
                        {col.render ? col.render(value, row, rowIndex) : value ?? "-"}
                    </td>
                );
            })}
        </tr>
    );
}