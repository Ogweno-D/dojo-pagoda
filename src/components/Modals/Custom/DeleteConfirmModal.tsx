import {Modal} from "../Modal.tsx";
import Spinner from "../../Spinner/Spinner.tsx";

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
        <Modal isOpen={open} onClose={onClose}>
            <div className="modal-header">
                <h3>{title}</h3>
            </div>
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
                    {loading ? <Spinner /> : "Delete"}
                </button>
            </div>
        </Modal>
    );
}
