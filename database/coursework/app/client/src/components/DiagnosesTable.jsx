import { useState } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

const fields = [
  { name: 'code', label: 'Код МКБ-10', required: true, placeholder: 'J06.9' },
  { name: 'name', label: 'Название', required: true },
  { name: 'description', label: 'Описание', type: 'textarea' },
];

function DiagnosesTable() {
  const { data, loading, error, create, update, remove } = useCrud('/diagnoses');
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
        <h2>Диагнозы (МКБ-10)</h2>
        <Button variant="success" onClick={handleAdd}>+ Добавить диагноз</Button>
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
            <th>Код</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {[...data].sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id).map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td><code>{row.code}</code></td>
              <td>{row.name}</td>
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
        title={editItem ? 'Редактировать диагноз' : 'Добавить диагноз'}
        fields={fields} initialData={editItem || {}} onSubmit={handleSubmit} />

      <ConfirmModal
        show={showDelete}
        onHide={() => { setShowDelete(false); setDeleteError(null); }}
        onConfirm={confirmDelete}
        title="Удалить диагноз"
        message="Вы уверены, что хотите удалить этот диагноз?"
        error={deleteError}
      />
    </>
  );
}

export default DiagnosesTable;
