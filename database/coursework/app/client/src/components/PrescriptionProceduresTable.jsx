import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import { fetchData } from '../api';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

function PrescriptionProceduresTable() {
  const { data, loading, error, create, update, remove } = useCrud('/prescription-procedures');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [procedures, setProcedures] = useState([]);

  useEffect(() => {
    fetchData('/medical-records').then(setMedicalRecords);
    fetchData('/procedures').then(setProcedures);
  }, []);

  const fields = [
    { name: 'medical_record_id', label: 'Медицинская запись', type: 'select', required: true,
      options: medicalRecords.map(m => ({ value: m.id, label: `#${m.id} - ${m.patient_name} (${m.diagnosis_code})` })) },
    { name: 'procedure_id', label: 'Процедура', type: 'select', required: true,
      options: procedures.map(p => ({ value: p.id, label: `${p.code || '-'} - ${p.name}` })) },
    { name: 'quantity', label: 'Количество', type: 'number', required: true, min: 1 },
    { name: 'duration_minutes', label: 'Длительность (мин)', type: 'number', min: 1 },
  ];

  const handleAdd = () => { setEditItem(null); setShowForm(true); };
  const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
  const handleDelete = (id) => { setDeleteId(id); setDeleteError(null); setShowDelete(true); };

  const handleSubmit = async (formData) => {
    // Валидация: количество > 0, длительность > 0
    if (formData.quantity <= 0) {
      throw new Error('Количество должно быть больше 0');
    }
    if (formData.duration_minutes && formData.duration_minutes <= 0) {
      throw new Error('Длительность должна быть больше 0');
    }

    const cleanData = { ...formData };
    if (!cleanData.duration_minutes) delete cleanData.duration_minutes;

    if (editItem) await update(editItem.id, cleanData);
    else await create(cleanData);
  };

  const confirmDelete = async () => {
    try {
      await remove(deleteId);
      setShowDelete(false);
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Назначения процедур</h2>
        <Button variant="success" onClick={handleAdd}>+ Назначить процедуру</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Пациент</th>
            <th>Диагноз</th>
            <th>Процедура</th>
            <th>Количество</th>
            <th>Длительность</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.patient_name}</td>
              <td><code>{row.diagnosis_code}</code></td>
              <td>{row.procedure_name}</td>
              <td>{row.quantity}</td>
              <td>{row.duration_minutes ? `${row.duration_minutes} мин` : '-'}</td>
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
        title={editItem ? 'Редактировать назначение' : 'Назначить процедуру'}
        fields={fields} initialData={editItem || { quantity: 1 }} onSubmit={handleSubmit} />

      <ConfirmModal
        show={showDelete}
        onHide={() => { setShowDelete(false); setDeleteError(null); }}
        onConfirm={confirmDelete}
        title="Удалить назначение"
        message="Вы уверены, что хотите удалить это назначение процедуры?"
        error={deleteError}
      />
    </>
  );
}

export default PrescriptionProceduresTable;
