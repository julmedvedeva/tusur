import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup, Card, Form, Row, Col } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import { fetchData } from '../api';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';
import PatientVisitsReportModal from './PatientVisitsReportModal';

function PatientsTable() {
  const { data, loading, error, create, update, remove, applyFilters } = useCrud('/patients');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [towns, setTowns] = useState([]);
  const [streets, setStreets] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterValues, setFilterValues] = useState({
    search: '',
    gender: '',
    town_id: '',
    age_from: '',
    age_to: '',
    has_policy: '',
    has_snils: ''
  });

  useEffect(() => {
    fetchData('/countries').then(setCountries);
    fetchData('/towns').then(setTowns);
    fetchData('/streets').then(setStreets);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    applyFilters(filterValues);
  };

  const handleResetFilters = () => {
    const empty = { search: '', gender: '', town_id: '', age_from: '', age_to: '', has_policy: '', has_snils: '' };
    setFilterValues(empty);
    applyFilters(empty);
  };

  const activeFiltersCount = Object.values(filterValues).filter(v => v !== '').length;

  const today = new Date().toISOString().split('T')[0];

  const fields = [
    { name: 'last_name', label: 'Фамилия', required: true },
    { name: 'first_name', label: 'Имя', required: true },
    { name: 'patronymic', label: 'Отчество' },
    { name: 'date_of_birth', label: 'Дата рождения', type: 'date', required: true, max: today },
    { name: 'gender', label: 'Пол', type: 'select', required: true, options: [
      { value: 'male', label: 'Мужской' },
      { value: 'female', label: 'Женский' },
    ]},
    { name: 'phone_number', label: 'Телефон', mask: 'phone' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'snils', label: 'СНИЛС', mask: 'snils' },
    { name: 'insurance_policy', label: 'Полис ОМС' },
    { name: 'country_id', label: 'Страна', type: 'select', required: true,
      options: countries.map(c => ({ value: c.id, label: c.name })) },
    { name: 'town_id', label: 'Город', type: 'select', required: true,
      options: towns.map(t => ({ value: t.id, label: t.name })) },
    { name: 'street_id', label: 'Улица', type: 'select', required: true,
      options: streets.map(s => ({ value: s.id, label: s.name })) },
    { name: 'building', label: 'Дом', required: true },
    { name: 'apartment_number', label: 'Квартира' },
    { name: 'zipcode', label: 'Индекс' },
  ];

  const handleAdd = () => { setEditItem(null); setShowForm(true); };
  const handleEdit = (item) => {
    setEditItem({
      ...item,
      date_of_birth: item.date_of_birth?.split('T')[0]
    });
    setShowForm(true);
  };
  const handleDelete = (id) => { setDeleteId(id); setDeleteError(null); setShowDelete(true); };

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

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ru-RU');
  const formatGender = (gender) => gender === 'male' ? 'М' : 'Ж';
  const formatSnils = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 11);
    let result = digits.slice(0, 3);
    if (digits.length > 3) result += '-' + digits.slice(3, 6);
    if (digits.length > 6) result += '-' + digits.slice(6, 9);
    if (digits.length > 9) result += ' ' + digits.slice(9, 11);
    return result;
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
        <h2>Пациенты</h2>
        <div>
          <Button
            variant={activeFiltersCount > 0 ? "info" : "outline-info"}
            className="me-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          <Button variant="outline-info" className="me-2" onClick={() => setShowReport(true)}>
            Отчёт по посещениям
          </Button>
          <Button variant="outline-secondary" className="me-2" href="/api/export/patients" download>
            Скачать CSV
          </Button>
          <Button variant="success" onClick={handleAdd}>+ Добавить пациента</Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-3">
          <Card.Body>
            <Row>
              <Col md={3}>
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
              <Col md={2}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Пол</Form.Label>
                  <Form.Select size="sm" name="gender" value={filterValues.gender} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Город</Form.Label>
                  <Form.Select size="sm" name="town_id" value={filterValues.town_id} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    {towns.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={1}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Возраст от</Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    name="age_from"
                    value={filterValues.age_from}
                    onChange={handleFilterChange}
                    min="0"
                    max="150"
                  />
                </Form.Group>
              </Col>
              <Col md={1}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">до</Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    name="age_to"
                    value={filterValues.age_to}
                    onChange={handleFilterChange}
                    min="0"
                    max="150"
                  />
                </Form.Group>
              </Col>
              <Col md={1}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">Полис</Form.Label>
                  <Form.Select size="sm" name="has_policy" value={filterValues.has_policy} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    <option value="yes">Есть</option>
                    <option value="no">Нет</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={1}>
                <Form.Group className="mb-2">
                  <Form.Label size="sm">СНИЛС</Form.Label>
                  <Form.Select size="sm" name="has_snils" value={filterValues.has_snils} onChange={handleFilterChange}>
                    <option value="">Все</option>
                    <option value="yes">Есть</option>
                    <option value="no">Нет</option>
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

      <Table striped bordered hover responsive size="sm">
        <thead className="table-dark">
          <tr>
            <th
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            >
              ID {sortOrder === 'asc' ? '↑' : '↓'}
            </th>
            <th>ФИО</th>
            <th>Дата рожд.</th>
            <th>Пол</th>
            <th>Телефон</th>
            <th>СНИЛС</th>
            <th>Полис ОМС</th>
            <th>Адрес</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {[...data].sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id).map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.last_name} {row.first_name} {row.patronymic}</td>
              <td>{formatDate(row.date_of_birth)}</td>
              <td>{formatGender(row.gender)}</td>
              <td>{formatPhone(row.phone_number)}</td>
              <td>{formatSnils(row.snils)}</td>
              <td>{row.insurance_policy}</td>
              <td>{row.town}, {row.street}, д.{row.building}{row.apartment_number ? `, кв.${row.apartment_number}` : ''}</td>
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
        title={editItem ? 'Редактировать пациента' : 'Добавить пациента'}
        fields={fields}
        initialData={editItem || { country_id: 1, town_id: 1, street_id: 1 }}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={showDelete}
        onHide={() => { setShowDelete(false); setDeleteError(null); }}
        onConfirm={confirmDelete}
        title="Удалить пациента"
        message="Вы уверены, что хотите удалить этого пациента?"
        error={deleteError}
      />

      <PatientVisitsReportModal
        show={showReport}
        onHide={() => setShowReport(false)}
      />
    </>
  );
}

export default PatientsTable;
