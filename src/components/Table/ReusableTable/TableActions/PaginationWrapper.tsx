import type {Task} from "../../Tasks/Task.type.ts";
import "../table.css"

function PaginationWrapper(props: {
    page: number,
    onClick: () => void,
    data: {
        domain: string | undefined;
        current_page: number | undefined;
        last_page: number | undefined;
        page_size: number | undefined;
        records: Task[] | undefined
    },
    onClick1: () => void,
    value: number,
    onChange: (e) => void
}) {
    return <div className={"table-footer"}>
        <div className="table-pagination">
            <div>
                <button
                    className={`pagination-btn ${props.page === 1 ? "disabled" : ""}`}
                    onClick={props.onClick}
                    disabled={props.page === 1}
                >
                    Previous
                </button>
                <span style={{marginLeft: "5px"}}>
                                 Page{" "}
                    <strong>
                                    {props.data?.current_page ?? 1} of {props.data?.last_page ?? 1}
                                    </strong>{" "}
                    {/*(Total Records: {data?.total_count ?? 0})*/}
                                 </span>
                <button
                    className={`pagination-btn ${props.page === (props.data?.last_page ?? 1) ? "disabled" : ""}`}
                    onClick={props.onClick1}
                    disabled={props.page === (props.data?.last_page ?? 1)}
                >
                    Next
                </button>
            </div>

            <div>
                <select
                    value={props.value}
                    onChange={props.onChange}
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>
            </div>

        </div>
    </div>;
}

export  default PaginationWrapper;