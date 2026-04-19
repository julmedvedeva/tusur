import { useState } from 'react';
import { Card, Button, Table, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { fetchData } from '../api';

const SELECTIONS = [
  {
    id: 'patients-without-policy',
    title: 'Пациенты без полиса ОМС',
    description: 'Список пациентов, у которых не заполнен полис обязательного медицинского страхования',
    endpoint: '/selections/patients-without-policy',
    type: 'patients',
    csvFilename: 'patients_without_policy.csv'
  },
  {
    id: 'appointments-today',
    title: 'Приёмы на сегодня',
    description: 'Все запланированные приёмы на текущую дату',
    endpoint: '/selections/appointments-today',
    type: 'appointments',
    csvFilename: 'appointments_today.csv'
  },
  {
    id: 'no-shows-month',
    title: 'Неявки за месяц',
    description: 'Пациенты, которые не явились на приём за последние 30 дней',
    endpoint: '/selections/no-shows-month',
    type: 'appointments',
    csvFilename: 'no_shows_month.csv'
  },
  {
    id: 'doctors-workload',
    title: 'Нагрузка по врачам',
    description: 'Статистика приёмов по каждому врачу: всего, завершено, отменено, неявок',
    endpoint: '/stats/doctors-workload',
    type: 'stats-doctors',
    csvFilename: 'doctors_workload.csv'
  },
  {
    id: 'diagnoses-stats',
    title: 'Популярные диагнозы',
    description: 'Топ-20 наиболее часто встречающихся диагнозов в медицинских записях',
    endpoint: '/stats/diagnoses',
    type: 'stats-diagnoses',
    csvFilename: 'diagnoses_stats.csv'
  },
  {
    id: 'procedures-stats',
    title: 'Популярные процедуры',
    description: 'Топ-20 наиболее часто назначаемых процедур с общим количеством',
    endpoint: '/stats/procedures',
    type: 'stats-procedures',
    csvFilename: 'procedures_stats.csv'
  }
];

const STATUS_LABELS = {
  scheduled:   { label: 'Запланирован', variant: 'primary' },
  confirmed:   { label: 'Подтверждён',  variant: 'info' },
  in_progress: { label: 'Идёт приём',   variant: 'warning' },
  completed:   { label: 'Завершён',     variant: 'success' },
  cancelled:   { label: 'Отменён',      variant: 'secondary' },
  no_show:     { label: 'Неявка',       variant: 'danger' }
};

function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(filename, title, headers, rows) {
  const lines = [
    escapeCsv(title),
    `Дата формирования: ${new Date().toLocaleString('ru-RU')}`,
    '',
    headers.join(';'),
    ...rows.map(r => r.map(escapeCsv).join(';'))
  ];
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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

  const handlePrint = () => window.print();

  const handleExportCsv = () => {
    if (!activeSelection || data.length === 0) return;
    const { type, csvFilename, title } = activeSelection;
    let headers, rows;

    if (type === 'patients') {
      headers = ['ID', 'Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Пол', 'Телефон', 'СНИЛС', 'Полис ОМС', 'Адрес'];
      rows = data.map(r => [
        r.id, r.last_name, r.first_name, r.patronymic,
        r.date_of_birth ? new Date(r.date_of_birth).toLocaleDateString('ru-RU') : '',
        r.gender === 'male' ? 'Мужской' : 'Женский',
        r.phone_number, r.snils, r.insurance_policy,
        [r.town, r.street, r.building ? 'д.' + r.building : ''].filter(Boolean).join(', ')
      ]);
    } else if (type === 'appointments') {
      headers = ['ID', 'Дата и время', 'Пациент', 'Врач', 'Цель визита', 'Статус'];
      rows = data.map(r => [
        r.id,
        r.scheduled_at ? new Date(r.scheduled_at).toLocaleString('ru-RU') : '',
        r.patient_name, r.doctor_name, r.purpose,
        STATUS_LABELS[r.status]?.label || r.status
      ]);
    } else if (type === 'stats-doctors') {
      headers = ['Врач', 'Всего приёмов', 'Завершено', 'Отменено', 'Неявок'];
      rows = data.map(r => [
        `${r.last_name} ${r.first_name}`,
        r.total_appointments, r.completed, r.cancelled, r.no_show
      ]);
    } else if (type === 'stats-diagnoses') {
      headers = ['Код МКБ-10', 'Название диагноза', 'Количество случаев'];
      rows = data.map(r => [r.code, r.name, r.count]);
    } else if (type === 'stats-procedures') {
      headers = ['Код', 'Название процедуры', 'Кол-во назначений', 'Итого процедур'];
      rows = data.map(r => [r.code, r.name, r.prescriptions_count, r.total_quantity]);
    }

    if (headers && rows) downloadCsv(csvFilename, title, headers, rows);
  };

  const renderPatientsTable = () => (
    <Table striped bordered hover responsive size="sm">
      <thead className="table-dark">
        <tr>
          <th>ID</th><th>ФИО</th><th>Дата рожд.</th><th>Пол</th>
          <th>Телефон</th><th>СНИЛС</th><th>Полис ОМС</th><th>Адрес</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.last_name} {row.first_name} {row.patronymic}</td>
            <td>{row.date_of_birth ? new Date(row.date_of_birth).toLocaleDateString('ru-RU') : ''}</td>
            <td>{row.gender === 'male' ? 'М' : 'Ж'}</td>
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
          <th>ID</th><th>Дата и время</th><th>Пациент</th>
          <th>Врач</th><th>Цель визита</th><th>Статус</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.scheduled_at ? new Date(row.scheduled_at).toLocaleString('ru-RU') : ''}</td>
            <td>{row.patient_name}</td>
            <td>{row.doctor_name}</td>
            <td>{row.purpose}</td>
            <td>
              <Badge bg={STATUS_LABELS[row.status]?.variant || 'secondary'}>
                {STATUS_LABELS[row.status]?.label || row.status}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderStatsDoctorsTable = () => (
    <Table striped bordered hover responsive size="sm">
      <thead className="table-dark">
        <tr>
          <th>Врач</th>
          <th className="text-center">Всего приёмов</th>
          <th className="text-center">Завершено</th>
          <th className="text-center">Отменено</th>
          <th className="text-center">Неявок</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.last_name} {row.first_name}</td>
            <td className="text-center"><Badge bg="primary">{row.total_appointments}</Badge></td>
            <td className="text-center"><Badge bg="success">{row.completed}</Badge></td>
            <td className="text-center"><Badge bg="secondary">{row.cancelled}</Badge></td>
            <td className="text-center"><Badge bg="danger">{row.no_show}</Badge></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderStatsDiagnosesTable = () => (
    <Table striped bordered hover responsive size="sm">
      <thead className="table-dark">
        <tr>
          <th>Код МКБ-10</th>
          <th>Название диагноза</th>
          <th className="text-center">Кол-во случаев</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td><code>{row.code}</code></td>
            <td>{row.name}</td>
            <td className="text-center"><Badge bg="info">{row.count}</Badge></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderStatsProceduresTable = () => (
    <Table striped bordered hover responsive size="sm">
      <thead className="table-dark">
        <tr>
          <th>Код</th>
          <th>Название процедуры</th>
          <th className="text-center">Кол-во назначений</th>
          <th className="text-center">Итого процедур</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td><code>{row.code}</code></td>
            <td>{row.name}</td>
            <td className="text-center"><Badge bg="info">{row.prescriptions_count}</Badge></td>
            <td className="text-center"><Badge bg="primary">{row.total_quantity}</Badge></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderTable = () => {
    switch (activeSelection?.type) {
      case 'patients':         return renderPatientsTable();
      case 'appointments':     return renderAppointmentsTable();
      case 'stats-doctors':    return renderStatsDoctorsTable();
      case 'stats-diagnoses':  return renderStatsDiagnosesTable();
      case 'stats-procedures': return renderStatsProceduresTable();
      default: return null;
    }
  };

  if (activeSelection) {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3 no-print">
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={handleBack}>
              ← Назад
            </Button>
            <Button variant="outline-success" onClick={handleExportCsv} disabled={data.length === 0}>
              ↓ Экспорт CSV
            </Button>
            <Button variant="outline-dark" onClick={handlePrint} disabled={data.length === 0}>
              🖨 Печать
            </Button>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="h5 mb-0">{activeSelection.title}</span>
            <Badge bg="info">{data.length}</Badge>
          </div>
        </div>

        <div className="print-header">
          <h4>{activeSelection.title}</h4>
          <p className="text-muted">Дата формирования: {new Date().toLocaleString('ru-RU')}</p>
          <hr />
        </div>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && data.length === 0 && (
          <Alert variant="info">Нет данных по выбранным критериям</Alert>
        )}

        {!loading && !error && data.length > 0 && renderTable()}
      </>
    );
  }

  return (
    <>
      <h2 className="mb-4">Выборки и отчёты</h2>
      <Row>
        {SELECTIONS.map(selection => (
          <Col key={selection.id} md={4} className="mb-3">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{selection.title}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
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
