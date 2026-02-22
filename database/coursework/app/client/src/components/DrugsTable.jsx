import { useState } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

const fields = [
  { name: 'code', label: 'Код', required: true, placeholder: 'IBU' },
  { name: 'name', label: 'Название', required: true },
];

function DrugsTable() {
  const { data, loading, error, create, update, remove } = useCrud('/drugs');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

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
        <h2>Лекарства</h2>
        <Button variant="success" onClick={handleAdd}>+ Добавить лекарство</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Код</th>
            <th>Название</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td><code>{row.code}</code></td>
              <td>{row.name}</td>
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
        title={editItem ? 'Редактировать лекарство' : 'Добавить лекарство'}
        fields={fields} initialData={editItem || {}} onSubmit={handleSubmit} />

      <ConfirmModal
        show={showDelete}
        onHide={() => { setShowDelete(false); setDeleteError(null); }}
        onConfirm={confirmDelete}
        title="Удалить лекарство"
        message="Вы уверены, что хотите удалить это лекарство?"
        error={deleteError}
      />
    </>
  );
}

export default DrugsTable;
