import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup, Card, Form, Row, Col } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import { fetchData } from '../api';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

const fields = [
  { name: 'last_name', label: 'Фамилия', required: true },
  { name: 'first_name', label: 'Имя', required: true },
  { name: 'patronymic', label: 'Отчество' },
  { name: 'phone_number', label: 'Телефон', mask: 'phone' },
  { name: 'email', label: 'Email', type: 'email' },
];

function DoctorsTable() {
  const { data, loading, error, create, update, remove, applyFilters } = useCrud('/doctors');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [specialties, setSpecialties] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState({
    search: '',
    specialty_id: '',
    has_specialty: ''
  });

  useEffect(() => {
    fetchData('/specialties').then(setSpecialties);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    applyFilters(filterValues);
  };

  const handleResetFilters = () => {
    const empty = { search: '', specialty_id: '', has_specialty: '' };
    setFilterValues(empty);
    applyFilters(empty);
  };

  const activeFiltersCount = Object.values(filterValues).filter(v => v !== '').length;

  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteError(null);
    setShowDelete(true);
  };

  const handleSubmit = async (formData) => {
    if (editItem) {
      await update(editItem.id, formData);
    } else {
      await create(formData);
    }
  };

  const confirmDelete = async () => {
    try {
      await remove(deleteId);
      setShowDelete(false);
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  const formatPhone = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    let result = '+' + digits.slice(0, 1);
    if (digits.length > 1) result += '-' + digits.slice(1, 4);
    if (digits.length > 4) result += '-' + digits.slice(4, 7);
    if (digits.length > 7) result += '-' + digits.slice(7, 9);
    if (digits.length > 9) result += '-' + digits.slice(9, 11);
    return result;
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Врачи</h2>
        <div>
          <Button
            variant={activeFiltersCount > 0 ? "info" : "outline-info"}
            className="me-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          <Button variant="outline-secondary" className="me-2" href="/api/export/doctors" download>
            Скачать CSV
          </Button>
          <Button variant="success" onClick={handleAdd}>+ Добавить врача</Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-3">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Поиск по ФИО</Form.Label>
                  <Form.Control
                    size="sm"
                    name="search"
                    value={filterValues.search}
                    onChange={handleFilterChange}
                    placeholder="Введите имя или фамилию"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Специальность</Form.Label>
                  <Form.Select size="sm" name="specialty_id" value={filterValues.specialty_id} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Наличие специальности</Form.Label>
                  <Form.Select size="sm" name="has_specialty" value={filterValues.has_specialty} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    <option value="yes">Есть специальность</option>
                    <option value="no">Без специальности</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-2">
              <Button size="sm" variant="primary" onClick={handleApplyFilters} className="me-2">
                Применить
              </Button>
              <Button size="sm" variant="outline-secondary" onClick={handleResetFilters}>
                Сбросить
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            >
              ID {sortOrder === 'asc' ? '↑' : '↓'}
            </th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Специальности</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {[...data].sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id).map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.last_name}</td>
              <td>{row.first_name}</td>
              <td>{row.patronymic}</td>
              <td>{formatPhone(row.phone_number)}</td>
              <td>{row.email}</td>
              <td>{row.specialties}</td>
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
        title={editItem ? 'Редактировать врача' : 'Добавить врача'}
        fields={fields}
        initialData={editItem || {}}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={showDelete}
        onHide={() => { setShowDelete(false); setDeleteError(null); }}
        onConfirm={confirmDelete}
        title="Удалить врача"
        message="Вы уверены, что хотите удалить этого врача?"
        error={deleteError}
      />
    </>
  );
}

export default DoctorsTable;
