import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import { fetchData } from '../api';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

const statusVariant = {
  scheduled: 'primary',
  confirmed: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'secondary',
  no_show: 'danger'
};

const statusLabel = {
  scheduled: 'Запланирован',
  confirmed: 'Подтверждён',
  in_progress: 'Идёт приём',
  completed: 'Завершён',
  cancelled: 'Отменён',
  no_show: 'Неявка'
};

function AppointmentsTable() {
  const { data, loading, error, create, update, remove } = useCrud('/appointments');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchData('/patients').then(setPatients);
    fetchData('/doctors').then(setDoctors);
  }, []);

  const fields = [
    { name: 'patient_id', label: 'Пациент', type: 'select', required: true,
      options: patients.map(p => ({ value: p.id, label: `${p.last_name} ${p.first_name}` })) },
    { name: 'doctor_id', label: 'Врач', type: 'select', required: true,
      options: doctors.map(d => ({ value: d.id, label: `${d.last_name} ${d.first_name}` })) },
    { name: 'scheduled_at', label: 'Дата и время', type: 'datetime-local', required: true },
    { name: 'status', label: 'Статус', type: 'select', required: true, options: [
      { value: 'scheduled', label: 'Запланирован' },
      { value: 'confirmed', label: 'Подтверждён' },
      { value: 'in_progress', label: 'Идёт приём' },
      { value: 'completed', label: 'Завершён' },
      { value: 'cancelled', label: 'Отменён' },
      { value: 'no_show', label: 'Неявка' },
    ]},
    { name: 'purpose', label: 'Цель визита', type: 'textarea' },
  ];

  const handleAdd = () => { setEditItem(null); setShowForm(true); };
  const handleEdit = (item) => {
    setEditItem({
      ...item,
      scheduled_at: item.scheduled_at?.replace('T', 'T').slice(0, 16)
    });
    setShowForm(true);
  };
  const handleDelete = (id) => { setDeleteId(id); setShowDelete(true); };

  const handleSubmit = async (formData) => {
    if (editItem) {
      await update(editItem.id, formData);
    } else {
      await create(formData);
    }
  };

  const confirmDelete = async () => {
    await remove(deleteId);
    setShowDelete(false);
  };

  const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString('ru-RU');

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Приёмы</h2>
        <Button variant="success" onClick={handleAdd}>+ Записать на приём</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Дата и время</th>
            <th>Пациент</th>
            <th>Врач</th>
            <th>Статус</th>
            <th>Цель визита</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{formatDateTime(row.scheduled_at)}</td>
              <td>{row.patient_name}</td>
              <td>{row.doctor_name}</td>
              <td><Badge bg={statusVariant[row.status]}>{statusLabel[row.status]}</Badge></td>
              <td>{row.purpose}</td>
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

      <FormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        title={editItem ? 'Редактировать приём' : 'Записать на приём'}
        fields={fields}
        initialData={editItem || { status: 'scheduled' }}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="Удалить запись"
        message="Вы уверены, что хотите удалить эту запись на приём?"
      />
    </>
  );
}

export default AppointmentsTable;
