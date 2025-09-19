// import * as React from "react";
//
// export type TableColumn<T> = {
//     id: keyof T & string;
//     caption?: string;
//     size?: number;
//     align?:"left"|"center"|"right";
//     type?: "text" | "number" | "custom";
//     hide?: boolean;
//     render?:(row:T) => React.ReactNode;
//     onRendered?: (
//         td: HTMLTableCellElement,
//         row:T) => void;
//     events?: Record<string, (row:T, event:Event) => void>;
//     onClick?: (row: T) => void;
// }

import React, { type HTMLAttributes } from "react";

export type TableColumn<T extends object, K extends keyof T> = {
    /** A unique ID for the column. */
    id: K;
    /** The display caption for the column header. */
    caption?: string;
    /** The estimated column width in pixels. */
    size?: number;
    /** Text alignment for the column data. */
    align?: "left" | "center" | "right";
    /** The type of data in the column (e.g., "text", "number", "date"). */
    type?: string;
    /** Whether to hide the column from view. */
    hide?: boolean;
    /** A custom render function for cell content. */
    render?: (cellData: T[K], rowData: T, index: number) => React.ReactNode;
    /** A callback after the cell has been rendered. */
    onRendered?: (cellElement: HTMLTableCellElement, rowData: T) => void;
    /** A custom set of events for the column. */
    events?: { [key: string]: Function };
    /** A click handler for the column cell. */
    onClick?: (cellData: T[K], rowData: T, index: number) => void;
};

export type TableColumnWithRowProps<T extends object> = TableColumn<T, keyof T> & {
    /** A function to apply custom properties to the table row based on row data. */
    rowProps?: (rowData: T) => HTMLAttributes<HTMLTableRowElement>;
};