import React from "react";
import "./dashboard.css";

interface CardProps {
    title: string;
    value: number | string;
    change?: string;
}

export const Card: React.FC<CardProps> = ({ title, value, change }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h3>{title}</h3>
            </div>
            <div className="card-content">
                <div className="card-value">{value}</div>
                {change && <p className="card-change">{change} from last month</p>}
            </div>
        </div>
    );
};
