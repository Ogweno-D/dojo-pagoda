import { createContext } from 'react';
import type { Toast } from './Toast.types';

export type ToastContextValue = {
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
