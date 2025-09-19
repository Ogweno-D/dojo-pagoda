import React from "react";
import {Modal} from "../Modal.tsx";

interface DeleteConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    title?: string;
    message?: string;
}

export function DeleteConfirmModal({
                                       open,
                                       onClose,
                                       onConfirm,
                                       loading,
                                       title = "Confirm Delete",
                                       message = "Are you sure you want to delete this item?",
                                   }: DeleteConfirmModalProps) {
    return (
        <Modal open={open} onClose={onClose} title={title}>
            <p>{message}</p>
            <div className="modal-actions">
                <button className="btn-secondary" onClick={onClose}>
                    Cancel
                </button>
                <button
                    className="btn-danger"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>
            </div>
        </Modal>
    );
}
