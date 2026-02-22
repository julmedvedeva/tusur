import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup, Card, Form, Row, Col } from 'react-bootstrap';

const statusLabel = {
  scheduled: 'Запланирован',
  confirmed: 'Подтверждён',
  in_progress: 'Идёт приём',
  completed: 'Завершён',
  cancelled: 'Отменён',
  no_show: 'Неявка'
};

const statusVariant = {
  scheduled: 'primary',
  confirmed: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'secondary',
  no_show: 'danger'
};
import { useCrud } from '../hooks/useCrud';
import { fetchData } from '../api';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

function MedicalRecordsTable() {
  const { data, loading, error, create, update, remove, applyFilters } = useCrud('/medical-records');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState({
    patient_id: '',
    diagnosis_id: '',
    date_from: '',
    date_to: ''
  });

  useEffect(() => {
    fetchData('/patients').then(setPatients);
    fetchData('/diagnoses').then(setDiagnoses);
    fetchData('/appointments').then(setAppointments);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    applyFilters(filterValues);
  };

  const handleResetFilters = () => {
    const empty = { patient_id: '', diagnosis_id: '', date_from: '', date_to: '' };
    setFilterValues(empty);
    applyFilters(empty);
  };

  const activeFiltersCount = Object.values(filterValues).filter(v => v !== '').length;

  const fields = [
    { name: 'appointment_id', label: 'Приём', type: 'custom-select', required: true,
      options: appointments.map(a => ({
        value: a.id,
        label: `#${a.id} - ${a.patient_name} (${new Date(a.scheduled_at).toLocaleDateString('ru-RU')})`,
        badgeLabel: statusLabel[a.status] ?? a.status,
        badgeVariant: statusVariant[a.status] ?? 'secondary'
      })) },
    { name: 'patient_id', label: 'Пациент (заполняется автоматически)', type: 'select', required: true,
      disabled: true,
      derive: {
        from: 'appointment_id',
        using: (appointmentId) => appointments.find(a => String(a.id) === String(appointmentId))?.patient_id
      },
      options: patients.map(p => ({ value: p.id, label: `${p.last_name} ${p.first_name}${p.patronymic ? ' ' + p.patronymic : ''}` })) },
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
        <div>
          <Button
            variant={activeFiltersCount > 0 ? "info" : "outline-info"}
            className="me-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          <Button variant="success" onClick={handleAdd}>+ Добавить запись</Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-3">
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Пациент</Form.Label>
                  <Form.Select size="sm" name="patient_id" value={filterValues.patient_id} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.last_name} {p.first_name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Диагноз</Form.Label>
                  <Form.Select size="sm" name="diagnosis_id" value={filterValues.diagnosis_id} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    {diagnoses.map(d => <option key={d.id} value={d.id}>{d.code} - {d.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Дата с</Form.Label>
                  <Form.Control size="sm" type="date" name="date_from" value={filterValues.date_from} onChange={handleFilterChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Дата по</Form.Label>
                  <Form.Control size="sm" type="date" name="date_to" value={filterValues.date_to} onChange={handleFilterChange} />
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
