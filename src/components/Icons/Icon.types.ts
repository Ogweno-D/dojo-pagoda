import type {ReactNode} from "react";


export interface IconProps {
    children:ReactNode;
    size?: "small" | "medium" | "large";
    decorative?: boolean;
    color?: string;
}