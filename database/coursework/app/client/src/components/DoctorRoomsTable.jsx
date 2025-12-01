import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import { fetchData } from '../api';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

const dayLabel = {
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота',
  7: 'Воскресенье'
};

const dayOptions = Object.entries(dayLabel).map(([value, label]) => ({ value: Number(value), label }));

function DoctorRoomsTable() {
  const { data, loading, error, create, update, remove } = useCrud('/doctor-rooms');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchData('/doctors').then(setDoctors);
    fetchData('/rooms').then(setRooms);
  }, []);

  const fields = [
    { name: 'doctor_id', label: 'Врач', type: 'select', required: true,
      options: doctors.map(d => ({ value: d.id, label: `${d.last_name} ${d.first_name}` })) },
    { name: 'room_id', label: 'Кабинет', type: 'select', required: true,
      options: rooms.map(r => ({ value: r.id, label: `№${r.number} (этаж ${r.floor || '-'})` })) },
    { name: 'day_of_week', label: 'День недели', type: 'select', required: true, options: dayOptions },
    { name: 'start_time', label: 'Начало смены', type: 'time', required: true },
    { name: 'end_time', label: 'Конец смены', type: 'time', required: true },
  ];

  const handleAdd = () => { setEditItem(null); setShowForm(true); };
  const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
  const handleDelete = (id) => { setDeleteId(id); setShowDelete(true); };

  const handleSubmit = async (formData) => {
    // Валидация: конец смены должен быть позже начала
    if (formData.end_time <= formData.start_time) {
      throw new Error('Время окончания должно быть позже времени начала');
    }
    if (editItem) await update(editItem.id, formData);
    else await create(formData);
  };

  const confirmDelete = async () => { await remove(deleteId); setShowDelete(false); };

  const formatTime = (time) => time?.slice(0, 5) || '';

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Расписание врачей</h2>
        <Button variant="success" onClick={handleAdd}>+ Добавить расписание</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Врач</th>
            <th>Кабинет</th>
            <th>День недели</th>
            <th>Время</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.doctor_name}</td>
              <td><Badge bg="info">№{row.room_number}</Badge></td>
              <td>{dayLabel[row.day_of_week]}</td>
              <td>{formatTime(row.start_time)} - {formatTime(row.end_time)}</td>
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
        title={editItem ? 'Редактировать расписание' : 'Добавить расписание'}
        fields={fields} initialData={editItem || { day_of_week: 1 }} onSubmit={handleSubmit} />

      <ConfirmModal show={showDelete} onHide={() => setShowDelete(false)}
        onConfirm={confirmDelete} title="Удалить расписание"
        message="Вы уверены, что хотите удалить это расписание?" />
    </>
  );
}

export default DoctorRoomsTable;
