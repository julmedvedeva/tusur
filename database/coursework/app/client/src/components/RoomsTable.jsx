import { useState } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

const roomTypeLabel = {
  therapist: 'Терапевтический',
  general_practice: 'Общей практики',
  pediatric: 'Педиатрический',
  specialist: 'Специалист',
  preventive_checkup: 'Профосмотр',
  laboratory: 'Лаборатория',
  functional_diagnostics: 'Функц. диагностика',
  xray: 'Рентген',
  ultrasound: 'УЗИ',
  procedure: 'Процедурный',
  vaccination: 'Прививочный',
  dressing: 'Перевязочная',
  physiotherapy: 'Физиотерапия',
  dental: 'Стоматология',
  emergency: 'Неотложная помощь',
  administrative: 'Административный'
};

const roomTypeOptions = Object.entries(roomTypeLabel).map(([value, label]) => ({ value, label }));

const fields = [
  { name: 'number', label: 'Номер кабинета', required: true },
  { name: 'floor', label: 'Этаж', type: 'number', min: 1 },
  { name: 'room_type', label: 'Тип', type: 'select', required: true, options: roomTypeOptions },
  { name: 'description', label: 'Описание', type: 'textarea' },
];

function RoomsTable() {
  const { data, loading, error, create, update, remove } = useCrud('/rooms');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const handleAdd = () => { setEditItem(null); setShowForm(true); };
  const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
  const handleDelete = (id) => { setDeleteId(id); setDeleteError(null); setShowDelete(true); };

  const handleSubmit = async (formData) => {
    if (editItem) await update(editItem.id, formData);
    else await create(formData);
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
        <h2>Кабинеты</h2>
        <Button variant="success" onClick={handleAdd}>+ Добавить кабинет</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            >
              ID {sortOrder === 'asc' ? '↑' : '↓'}
            </th>
            <th>Номер</th>
            <th>Этаж</th>
            <th>Тип</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {[...data].sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id).map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td><strong>{row.number}</strong></td>
              <td>{row.floor}</td>
              <td><Badge bg="secondary">{roomTypeLabel[row.room_type]}</Badge></td>
              <td>{row.description}</td>
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
        title={editItem ? 'Редактировать кабинет' : 'Добавить кабинет'}
        fields={fields} initialData={editItem || {}} onSubmit={handleSubmit} />

      <ConfirmModal
        show={showDelete}
        onHide={() => { setShowDelete(false); setDeleteError(null); }}
        onConfirm={confirmDelete}
        title="Удалить кабинет"
        message="Вы уверены, что хотите удалить этот кабинет?"
        error={deleteError}
      />
    </>
  );
}

export default RoomsTable;
