import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import { fetchData } from '../api';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

function AnalysesTable() {
  const { data, loading, error, create, update, remove } = useCrud('/analyses');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [analysesCatalog, setAnalysesCatalog] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    fetchData('/analyses-catalog').then(setAnalysesCatalog);
    fetchData('/appointments').then(setAppointments);
    fetchData('/diagnoses').then(setDiagnoses);
  }, []);

  const fields = [
    { name: 'analysis_catalog_id', label: 'Тип анализа', type: 'select', required: true,
      options: analysesCatalog.map(a => ({ value: a.id, label: `${a.code} - ${a.name}` })) },
    { name: 'appointment_id', label: 'Приём', type: 'select', required: true,
      options: appointments.map(a => ({ value: a.id, label: `#${a.id} - ${a.patient_name} (${new Date(a.scheduled_at).toLocaleDateString('ru-RU')})` })) },
    { name: 'diagnosis_id', label: 'Диагноз', type: 'select',
      options: diagnoses.map(d => ({ value: d.id, label: `${d.code} - ${d.name}` })) },
    { name: 'scheduled_at', label: 'Дата назначения', type: 'datetime-local', required: true },
    { name: 'completed_at', label: 'Дата выполнения', type: 'datetime-local' },
    { name: 'result', label: 'Результат', type: 'textarea' },
  ];

  const handleAdd = () => { setEditItem(null); setShowForm(true); };
  const handleEdit = (item) => {
    setEditItem({
      ...item,
      scheduled_at: item.scheduled_at?.slice(0, 16),
      completed_at: item.completed_at?.slice(0, 16) || ''
    });
    setShowForm(true);
  };
  const handleDelete = (id) => { setDeleteId(id); setShowDelete(true); };

  const handleSubmit = async (formData) => {
    // Валидация: дата выполнения не раньше даты назначения
    if (formData.completed_at && formData.scheduled_at) {
      if (new Date(formData.completed_at) < new Date(formData.scheduled_at)) {
        throw new Error('Дата выполнения не может быть раньше даты назначения');
      }
    }
    // Очистить пустые значения
    const cleanData = { ...formData };
    if (!cleanData.completed_at) delete cleanData.completed_at;
    if (!cleanData.diagnosis_id) delete cleanData.diagnosis_id;

    if (editItem) await update(editItem.id, cleanData);
    else await create(cleanData);
  };

  const confirmDelete = async () => { await remove(deleteId); setShowDelete(false); };

  const formatDateTime = (dateStr) => dateStr ? new Date(dateStr).toLocaleString('ru-RU') : '-';

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Анализы пациентов</h2>
        <Button variant="success" onClick={handleAdd}>+ Назначить анализ</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Анализ</th>
            <th>Пациент</th>
            <th>Назначен</th>
            <th>Выполнен</th>
            <th>Статус</th>
            <th>Результат</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td><code>{row.analysis_code}</code> {row.analysis_name}</td>
              <td>{row.patient_name}</td>
              <td>{formatDateTime(row.scheduled_at)}</td>
              <td>{formatDateTime(row.completed_at)}</td>
              <td>
                {row.completed_at ? (
                  <Badge bg="success">Выполнен</Badge>
                ) : (
                  <Badge bg="warning">Ожидает</Badge>
                )}
              </td>
              <td style={{ maxWidth: '200px' }}>{row.result || '-'}</td>
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
        title={editItem ? 'Редактировать анализ' : 'Назначить анализ'}
        fields={fields} initialData={editItem || {}} onSubmit={handleSubmit} />

      <ConfirmModal show={showDelete} onHide={() => setShowDelete(false)}
        onConfirm={confirmDelete} title="Удалить анализ"
        message="Вы уверены, что хотите удалить этот анализ?" />
    </>
  );
}

export default AnalysesTable;
