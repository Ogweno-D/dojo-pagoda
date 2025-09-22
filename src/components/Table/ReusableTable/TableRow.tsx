import { type HTMLAttributes } from "react";
import type { TableColumn, TableColumnWithRowProps } from "./TableColumn.type.ts";

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
    // Merge all rowProps across columns
    const rowAttributes: HTMLAttributes<HTMLTableRowElement> = columns
        .filter((col): col is TableColumnWithRowProps<T> =>
            'rowProps' in col && typeof col.rowProps === 'function'
        )
        .reduce((acc, col) => {
            const props = col.rowProps!(row);

            // Merge styles
            if (props.style) {
                acc.style = { ...acc.style, ...props.style };
            }

            // Merge className
            if (props.className) {
                acc.className = acc.className ? `${acc.className} ${props.className}` : props.className;
            }

            // Merge other props
            Object.keys(props).forEach((key) => {
                if (key !== 'style' && key !== 'className') {
                    (acc as any)[key] = (props as any)[key];
                }
            });

            return acc;
        }, {} as HTMLAttributes<HTMLTableRowElement>);

    return (
        <tr
            key={rowIndex}
            {...rowAttributes}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            style={{
                cursor: onRowClick ? 'pointer' : 'default',
                ...rowAttributes.style,
            }}
        >
            {columns.map((col) => {
                if (col.hide) return null;

                const value = (col.id as string | number) in row ? (row as any)[col.id] : undefined;

                return (
                    <td
                        key={String(col.id)}
                        style={{
                            textAlign: col.align,
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                            cursor: col.onClick ? "pointer" : undefined,
                        }}
                        onClick={() => col.onClick?.(value, row, rowIndex)}
                        ref={(el) => {
                            if (el && col.onRendered) col.onRendered(el, row);
                        }}
                    >
                        {col.render ? col.render(value, row, rowIndex) : value ?? "-"}
                    </td>
                );
            })}
        </tr>
    );
}
