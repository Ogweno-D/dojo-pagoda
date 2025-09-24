import {FilterManager} from "./FilterManager.tsx";
import {SortManager} from "./SortManager.tsx";
import type {Column} from "./types.ts";


export function TableActions({columns}: { columns: Column[]}) {

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "1rem" }}>
            <FilterManager columns={columns} />
            <SortManager columns={columns} />
        </div>
    );
}