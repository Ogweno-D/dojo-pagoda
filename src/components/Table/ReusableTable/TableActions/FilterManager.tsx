import { useState} from "react";
import "./filterSort.css";
import type {Column, FilterRule} from "./types.ts";
import {useDataTable} from "../../providers/DataTableProvider.tsx";

interface FilterManagerProps {
    columns: Column[];
}

export function FilterManager({columns}: FilterManagerProps){

    const{filters,setFilters, applyRules, resetRules} = useDataTable();
    const [isOpen, setIsOpen] = useState(false);


    const addFilterRow = () =>
        setFilters((prev) => [...prev, {
            field: columns[0].id,
            operator: "contains",
            value: ""
        }]);

    const updateFilterRow = (index: number, key: keyof FilterRule, val: string) => {
        const updated = [...filters];
        updated[index] = { ...updated[index], [key]: val };
        setFilters(updated);
    };

    const removeFilterRow = (index: number) => {
        const updated = filters.filter((_, i) => i !== index);
        setFilters(updated);
    };

    const resetFilters = () => {
        resetRules();
    };

    return (
        <>
            <div className="filter-sort-btn" onClick={() => setIsOpen(true)}>
                {filters.length > 0 ? (
                    <div className="active-tag" data-type="filter">
                        <div className="tag-number">
                            <span className="total-tags">{filters.length}</span>
                            <span className="tag-type">
                                Filter{filters.length > 1 ? "s" : ""}
                            </span>
                        </div>
                        <div
                            className="delete-tag"
                            data-type="filter"
                            onClick={(e) => {
                                e.stopPropagation();
                                resetFilters();
                            }}
                        >
                            <i className="fa-solid fa-close"></i>
                        </div>
                    </div>
                ) : (
                    <div className="filter-icon">
                        <svg
                            width="20"
                            height="18"
                            viewBox="0 0 18 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 7H15V5H3M0 0V2H18V0M7 12H11V10H7V12Z"
                                fill="#DB8A74"
                            />
                        </svg>
                        <span> Filter</span>
                    </div>
                )}
            </div>

            <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
                <div className="modal">
                    <div className="modal-header">
                        <span>Filters</span>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div className="modal-body">
                        {filters.map((f, idx) => (
                            <div key={idx} className="modal-row ">
                                <select
                                    value={f.field}
                                    onChange={(e) => updateFilterRow(idx, "field", e.target.value)}
                                >
                                    {columns.map((col) => (
                                        <option key={col.id} value={col.id}>
                                            {col.caption}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={f.operator}
                                    onChange={(e) => updateFilterRow(idx, "operator", e.target.value)}
                                >
                                    <option value="contains">contains</option>
                                    <option value="equals">equals</option>
                                    <option value="startsWith">startsWith</option>
                                    <option value="endsWith">endsWith</option>
                                </select>

                                <input
                                    type="text"
                                    value={f.value}
                                    onChange={(e) => updateFilterRow(idx, "value", e.target.value)}
                                />

                                <button className="remove-btn" onClick={() => removeFilterRow(idx)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        ))}

                        <button className="add-btn" onClick={addFilterRow}>
                            <i className="fa-solid fa-plus"></i> Add Filter
                        </button>
                    </div>

                    <div className="modal-footer">
                        <button onClick={() => {resetFilters(); applyRules();} }>Reset</button>
                        <button onClick={() => {setIsOpen(false);applyRules();}}>Apply</button>
                    </div>
                </div>
            </div>
        </>
    );
}
