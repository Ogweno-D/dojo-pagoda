import React, { useState, type ReactNode } from 'react';
import { Paper, Text, Group, CloseButton } from '@mantine/core';
import {
    IconCheck,
    IconX,
    IconInfoCircle,
    IconAlertTriangle,
} from '@tabler/icons-react';
import type {Toast, ToastPosition, ToastVariant} from './Toast.types';
import { ToastContext } from './ToastContext';

import "./toast.css";


type ToastWithState = Toast & { state: 'enter' | 'exit' };

// type ToastContextValue = {
//     addToast: (toast: Omit<Toast, 'id'>) => void;
//     removeToast: (id: string) => void;
// };

// export const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<
    ToastVariant,
    { color: string; icon: React.ReactNode }
> = {
    success: { color: 'green', icon: <IconCheck size={16} /> },
    error: { color: 'red', icon: <IconX size={16} /> },
    warning: { color: 'yellow', icon: <IconAlertTriangle size={16} /> },
    info: { color: 'blue', icon: <IconInfoCircle size={16} /> },
    default: { color: 'gray', icon: null },
};

export function ToastProvider({
                                  children,
                                  position = 'top-right',
                              }: {
    children: ReactNode;
    position?: ToastPosition;
}) {
    const [toasts, setToasts] = useState<ToastWithState[]>([]);

    const removeToast = (id: string) => {
        setToasts((current) =>
            current.map((t) => (t.id === id ? { ...t, state: 'exit' } : t))
        );
        setTimeout(() => {
            setToasts((current) => current.filter((t) => t.id !== id));
        }, 300);
    };

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2);
        const variant = toast.variant ?? 'default';
        const variantConfig = VARIANT_STYLES[variant];

        setToasts((t) => [
            ...t,
            {
                id,
                state: 'enter',
                ...toast,
                color: toast.color ?? variantConfig.color,
                icon: toast.icon ?? variantConfig.icon,
            },
        ]);

        if (toast.autoClose) {
            setTimeout(() => removeToast(id), toast.autoClose);
        }
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className={`toast-container toast-${position}`}>
                {toasts.map((toast) => (
                    <Paper
                        key={toast.id}
                        className={`toast ${
                            toast.state === 'enter' ? 'toast-enter' : 'toast-exit'
                        } toast-${position}`}
                        shadow="md"
                        p="sm"
                        radius="md"
                        withBorder
                        style={{
                            backgroundColor: toast.color
                                ? `var(--mantine-color-${toast.color}-0)`
                                : undefined,
                            minWidth: 250,
                        }}
                    >
                        <Group justify="space-between" align="start" gap="xs">
                            <Group gap="xs" align="center">
                                {/*{toast.icon}*/}
                                <div>
                                    {toast.title && <Text fw={500}>{toast.title}</Text>}
                                    <Text size="sm" c="dimmed">
                                        {toast.message}
                                    </Text>
                                </div>
                            </Group>
                            <CloseButton size="sm" onClick={() => removeToast(toast.id)} />
                        </Group>
                    </Paper>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// export const useToast = () => {
//     const ctx = useContext(ToastContext);
//     if (!ctx) throw new Error('useToast must be used within ToastProvider');
//     return ctx.addToast;
// };
