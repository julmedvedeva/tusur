import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { fetchData } from '../api';

function PatientVisitsReportModal({ show, onHide }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setLoading(true);
      fetchData('/patients')
        .then(data => {
          setPatients(data);
          setError(null);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [show]);

  const handleDownload = () => {
    if (selectedPatient) {
      window.location.href = `/api/export/patient-visits/${selectedPatient}`;
      onHide();
    }
  };

  const handleClose = () => {
    setSelectedPatient('');
    setError(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Отчёт по посещениям пациента</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group>
          <Form.Label>Выберите пациента</Form.Label>
          <Form.Select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            disabled={loading}
          >
            <option value="">
              {loading ? 'Загрузка...' : 'Выберите пациента...'}
            </option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.last_name} {p.first_name} {p.patronymic || ''}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Отмена</Button>
        <Button
          variant="primary"
          onClick={handleDownload}
          disabled={!selectedPatient}
        >
          Скачать отчёт
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PatientVisitsReportModal;
