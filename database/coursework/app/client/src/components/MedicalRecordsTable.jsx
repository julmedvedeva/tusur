import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import { fetchData } from '../api';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

function MedicalRecordsTable() {
  const { data, loading, error, create, update, remove } = useCrud('/medical-records');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchData('/patients').then(setPatients);
    fetchData('/diagnoses').then(setDiagnoses);
    fetchData('/appointments').then(setAppointments);
  }, []);

  const fields = [
    { name: 'appointment_id', label: 'Приём', type: 'select', required: true,
      options: appointments.map(a => ({ value: a.id, label: `#${a.id} - ${a.patient_name} (${new Date(a.scheduled_at).toLocaleDateString('ru-RU')})` })) },
    { name: 'patient_id', label: 'Пациент', type: 'select', required: true,
      options: patients.map(p => ({ value: p.id, label: `${p.last_name} ${p.first_name}` })) },
    { name: 'diagnosis_id', label: 'Диагноз', type: 'select', required: true,
      options: diagnoses.map(d => ({ value: d.id, label: `${d.code} - ${d.name}` })) },
    { name: 'description', label: 'Описание', type: 'textarea' },
  ];

  const handleAdd = () => { setEditItem(null); setShowForm(true); };
  const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
  const handleDelete = (id) => { setDeleteId(id); setShowDelete(true); };

  const handleSubmit = async (formData) => {
    if (editItem) await update(editItem.id, formData);
    else await create(formData);
  };

  const confirmDelete = async () => { await remove(deleteId); setShowDelete(false); };

  const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString('ru-RU');

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Медицинские записи</h2>
        <Button variant="success" onClick={handleAdd}>+ Добавить запись</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Дата</th>
            <th>Пациент</th>
            <th>Диагноз</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{formatDateTime(row.created_at)}</td>
              <td>{row.patient_name}</td>
              <td><code>{row.diagnosis_code}</code> {row.diagnosis_name}</td>
              <td style={{ maxWidth: '300px' }}>{row.description}</td>
              <td>
                <ButtonGroup size="sm">
                  <Button variant="outline-primary" onClick={() => handleEdit(row)}>Изм.</Button>
                  <Button variant="outline-danger" onClick={() => handleDelete(row.id)}>Уд.</Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <FormModal show={showForm} onHide={() => setShowForm(false)}
        title={editItem ? 'Редактировать запись' : 'Добавить запись'}
        fields={fields} initialData={editItem || {}} onSubmit={handleSubmit} />

      <ConfirmModal show={showDelete} onHide={() => setShowDelete(false)}
        onConfirm={confirmDelete} title="Удалить запись"
        message="Вы уверены, что хотите удалить эту медицинскую запись?" />
    </>
  );
}

export default MedicalRecordsTable;
