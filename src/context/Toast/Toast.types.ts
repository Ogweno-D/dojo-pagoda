import React from "react";

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';
export type ToastPosition =
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'top-center';

export type Toast = {
    id: string;
    title?: string;
    message: string;
    variant?: ToastVariant;
    color?: string;
    icon?: React.ReactNode;
    autoClose?: number; // ms
};
