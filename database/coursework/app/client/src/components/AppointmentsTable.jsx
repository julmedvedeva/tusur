import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup, Badge, Card, Form, Row, Col } from 'react-bootstrap';
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
  const { data, loading, error, create, update, remove, applyFilters } = useCrud('/appointments');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState({
    status: '',
    doctor_id: '',
    patient_id: '',
    date_from: '',
    date_to: '',
    today: ''
  });

  useEffect(() => {
    fetchData('/patients').then(setPatients);
    fetchData('/doctors').then(setDoctors);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    applyFilters(filterValues);
  };

  const handleResetFilters = () => {
    const empty = { status: '', doctor_id: '', patient_id: '', date_from: '', date_to: '', today: '' };
    setFilterValues(empty);
    applyFilters(empty);
  };

  const activeFiltersCount = Object.values(filterValues).filter(v => v !== '').length;

  const fields = [
    { name: 'patient_id', label: 'Пациент', type: 'select', required: true,
      options: patients.map(p => ({ value: p.id, label: `${p.last_name} ${p.first_name}` })) },
    { name: 'doctor_id', label: 'Врач', type: 'select', required: true,
      options: doctors.map(d => ({ value: d.id, label: `${d.last_name} ${d.first_name}` })) },
    { name: 'scheduled_at', label: 'Дата и время', type: 'datetime-local', required: true },
    { name: 'status', label: 'Статус', type: 'custom-select', required: true, options: [
      { value: 'scheduled',   label: '', badgeLabel: 'Запланирован', badgeVariant: statusVariant.scheduled },
      { value: 'confirmed',   label: '', badgeLabel: 'Подтверждён',  badgeVariant: statusVariant.confirmed },
      { value: 'in_progress', label: '', badgeLabel: 'Идёт приём',   badgeVariant: statusVariant.in_progress },
      { value: 'completed',   label: '', badgeLabel: 'Завершён',     badgeVariant: statusVariant.completed },
      { value: 'cancelled',   label: '', badgeLabel: 'Отменён',      badgeVariant: statusVariant.cancelled },
      { value: 'no_show',     label: '', badgeLabel: 'Неявка',       badgeVariant: statusVariant.no_show },
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
        <div>
          <Button
            variant={activeFiltersCount > 0 ? "info" : "outline-info"}
            className="me-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          <Button variant="success" onClick={handleAdd}>+ Записать на приём</Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-3">
          <Card.Body>
            <Row>
              <Col md={2}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Статус</Form.Label>
                  <Form.Select size="sm" name="status" value={filterValues.status} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    <option value="scheduled">Запланирован</option>
                    <option value="confirmed">Подтверждён</option>
                    <option value="in_progress">Идёт приём</option>
                    <option value="completed">Завершён</option>
                    <option value="cancelled">Отменён</option>
                    <option value="no_show">Неявка</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Врач</Form.Label>
                  <Form.Select size="sm" name="doctor_id" value={filterValues.doctor_id} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.last_name} {d.first_name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Пациент</Form.Label>
                  <Form.Select size="sm" name="patient_id" value={filterValues.patient_id} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.last_name} {p.first_name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Дата с</Form.Label>
                  <Form.Control size="sm" type="date" name="date_from" value={filterValues.date_from} onChange={handleFilterChange} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Дата по</Form.Label>
                  <Form.Control size="sm" type="date" name="date_to" value={filterValues.date_to} onChange={handleFilterChange} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Только сегодня</Form.Label>
                  <Form.Select size="sm" name="today" value={filterValues.today} onChange={handleFilterChange}>
                    <option value="">Нет</option>
                    <option value="yes">Да</option>
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
