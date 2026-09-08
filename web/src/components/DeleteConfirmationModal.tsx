interface DeleteConfirmationModalProps {
    title: string;
    isDeleting: boolean;
    error: string | null;
    onConfirm: () => void;
    onClose: () => void;
}

export function DeleteConfirmationModal({
    title,
    isDeleting,
    error,
    onConfirm,
    onClose,
}: DeleteConfirmationModalProps) {
    return (
        <div
            className="modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section 
                className="modal delete-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
            >
                <div className="modal__header">
                    <h2 id="delete-modal-title">Delete Series</h2>

                    <button 
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                        disabled={isDeleting}
                        aria-label="Close"
                    >
                        x
                    </button>
                </div>

                <p>
                    Are you sure you want to delete{' '}
                    <strong>{title}</strong>?
                </p>

                <p className="delete-modal_warning">
                    This action cannot be undone.
                </p>

                {error && (
                    <p className="form-error" role="alert">
                        {error}
                    </p>
                )}

                <div className="modal__actions">
                    <button 
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}    
                    >
                        Cancel
                    </button>
                    
                    <button 
                        type="button"
                        className="delete-button"
                        onClick={onConfirm}
                        disabled={isDeleting}    
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>

            </section>
        </div>
    )
}