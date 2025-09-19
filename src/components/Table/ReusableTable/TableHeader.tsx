import type { TableColumn } from "./TableColumn.type";

interface TableHeaderProps<T extends object> {
    columns: TableColumn<T>[];
}

export function TableHeader<T extends object>({ columns }: TableHeaderProps<T>) {
    return (
        <thead>
        <tr>
            {columns.map(
                (col) =>
                    !col.hide && (
                        <th
                            key={String(col.id)}
                            style={{
                                width: col.size,
                                textAlign: col.align,
                                borderBottom: "1px solid #ccc",
                                padding: "8px",
                            }}
                        >
                            {col.caption}
                        </th>
                    )
            )}
        </tr>
        </thead>
    );
}
