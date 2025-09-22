// import type {createTableColumn} from "../TableColumn.ts";
import {useDataTable} from "../../providers/DataTableProvider.tsx";
import {Table} from "../Table.tsx";
import type {TableColumnWithRowProps} from "../TableColumn.type.ts";

interface PaginationProps<T extends object>  {
    columns: Required<TableColumnWithRowProps<T>>[];
    totalCount: number;
}

function PaginationManager<T extends object>({ columns, totalCount }: PaginationProps<T>) {
    const { page, setPage, pageSize, setPageSize } =
        useDataTable<T>();

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return (
        <>
            <Table<T>
                tableId="peopleTable"
                columns={columns}
            />

            <div className="pagination">
                <div>
                    <button onClick={() => setPage(Math.max(page - 1, 1))} disabled={page === 1}>
                        Previous
                    </button>
                    <span>
                    Page{" "}
                        <input
                            type="number"
                            value={page}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (!Number.isNaN(val) && val >= 1 && val <= totalPages) {
                                    setPage(val);
                                }
                            }}
                            style={{ width: "40px" }}
                        />{" "}
                        of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(Math.min(page + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>

                <span>
               Rows per page:{" "}
                    <select
                        className="pagination-select"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
          </select>
        </span>
            </div>
        </>
    );
}

export default PaginationManager;