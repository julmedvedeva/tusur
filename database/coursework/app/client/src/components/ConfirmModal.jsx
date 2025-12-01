import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({ show, onHide, onConfirm, title, message }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title || 'Подтверждение'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || 'Вы уверены?'}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Отмена</Button>
        <Button variant="danger" onClick={onConfirm}>Удалить</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
