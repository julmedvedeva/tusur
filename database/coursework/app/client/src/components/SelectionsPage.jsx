import { useState } from 'react';
import { Card, Button, Table, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { fetchData } from '../api';

const SELECTIONS = [
  {
    id: 'patients-without-policy',
    title: 'Пациенты без полиса ОМС',
    description: 'Список пациентов, у которых не заполнен полис обязательного медицинского страхования',
    endpoint: '/selections/patients-without-policy',
    type: 'patients'
  },
  {
    id: 'appointments-today',
    title: 'Приёмы на сегодня',
    description: 'Все запланированные приёмы на текущую дату',
    endpoint: '/selections/appointments-today',
    type: 'appointments'
  },
  {
    id: 'no-shows-month',
    title: 'Неявки за месяц',
    description: 'Пациенты, которые не явились на приём за последние 30 дней',
    endpoint: '/selections/no-shows-month',
    type: 'appointments'
  }
];

function SelectionsPage() {
  const [activeSelection, setActiveSelection] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelect = async (selection) => {
    setActiveSelection(selection);
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData(selection.endpoint);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveSelection(null);
    setData([]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('ru-RU');
  };

  const formatGender = (gender) => gender === 'male' ? 'М' : 'Ж';

  const statusLabels = {
    'scheduled': { label: 'Запланирован', variant: 'primary' },
    'completed': { label: 'Завершён', variant: 'success' },
    'cancelled': { label: 'Отменён', variant: 'secondary' },
    'no_show': { label: 'Неявка', variant: 'danger' }
  };

  const renderPatientsTable = () => (
    <Table striped bordered hover responsive size="sm">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>ФИО</th>
          <th>Дата рожд.</th>
          <th>Пол</th>
          <th>Телефон</th>
          <th>СНИЛС</th>
          <th>Полис ОМС</th>
          <th>Адрес</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.last_name} {row.first_name} {row.patronymic}</td>
            <td>{formatDate(row.date_of_birth)}</td>
            <td>{formatGender(row.gender)}</td>
            <td>{row.phone_number}</td>
            <td>{row.snils}</td>
            <td>{row.insurance_policy || <span className="text-danger">—</span>}</td>
            <td>{row.town}, {row.street}, д.{row.building}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderAppointmentsTable = () => (
    <Table striped bordered hover responsive size="sm">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Дата и время</th>
          <th>Пациент</th>
          <th>Врач</th>
          <th>Цель визита</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{formatDateTime(row.scheduled_at)}</td>
            <td>{row.patient_name}</td>
            <td>{row.doctor_name}</td>
            <td>{row.purpose}</td>
            <td>
              <Badge bg={statusLabels[row.status]?.variant || 'secondary'}>
                {statusLabels[row.status]?.label || row.status}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  if (activeSelection) {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Button variant="outline-secondary" onClick={handleBack} className="me-3">
              ← Назад
            </Button>
            <span className="h4">{activeSelection.title}</span>
            <Badge bg="info" className="ms-2">{data.length}</Badge>
          </div>
        </div>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && data.length === 0 && (
          <Alert variant="info">Нет данных по выбранным критериям</Alert>
        )}

        {!loading && !error && data.length > 0 && (
          activeSelection.type === 'patients' ? renderPatientsTable() : renderAppointmentsTable()
        )}
      </>
    );
  }

  return (
    <>
      <h2 className="mb-4">Выборки</h2>
      <Row>
        {SELECTIONS.map(selection => (
          <Col key={selection.id} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{selection.title}</Card.Title>
                <Card.Text className="text-muted">
                  {selection.description}
                </Card.Text>
                <Button variant="primary" onClick={() => handleSelect(selection)}>
                  Показать
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default SelectionsPage;
