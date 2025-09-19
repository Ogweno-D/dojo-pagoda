// UserTableSkeleton.tsx
import React from "react";
import "./userTable.css";

export const UserTableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
                                                                                     rows = 5,
                                                                                     columns = 4}) => {
    return (
        <div className="table-wrapper">
            <table className="styled-table">
                <thead>
                <tr>
                    {Array.from({ length: columns }).map((_, i) => (
                        <th key={i}>
                            <div className="skeleton skeleton-header" />
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {Array.from({ length: rows }).map((_, r) => (
                    <tr key={r}>
                        {Array.from({ length: columns }).map((_, c) => (
                            <td key={c}>
                                <div className="skeleton skeleton-cell" />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
