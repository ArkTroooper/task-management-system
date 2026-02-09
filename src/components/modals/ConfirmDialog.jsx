import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import Button from '../common/Button';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-text-muted mb-6">{message}</p>
      <div className="flex space-x-3">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} className="flex-1">
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmDialog;
