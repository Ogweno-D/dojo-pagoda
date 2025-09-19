// createTableColumn.ts
import type {TableColumnWithRowProps } from "./TableColumn.type.ts";

/**
 * Creates a generic table column definition with default values and a new rowProps attribute.
 * @template T The type of the row data.
 * @param {TableColumnWithRowProps<T>} config The column configuration.
 * @returns {Required<TableColumnWithRowProps<T>>} A complete column definition object.
 */
export function createTableColumn<T extends object>(
    config: TableColumnWithRowProps<T>
): Required<TableColumnWithRowProps<T>> {
    const {
        id,
        caption,
        size = 100,
        align = "left",
        type = "text",
        hide = false,
        render,
        onRendered,
        events,
        onClick,
        rowProps,
    } = config;

    const generatedCaption =
        caption ??
        String(id)
            .toLowerCase()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    return {
        id,
        caption: generatedCaption,
        size,
        align,
        type,
        hide,
        render,
        onRendered,
        events,
        onClick,
        rowProps,
    } as Required<TableColumnWithRowProps<T>>;
}