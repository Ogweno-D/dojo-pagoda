import {useEffect, useState} from "react";
import "./filterSort.css";
import type { Column, SortRule } from "./types";
import {useDataTable} from "../../providers/DataTableProvider.tsx";


interface SortManagerProps {
    columns: Column[];
}

export function SortManager({columns}: SortManagerProps) {
    const {sorts, setSorts, applyRules, resetRules} = useDataTable();
    const [isOpen, setIsOpen] = useState(false);

    const addSortRow = () =>
        setSorts((prev) => [...prev, { field: columns[0].id, order: "asc" }]);

    const updateSortRow = (idx: number, key: keyof SortRule, val: string) => {
        const updated = [...sorts];
        updated[idx] = { ...updated[idx], [key]: val as "asc" | "desc" };
        setSorts(updated);
    };

    const removeSortRow = (idx: number) => {
        const updated = sorts.filter((_, i) => i !== idx);
        setSorts(updated);
    };

    const resetSorts = () => {
        resetRules();
    };

    useEffect(() => {
        setIsOpen(false)
    }, []);
    return (
        <>
            <div className="filter-sort-btn" onClick={() => setIsOpen(true)}>
                {sorts.length > 0 ? (
                    <div className="active-tag" data-type="sort">
                        <div className="tag-number">
                            <span className="total-tags">{sorts.length}</span>
                            <span className="tag-type">
                Sort{sorts.length > 1 ? "s" : ""}
              </span>
                        </div>
                        <div
                            className="delete-tag"
                            data-type="sort"
                            onClick={(e) => {
                                e.stopPropagation();
                                resetSorts();
                            }}
                        >
                            <i className="fa-solid fa-close"></i>
                        </div>
                    </div>
                ) : (
                    <div className="sort-icon">
                        <svg
                            width="20"
                            height="18"
                            viewBox="0 0 20 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M16 18L12 14H15V4H12L16 0L20 4H17V14H20M0 16V14H10V16M0 10V8H7V10M0 4V2H4V4H0Z"
                                fill="#DB8A74"
                            />
                        </svg>
                        <span> Sort</span>
                    </div>
                )}
            </div>

            <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
                <div className="modal">
                    <div className="modal-header">
                        <span>Sorts</span>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div className="modal-body">
                        {sorts.map((s, idx) => (
                            <div key={idx} className="modal-row">
                                <select
                                    value={s.field}
                                    onChange={(e) => updateSortRow(idx, "field", e.target.value)}
                                >
                                    {columns.map((col) => (
                                        <option key={col.id} value={col.id}>
                                            {col.caption}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={s.order}
                                    onChange={(e) =>
                                        updateSortRow(idx, "order", e.target.value)
                                    }
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeSortRow(idx)}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        ))}

                        <button className="add-btn" onClick={addSortRow}>
                            <i className="fa-solid fa-plus"></i> Add Sort
                        </button>
                    </div>

                    <div className="modal-footer">
                        <button onClick={()=>{resetSorts(); applyRules();}}>Reset</button>
                        <button onClick={() => {setIsOpen(false); applyRules();}}>Apply</button>
                    </div>
                </div>
            </div>
        </>
    );
}
