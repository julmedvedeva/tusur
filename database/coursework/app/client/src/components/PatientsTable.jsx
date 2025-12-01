import { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, ButtonGroup } from 'react-bootstrap';
import { useCrud } from '../hooks/useCrud';
import { fetchData } from '../api';
import FormModal from './FormModal';
import ConfirmModal from './ConfirmModal';

function PatientsTable() {
  const { data, loading, error, create, update, remove } = useCrud('/patients');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [countries, setCountries] = useState([]);
  const [towns, setTowns] = useState([]);
  const [streets, setStreets] = useState([]);

  useEffect(() => {
    fetchData('/countries').then(setCountries);
    fetchData('/towns').then(setTowns);
    fetchData('/streets').then(setStreets);
  }, []);

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
    { name: 'phone_number', label: 'Телефон' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'snils', label: 'СНИЛС', placeholder: '123-456-789 01' },
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

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ru-RU');
  const formatGender = (gender) => gender === 'male' ? 'М' : 'Ж';

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Пациенты</h2>
        <Button variant="success" onClick={handleAdd}>+ Добавить пациента</Button>
      </div>

      <Table striped bordered hover responsive size="sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Дата рожд.</th>
            <th>Пол</th>
            <th>Телефон</th>
            <th>СНИЛС</th>
            <th>Адрес</th>
            <th>Действия</th>
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
        onHide={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="Удалить пациента"
        message="Вы уверены, что хотите удалить этого пациента?"
      />
    </>
  );
}

export default PatientsTable;
