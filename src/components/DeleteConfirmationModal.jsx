import React from "react";
import { Modal, Button } from "react-bootstrap";

/**
 * DeleteConfirmationModal
 *
 * Reusable confirmation modal for destructive actions (deleting a product).
 *
 * Props:
 *  - show: boolean           -> controls modal visibility
 *  - handleClose: function   -> called when the user cancels/close the modal
 *  - handleConfirm: function -> called when the user confirms deletion
 *  - isDeleting: boolean     -> when true, shows a loading/disabled state
 *
 * Notes:
 *  - Keep the modal simple and focused: only Confirm/Cancel actions.
 *  - Buttons are disabled while `isDeleting` to prevent duplicate requests.
 *  - The parent should manage the actual delete API call and pass `isDeleting`.
 *  - For accessibility, the Modal from react-bootstrap handles focus trapping.
 *    If you need to communicate progress to assistive tech, consider adding
 *    aria-live regions in the parent while deletion is in progress.
 */
function DeleteConfirmationModal({
  show,
  handleClose,
  handleConfirm,
  isDeleting,
}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      // `backdrop="static"` can be used to prevent closing by clicking outside
      // while a deletion is in progress. Uncomment if desired:
      // backdrop={isDeleting ? "static" : true}
      centered
      aria-labelledby="delete-confirmation-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="delete-confirmation-title">
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>

      {/* Modal body: brief, clear message about the destructive action */}
      <Modal.Body>
        Are you sure you want to delete this product? This action cannot be
        undone.
      </Modal.Body>

      {/* Footer: Cancel and Confirm actions.
          - Cancel simply closes the modal.
          - Confirm triggers the deletion handler provided by the parent.
          - While `isDeleting` is true both buttons are disabled to prevent
            duplicate submissions; Confirm shows a loading label. */}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmationModal;
