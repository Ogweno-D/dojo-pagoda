import { useDataTable } from "../../providers/DataTableProvider.tsx";
import "../table.css";

interface PaginationWrapperProps<T> {
    data: {
        domain?: string;
        current_page?: number;
        last_page?: number;
        page_size?: number;
        records?: T[];
    } | null;
}

function PaginationWrapper<T>({ data }: PaginationWrapperProps<T>) {
    const { page, setPage, pageSize, setPageSize } = useDataTable();

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < (data?.last_page ?? 1)) setPage(page + 1);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    return (
        <div className="table-footer">
            <div className="table-pagination">
                <div>
                    <button
                        className={`pagination-btn ${page === 1 ? "disabled" : ""}`}
                        onClick={handlePrev}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span style={{ marginLeft: "5px" }}>
            Page{" "}
                        <strong>
              {data?.current_page ?? 1} of {data?.last_page ?? 1}
            </strong>
          </span>
                    <button
                        className={`pagination-btn ${
                            page === (data?.last_page ?? 1) ? "disabled" : ""
                        }`}
                        onClick={handleNext}
                        disabled={page === (data?.last_page ?? 1)}
                    >
                        Next
                    </button>
                </div>

                <div>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default PaginationWrapper;
