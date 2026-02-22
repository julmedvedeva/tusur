import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'policlinic',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
});

const app = express();
app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════
// ОБРАБОТКА ОШИБОК БД
// ═══════════════════════════════════════

const errorMessages = {
  // Уникальные ограничения
  'patients_insurance_policy_key': 'Пациент с таким полисом ОМС уже существует',
  'patients_snils_key': 'Пациент с таким СНИЛС уже существует',
  'patients_email_key': 'Пациент с таким email уже существует',
  'doctors_email_key': 'Врач с таким email уже существует',
  'doctors_phone_number_key': 'Врач с таким телефоном уже существует',
  'specialties_name_key': 'Специальность с таким названием уже существует',
  'diagnoses_code_key': 'Диагноз с таким кодом уже существует',
  'rooms_room_number_key': 'Кабинет с таким номером уже существует',
  'analyses_catalog_code_key': 'Анализ с таким кодом уже существует',
  'drugs_name_key': 'Лекарство с таким названием уже существует',
  'procedures_name_key': 'Процедура с таким названием уже существует',
  'countries_name_key': 'Страна с таким названием уже существует',
  'towns_name_key': 'Город с таким названием уже существует',
  'streets_name_key': 'Улица с таким названием уже существует',

  // Внешние ключи
  'patients_country_id_fkey': 'Указанная страна не найдена',
  'patients_town_id_fkey': 'Указанный город не найден',
  'patients_street_id_fkey': 'Указанная улица не найдена',
  'appointments_patient_id_fkey': 'Указанный пациент не найден',
  'appointments_doctor_id_fkey': 'Указанный врач не найден',
  'medical_records_patient_id_fkey': 'Указанный пациент не найден',
  'medical_records_diagnosis_id_fkey': 'Указанный диагноз не найден',
  'medical_records_appointment_id_fkey': 'Указанный приём не найден',
  'doctor_specialties_doctor_id_fkey': 'Указанный врач не найден',
  'doctor_specialties_specialty_id_fkey': 'Указанная специальность не найдена',
  'analyses_analysis_catalog_id_fkey': 'Указанный тип анализа не найден',
  'analyses_appointment_id_fkey': 'Указанный приём не найден',

  // Ограничения на удаление (foreign key violations)
  'appointments_patient_id_fkey_delete': 'Невозможно удалить пациента: есть связанные приёмы',
  'appointments_doctor_id_fkey_delete': 'Невозможно удалить врача: есть связанные приёмы',
  'medical_records_patient_id_fkey_delete': 'Невозможно удалить пациента: есть медицинские записи',
  'doctor_specialties_doctor_id_fkey_delete': 'Невозможно удалить врача: есть связанные специальности',
  'doctor_specialties_specialty_id_fkey_delete': 'Невозможно удалить специальность: она назначена врачам',
};

function translateDbError(err) {
  // Ошибка уникальности (код 23505)
  if (err.code === '23505' && err.constraint) {
    return errorMessages[err.constraint] || `Запись с такими данными уже существует`;
  }

  // Ошибка внешнего ключа при INSERT/UPDATE (код 23503)
  if (err.code === '23503' && err.constraint) {
    // Проверяем, это удаление или вставка/обновление
    if (err.detail && err.detail.includes('still referenced')) {
      const deleteKey = err.constraint + '_delete';
      return errorMessages[deleteKey] || 'Невозможно удалить: есть связанные записи';
    }
    return errorMessages[err.constraint] || 'Связанная запись не найдена';
  }

  // Ошибка NOT NULL (код 23502)
  if (err.code === '23502') {
    const column = err.column;
    const columnNames = {
      'last_name': 'Фамилия',
      'first_name': 'Имя',
      'date_of_birth': 'Дата рождения',
      'gender': 'Пол',
      'patient_id': 'Пациент',
      'doctor_id': 'Врач',
      'scheduled_at': 'Дата и время',
      'diagnosis_id': 'Диагноз',
      'name': 'Название',
      'code': 'Код',
    };
    const fieldName = columnNames[column] || column;
    return `Поле "${fieldName}" обязательно для заполнения`;
  }

  // Ошибка CHECK constraint (код 23514)
  if (err.code === '23514') {
    return 'Данные не прошли проверку. Проверьте корректность введённых значений';
  }

  // Неизвестная ошибка
  return err.message || 'Произошла ошибка при сохранении данных';
}

// ═══════════════════════════════════════
// ВРАЧИ (DOCTORS)
// ═══════════════════════════════════════

app.get('/api/doctors', async (req, res) => {
  try {
    const { search, specialty_id, has_specialty } = req.query;

    let query = `
      SELECT d.id, d.last_name, d.first_name, d.patronymic, d.phone_number, d.email,
             STRING_AGG(s.name, ', ') as specialties,
             ARRAY_AGG(s.id) as specialty_ids
      FROM doctors d
      LEFT JOIN doctor_specialties ds ON d.id = ds.doctor_id
      LEFT JOIN specialties s ON ds.specialty_id = s.id
    `;

    const conditions = [];
    const params = [];

    if (specialty_id) {
      params.push(specialty_id);
      conditions.push(`d.id IN (SELECT doctor_id FROM doctor_specialties WHERE specialty_id = $${params.length})`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(d.last_name ILIKE $${params.length} OR d.first_name ILIKE $${params.length} OR d.patronymic ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY d.id`;

    if (has_specialty === 'yes') {
      query += ` HAVING COUNT(s.id) > 0`;
    } else if (has_specialty === 'no') {
      query += ` HAVING COUNT(s.id) = 0`;
    }

    query += ` ORDER BY d.last_name`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/doctors/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/doctors', async (req, res) => {
  const { last_name, first_name, patronymic, phone_number, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO doctors (last_name, first_name, patronymic, phone_number, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [last_name, first_name, patronymic, phone_number, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/doctors/:id', async (req, res) => {
  const { last_name, first_name, patronymic, phone_number, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE doctors SET last_name = $1, first_name = $2, patronymic = $3, phone_number = $4, email = $5 WHERE id = $6 RETURNING *',
      [last_name, first_name, patronymic, phone_number, email, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/doctors/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// ПАЦИЕНТЫ (PATIENTS)
// ═══════════════════════════════════════

app.get('/api/patients', async (req, res) => {
  try {
    const { gender, town_id, age_from, age_to, search, has_policy, has_snils } = req.query;

    let query = `
      SELECT p.id, p.last_name, p.first_name, p.patronymic, p.date_of_birth,
             p.gender, p.phone_number, p.email, p.snils, p.insurance_policy,
             p.country_id, p.town_id, p.street_id, p.building, p.apartment_number, p.zipcode,
             t.name as town, s.name as street
      FROM patients p
      LEFT JOIN towns t ON p.town_id = t.id
      LEFT JOIN streets s ON p.street_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (gender) {
      params.push(gender);
      query += ` AND p.gender = $${params.length}`;
    }
    if (town_id) {
      params.push(town_id);
      query += ` AND p.town_id = $${params.length}`;
    }
    if (age_from) {
      params.push(age_from);
      query += ` AND EXTRACT(YEAR FROM AGE(p.date_of_birth)) >= $${params.length}`;
    }
    if (age_to) {
      params.push(age_to);
      query += ` AND EXTRACT(YEAR FROM AGE(p.date_of_birth)) <= $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.last_name ILIKE $${params.length} OR p.first_name ILIKE $${params.length} OR p.patronymic ILIKE $${params.length})`;
    }
    if (has_policy === 'yes') {
      query += ` AND p.insurance_policy IS NOT NULL AND TRIM(p.insurance_policy) != ''`;
    } else if (has_policy === 'no') {
      query += ` AND (p.insurance_policy IS NULL OR TRIM(p.insurance_policy) = '')`;
    }
    if (has_snils === 'yes') {
      query += ` AND p.snils IS NOT NULL AND TRIM(p.snils) != ''`;
    } else if (has_snils === 'no') {
      query += ` AND (p.snils IS NULL OR TRIM(p.snils) = '')`;
    }

    query += ` ORDER BY p.last_name`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/patients', async (req, res) => {
  const { last_name, first_name, patronymic, date_of_birth, gender, phone_number, email, snils, insurance_policy, country_id, town_id, street_id, building, apartment_number, zipcode } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO patients (last_name, first_name, patronymic, date_of_birth, gender, phone_number, email, snils, insurance_policy, country_id, town_id, street_id, building, apartment_number, zipcode)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [last_name, first_name, patronymic, date_of_birth, gender, phone_number, email, snils, insurance_policy, country_id, town_id, street_id, building, apartment_number, zipcode]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/patients/:id', async (req, res) => {
  const { last_name, first_name, patronymic, date_of_birth, gender, phone_number, email, snils, insurance_policy, country_id, town_id, street_id, building, apartment_number, zipcode } = req.body;
  try {
    const result = await pool.query(
      `UPDATE patients SET last_name = $1, first_name = $2, patronymic = $3, date_of_birth = $4, gender = $5, phone_number = $6, email = $7, snils = $8, insurance_policy = $9, country_id = $10, town_id = $11, street_id = $12, building = $13, apartment_number = $14, zipcode = $15
       WHERE id = $16 RETURNING *`,
      [last_name, first_name, patronymic, date_of_birth, gender, phone_number, email, snils, insurance_policy, country_id, town_id, street_id, building, apartment_number, zipcode, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// ПРИЁМЫ (APPOINTMENTS)
// ═══════════════════════════════════════

app.get('/api/appointments', async (req, res) => {
  try {
    const { status, doctor_id, patient_id, date_from, date_to, today } = req.query;

    let query = `
      SELECT a.id, a.patient_id, a.doctor_id, a.scheduled_at, a.status, a.purpose,
             p.last_name || ' ' || p.first_name || COALESCE(' ' || p.patronymic, '') as patient_name,
             d.last_name || ' ' || d.first_name || COALESCE(' ' || d.patronymic, '') as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }
    if (doctor_id) {
      params.push(doctor_id);
      query += ` AND a.doctor_id = $${params.length}`;
    }
    if (patient_id) {
      params.push(patient_id);
      query += ` AND a.patient_id = $${params.length}`;
    }
    if (date_from) {
      params.push(date_from);
      query += ` AND a.scheduled_at::date >= $${params.length}`;
    }
    if (date_to) {
      params.push(date_to);
      query += ` AND a.scheduled_at::date <= $${params.length}`;
    }
    if (today === 'yes') {
      query += ` AND a.scheduled_at::date = CURRENT_DATE`;
    }

    query += ` ORDER BY a.scheduled_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/appointments/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { patient_id, doctor_id, scheduled_at, status, purpose } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, scheduled_at, status, purpose) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [patient_id, doctor_id, scheduled_at, status || 'scheduled', purpose]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  const { patient_id, doctor_id, scheduled_at, status, purpose } = req.body;
  try {
    const result = await pool.query(
      'UPDATE appointments SET patient_id = $1, doctor_id = $2, scheduled_at = $3, status = $4, purpose = $5 WHERE id = $6 RETURNING *',
      [patient_id, doctor_id, scheduled_at, status, purpose, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// ДИАГНОЗЫ (DIAGNOSES)
// ═══════════════════════════════════════

app.get('/api/diagnoses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diagnoses ORDER BY code');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/diagnoses/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diagnoses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/diagnoses', async (req, res) => {
  const { code, name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO diagnoses (code, name, description) VALUES ($1, $2, $3) RETURNING *',
      [code, name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/diagnoses/:id', async (req, res) => {
  const { code, name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE diagnoses SET code = $1, name = $2, description = $3 WHERE id = $4 RETURNING *',
      [code, name, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/diagnoses/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM diagnoses WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// КАТАЛОГ АНАЛИЗОВ (ANALYSES_CATALOG)
// ═══════════════════════════════════════

app.get('/api/analyses-catalog', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analyses_catalog ORDER BY code');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/analyses-catalog/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analyses_catalog WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/analyses-catalog', async (req, res) => {
  const { code, name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO analyses_catalog (code, name, description) VALUES ($1, $2, $3) RETURNING *',
      [code, name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/analyses-catalog/:id', async (req, res) => {
  const { code, name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE analyses_catalog SET code = $1, name = $2, description = $3 WHERE id = $4 RETURNING *',
      [code, name, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/analyses-catalog/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM analyses_catalog WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// ЛЕКАРСТВА (DRUGS)
// ═══════════════════════════════════════

app.get('/api/drugs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drugs ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/drugs/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drugs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/drugs', async (req, res) => {
  const { code, name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO drugs (code, name) VALUES ($1, $2) RETURNING *',
      [code, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/drugs/:id', async (req, res) => {
  const { code, name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE drugs SET code = $1, name = $2 WHERE id = $3 RETURNING *',
      [code, name, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/drugs/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM drugs WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// ПРОЦЕДУРЫ (PROCEDURES)
// ═══════════════════════════════════════

app.get('/api/procedures', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM procedures ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/procedures/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM procedures WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/procedures', async (req, res) => {
  const { code, name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO procedures (code, name, description) VALUES ($1, $2, $3) RETURNING *',
      [code, name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/procedures/:id', async (req, res) => {
  const { code, name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE procedures SET code = $1, name = $2, description = $3 WHERE id = $4 RETURNING *',
      [code, name, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/procedures/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM procedures WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// КАБИНЕТЫ (ROOMS)
// ═══════════════════════════════════════

app.get('/api/rooms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY number');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/rooms/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/rooms', async (req, res) => {
  const { number, floor, room_type, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO rooms (number, floor, room_type, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [number, floor, room_type, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  const { number, floor, room_type, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE rooms SET number = $1, floor = $2, room_type = $3, description = $4 WHERE id = $5 RETURNING *',
      [number, floor, room_type, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// СПЕЦИАЛЬНОСТИ (SPECIALTIES)
// ═══════════════════════════════════════

app.get('/api/specialties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM specialties ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/specialties/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM specialties WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/specialties', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO specialties (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/specialties/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE specialties SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/specialties/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM specialties WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// МЕДИЦИНСКИЕ ЗАПИСИ (MEDICAL_RECORDS)
// ═══════════════════════════════════════

app.get('/api/medical-records', async (req, res) => {
  try {
    const { patient_id, diagnosis_id, date_from, date_to } = req.query;

    let query = `
      SELECT mr.id, mr.appointment_id, mr.patient_id, mr.diagnosis_id, mr.created_at, mr.description,
             p.last_name || ' ' || p.first_name as patient_name,
             diag.code as diagnosis_code, diag.name as diagnosis_name
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN diagnoses diag ON mr.diagnosis_id = diag.id
      WHERE 1=1
    `;
    const params = [];

    if (patient_id) {
      params.push(patient_id);
      query += ` AND mr.patient_id = $${params.length}`;
    }
    if (diagnosis_id) {
      params.push(diagnosis_id);
      query += ` AND mr.diagnosis_id = $${params.length}`;
    }
    if (date_from) {
      params.push(date_from);
      query += ` AND mr.created_at::date >= $${params.length}`;
    }
    if (date_to) {
      params.push(date_to);
      query += ` AND mr.created_at::date <= $${params.length}`;
    }

    query += ` ORDER BY mr.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/medical-records/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medical_records WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/medical-records', async (req, res) => {
  const { appointment_id, patient_id, diagnosis_id, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO medical_records (appointment_id, patient_id, diagnosis_id, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [appointment_id, patient_id, diagnosis_id, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/medical-records/:id', async (req, res) => {
  const { appointment_id, patient_id, diagnosis_id, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE medical_records SET appointment_id = $1, patient_id = $2, diagnosis_id = $3, description = $4 WHERE id = $5 RETURNING *',
      [appointment_id, patient_id, diagnosis_id, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/medical-records/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM medical_records WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// РАСПИСАНИЕ ВРАЧЕЙ (DOCTOR_ROOMS)
// ═══════════════════════════════════════

app.get('/api/doctor-rooms', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dr.id, dr.doctor_id, dr.room_id, dr.day_of_week, dr.start_time, dr.end_time,
             d.last_name || ' ' || d.first_name as doctor_name,
             r.number as room_number
      FROM doctor_rooms dr
      JOIN doctors d ON dr.doctor_id = d.id
      JOIN rooms r ON dr.room_id = r.id
      ORDER BY dr.day_of_week, dr.start_time
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/doctor-rooms/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctor_rooms WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/doctor-rooms', async (req, res) => {
  const { doctor_id, room_id, day_of_week, start_time, end_time } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO doctor_rooms (doctor_id, room_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [doctor_id, room_id, day_of_week, start_time, end_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/doctor-rooms/:id', async (req, res) => {
  const { doctor_id, room_id, day_of_week, start_time, end_time } = req.body;
  try {
    const result = await pool.query(
      'UPDATE doctor_rooms SET doctor_id = $1, room_id = $2, day_of_week = $3, start_time = $4, end_time = $5 WHERE id = $6 RETURNING *',
      [doctor_id, room_id, day_of_week, start_time, end_time, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/doctor-rooms/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM doctor_rooms WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// АНАЛИЗЫ ПАЦИЕНТОВ (ANALYSES)
// ═══════════════════════════════════════

app.get('/api/analyses', async (req, res) => {
  try {
    const { analysis_catalog_id, status, date_from, date_to } = req.query;

    let query = `
      SELECT an.id, an.analysis_catalog_id, an.appointment_id, an.diagnosis_id,
             an.scheduled_at, an.completed_at, an.result,
             ac.code as analysis_code, ac.name as analysis_name,
             p.last_name || ' ' || p.first_name as patient_name
      FROM analyses an
      JOIN analyses_catalog ac ON an.analysis_catalog_id = ac.id
      JOIN appointments a ON an.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (analysis_catalog_id) {
      params.push(analysis_catalog_id);
      query += ` AND an.analysis_catalog_id = $${params.length}`;
    }
    if (status === 'pending') {
      query += ` AND an.completed_at IS NULL`;
    } else if (status === 'completed') {
      query += ` AND an.completed_at IS NOT NULL`;
    }
    if (date_from) {
      params.push(date_from);
      query += ` AND an.scheduled_at::date >= $${params.length}`;
    }
    if (date_to) {
      params.push(date_to);
      query += ` AND an.scheduled_at::date <= $${params.length}`;
    }

    query += ` ORDER BY an.scheduled_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/analyses/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analyses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/analyses', async (req, res) => {
  const { analysis_catalog_id, appointment_id, diagnosis_id, scheduled_at, completed_at, result } = req.body;
  try {
    const resultDb = await pool.query(
      'INSERT INTO analyses (analysis_catalog_id, appointment_id, diagnosis_id, scheduled_at, completed_at, result) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [analysis_catalog_id, appointment_id, diagnosis_id || null, scheduled_at, completed_at || null, result]
    );
    res.status(201).json(resultDb.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/analyses/:id', async (req, res) => {
  const { analysis_catalog_id, appointment_id, diagnosis_id, scheduled_at, completed_at, result } = req.body;
  try {
    const resultDb = await pool.query(
      'UPDATE analyses SET analysis_catalog_id = $1, appointment_id = $2, diagnosis_id = $3, scheduled_at = $4, completed_at = $5, result = $6 WHERE id = $7 RETURNING *',
      [analysis_catalog_id, appointment_id, diagnosis_id || null, scheduled_at, completed_at || null, result, req.params.id]
    );
    if (resultDb.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(resultDb.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/analyses/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM analyses WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// НАЗНАЧЕНИЯ ПРОЦЕДУР (PRESCRIPTION_PROCEDURES)
// ═══════════════════════════════════════

app.get('/api/prescription-procedures', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pp.id, pp.medical_record_id, pp.procedure_id, pp.quantity, pp.duration_minutes,
             pr.code as procedure_code, pr.name as procedure_name,
             p.last_name || ' ' || p.first_name as patient_name,
             d.code as diagnosis_code
      FROM prescription_procedures pp
      JOIN procedures pr ON pp.procedure_id = pr.id
      JOIN medical_records mr ON pp.medical_record_id = mr.id
      JOIN patients p ON mr.patient_id = p.id
      JOIN diagnoses d ON mr.diagnosis_id = d.id
      ORDER BY pp.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/prescription-procedures/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM prescription_procedures WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.post('/api/prescription-procedures', async (req, res) => {
  const { medical_record_id, procedure_id, quantity, duration_minutes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO prescription_procedures (medical_record_id, procedure_id, quantity, duration_minutes) VALUES ($1, $2, $3, $4) RETURNING *',
      [medical_record_id, procedure_id, quantity || 1, duration_minutes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.put('/api/prescription-procedures/:id', async (req, res) => {
  const { medical_record_id, procedure_id, quantity, duration_minutes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE prescription_procedures SET medical_record_id = $1, procedure_id = $2, quantity = $3, duration_minutes = $4 WHERE id = $5 RETURNING *',
      [medical_record_id, procedure_id, quantity, duration_minutes || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.delete('/api/prescription-procedures/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM prescription_procedures WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// СПРАВОЧНИКИ ДЛЯ ФОРМ
// ═══════════════════════════════════════

app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM countries ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/towns', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM towns ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

app.get('/api/streets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM streets ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// ВЫБОРКИ (предустановленные фильтры)
// ═══════════════════════════════════════

// Пациенты без полиса ОМС
app.get('/api/selections/patients-without-policy', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.last_name, p.first_name, p.patronymic, p.date_of_birth,
             p.gender, p.phone_number, p.email, p.snils, p.insurance_policy,
             p.country_id, p.town_id, p.street_id, p.building, p.apartment_number, p.zipcode,
             t.name as town, s.name as street
      FROM patients p
      LEFT JOIN towns t ON p.town_id = t.id
      LEFT JOIN streets s ON p.street_id = s.id
      WHERE p.insurance_policy IS NULL OR TRIM(p.insurance_policy) = ''
      ORDER BY p.last_name, p.first_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Приёмы на сегодня
app.get('/api/selections/appointments-today', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.patient_id, a.doctor_id, a.scheduled_at, a.status, a.purpose,
             p.last_name || ' ' || p.first_name || COALESCE(' ' || p.patronymic, '') as patient_name,
             d.last_name || ' ' || d.first_name || COALESCE(' ' || d.patronymic, '') as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.scheduled_at::date = CURRENT_DATE
      ORDER BY a.scheduled_at
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Неявки за последний месяц
app.get('/api/selections/no-shows-month', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.patient_id, a.doctor_id, a.scheduled_at, a.status, a.purpose,
             p.last_name || ' ' || p.first_name || COALESCE(' ' || p.patronymic, '') as patient_name,
             d.last_name || ' ' || d.first_name || COALESCE(' ' || d.patronymic, '') as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.status = 'no_show'
        AND a.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY a.scheduled_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// ПОИСК (использует индексы)
// ═══════════════════════════════════════

// Поиск пациента по полису ОМС (idx_patients_insurance_policy)
app.get('/api/search/patients/by-policy/:policy', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM patients WHERE insurance_policy = $1',
      [req.params.policy]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Поиск пациента по СНИЛС (idx_patients_snils)
app.get('/api/search/patients/by-snils/:snils', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM patients WHERE snils = $1',
      [req.params.snils]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Поиск пациентов по ФИО (idx_patients_full_name)
app.get('/api/search/patients/by-name', async (req, res) => {
  const { last_name, first_name } = req.query;
  try {
    let query = 'SELECT * FROM patients WHERE 1=1';
    const params = [];

    if (last_name) {
      params.push(last_name + '%');
      query += ` AND last_name ILIKE $${params.length}`;
    }
    if (first_name) {
      params.push(first_name + '%');
      query += ` AND first_name ILIKE $${params.length}`;
    }
    query += ' ORDER BY last_name, first_name LIMIT 50';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Расписание врача на дату (idx_appointments_doctor_date)
app.get('/api/search/appointments/doctor-schedule/:doctorId', async (req, res) => {
  const { date } = req.query; // формат: 2024-12-15
  try {
    const result = await pool.query(`
      SELECT a.*, p.last_name || ' ' || p.first_name as patient_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = $1 AND a.scheduled_at::date = $2
      ORDER BY a.scheduled_at
    `, [req.params.doctorId, date]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// История приёмов пациента (idx_appointments_patient_date)
app.get('/api/search/appointments/patient-history/:patientId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, d.last_name || ' ' || d.first_name as doctor_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.patient_id = $1
      ORDER BY a.scheduled_at DESC
      LIMIT 100
    `, [req.params.patientId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Приёмы по статусу (idx_appointments_status)
app.get('/api/search/appointments/by-status/:status', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*,
             p.last_name || ' ' || p.first_name || COALESCE(' ' || p.patronymic, '') as patient_name,
             d.last_name || ' ' || d.first_name || COALESCE(' ' || d.patronymic, '') as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.status = $1
      ORDER BY a.scheduled_at
    `, [req.params.status]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Незавершённые анализы (idx_analyses_pending)
app.get('/api/search/analyses/pending', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT an.*,
             ac.name as analysis_name, ac.code as analysis_code,
             p.last_name || ' ' || p.first_name as patient_name
      FROM analyses an
      JOIN analyses_catalog ac ON an.analysis_catalog_id = ac.id
      JOIN appointments a ON an.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      WHERE an.completed_at IS NULL
      ORDER BY an.scheduled_at
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Поиск диагноза по коду МКБ-10 (idx_diagnoses_code)
app.get('/api/search/diagnoses/by-code/:code', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM diagnoses WHERE code ILIKE $1 ORDER BY code LIMIT 20',
      [req.params.code + '%']
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// СТАТИСТИКА (использует индексы)
// ═══════════════════════════════════════

// Статистика по диагнозам (idx_medical_records_diagnosis_id)
app.get('/api/stats/diagnoses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.code, d.name, COUNT(*) as count
      FROM medical_records mr
      JOIN diagnoses d ON mr.diagnosis_id = d.id
      GROUP BY d.id
      ORDER BY count DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Статистика по лекарствам (idx_prescription_drugs_drug_id)
app.get('/api/stats/drugs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dr.code, dr.name, COUNT(*) as prescriptions_count
      FROM prescription_drugs pd
      JOIN drugs dr ON pd.drug_id = dr.id
      GROUP BY dr.id
      ORDER BY prescriptions_count DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Статистика по процедурам (idx_prescription_procedures_procedure_id)
app.get('/api/stats/procedures', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pr.code, pr.name, COUNT(*) as prescriptions_count, SUM(pp.quantity) as total_quantity
      FROM prescription_procedures pp
      JOIN procedures pr ON pp.procedure_id = pr.id
      GROUP BY pr.id
      ORDER BY prescriptions_count DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Статистика приёмов по врачам
app.get('/api/stats/doctors-workload', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.last_name, d.first_name,
             COUNT(*) as total_appointments,
             COUNT(*) FILTER (WHERE a.status = 'completed') as completed,
             COUNT(*) FILTER (WHERE a.status = 'cancelled') as cancelled,
             COUNT(*) FILTER (WHERE a.status = 'no_show') as no_show
      FROM doctors d
      LEFT JOIN appointments a ON d.id = a.doctor_id
      GROUP BY d.id
      ORDER BY total_appointments DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Расписание кабинета на день (idx_doctor_rooms_room_day)
app.get('/api/search/rooms/:roomId/schedule', async (req, res) => {
  const { day } = req.query; // 1-7 (Пн-Вс)
  try {
    const result = await pool.query(`
      SELECT dr.*, d.last_name || ' ' || d.first_name as doctor_name
      FROM doctor_rooms dr
      JOIN doctors d ON dr.doctor_id = d.id
      WHERE dr.room_id = $1 AND dr.day_of_week = $2
      ORDER BY dr.start_time
    `, [req.params.roomId, day]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// ═══════════════════════════════════════
// ЭКСПОРТ В CSV
// ═══════════════════════════════════════

// Функция для экранирования значений в CSV
function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Функция для форматирования как текст в Excel (для телефонов, СНИЛС и т.д.)
function asText(value) {
  if (value === null || value === undefined || String(value).trim() === '') return '';
  return `="${String(value).replace(/"/g, '""')}"`;
}

// Экспорт пациентов в CSV
app.get('/api/export/patients', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.last_name, p.first_name, p.patronymic, p.date_of_birth,
             CASE p.gender WHEN 'male' THEN 'Мужской' ELSE 'Женский' END as gender,
             p.phone_number, p.email, p.snils, p.insurance_policy,
             c.name as country, t.name as town, s.name as street,
             p.building, p.apartment_number, p.zipcode
      FROM patients p
      LEFT JOIN countries c ON p.country_id = c.id
      LEFT JOIN towns t ON p.town_id = t.id
      LEFT JOIN streets s ON p.street_id = s.id
      ORDER BY p.last_name, p.first_name
    `);

    const headers = ['ID', 'Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Пол', 'Телефон', 'Email', 'СНИЛС', 'Полис ОМС', 'Страна', 'Город', 'Улица', 'Дом', 'Квартира', 'Индекс'];
    const rows = result.rows.map(row => [
      row.id,
      escapeCsvValue(row.last_name),
      escapeCsvValue(row.first_name),
      escapeCsvValue(row.patronymic),
      row.date_of_birth ? new Date(row.date_of_birth).toLocaleDateString('ru-RU') : '',
      escapeCsvValue(row.gender),
      asText(row.phone_number),
      escapeCsvValue(row.email || 'не указан'),
      asText(row.snils),
      asText(row.insurance_policy),
      escapeCsvValue(row.country),
      escapeCsvValue(row.town),
      escapeCsvValue(row.street),
      escapeCsvValue(row.building),
      escapeCsvValue(row.apartment_number),
      asText(row.zipcode)
    ].join(';'));

    const csv = '\uFEFF' + [headers.join(';'), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="patients_report.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Экспорт врачей в CSV
app.get('/api/export/doctors', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.last_name, d.first_name, d.patronymic, d.phone_number, d.email,
             STRING_AGG(s.name, ', ') as specialties
      FROM doctors d
      LEFT JOIN doctor_specialties ds ON d.id = ds.doctor_id
      LEFT JOIN specialties s ON ds.specialty_id = s.id
      GROUP BY d.id
      ORDER BY d.last_name, d.first_name
    `);

    const headers = ['ID', 'Фамилия', 'Имя', 'Отчество', 'Телефон', 'Email', 'Специальности'];
    const rows = result.rows.map(row => [
      row.id,
      escapeCsvValue(row.last_name),
      escapeCsvValue(row.first_name),
      escapeCsvValue(row.patronymic),
      asText(row.phone_number),
      escapeCsvValue(row.email),
      escapeCsvValue(row.specialties)
    ].join(';'));

    const csv = '\uFEFF' + [headers.join(';'), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="doctors_report.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

// Экспорт посещений конкретного пациента в CSV
app.get('/api/export/patient-visits/:patientId', async (req, res) => {
  try {
    const patientResult = await pool.query(
      `SELECT last_name, first_name, patronymic FROM patients WHERE id = $1`,
      [req.params.patientId]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Пациент не найден' });
    }

    const patient = patientResult.rows[0];
    const patientName = `${patient.last_name} ${patient.first_name} ${patient.patronymic || ''}`.trim();

    const result = await pool.query(`
      SELECT a.id, a.scheduled_at, a.status, a.purpose,
             d.last_name || ' ' || d.first_name as doctor_name,
             STRING_AGG(DISTINCT s.name, ', ') as specialties,
             STRING_AGG(DISTINCT diag.code || ' - ' || diag.name, '; ') as diagnoses
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN doctor_specialties ds ON d.id = ds.doctor_id
      LEFT JOIN specialties s ON ds.specialty_id = s.id
      LEFT JOIN medical_records mr ON a.id = mr.appointment_id
      LEFT JOIN diagnoses diag ON mr.diagnosis_id = diag.id
      WHERE a.patient_id = $1
      GROUP BY a.id, a.scheduled_at, a.status, a.purpose, d.last_name, d.first_name
      ORDER BY a.scheduled_at DESC
    `, [req.params.patientId]);

    const statusLabels = {
      'scheduled': 'Запланирован',
      'completed': 'Завершён',
      'cancelled': 'Отменён',
      'no_show': 'Неявка'
    };

    const headers = ['ID', 'Дата и время', 'Статус', 'Цель визита', 'Врач', 'Специальность', 'Диагнозы'];
    const rows = result.rows.map(row => [
      row.id,
      row.scheduled_at ? new Date(row.scheduled_at).toLocaleString('ru-RU') : '',
      statusLabels[row.status] || row.status,
      escapeCsvValue(row.purpose),
      escapeCsvValue(row.doctor_name),
      escapeCsvValue(row.specialties),
      escapeCsvValue(row.diagnoses)
    ].join(';'));

    const csv = '\uFEFF' + [
      `Отчёт по посещениям пациента: ${patientName}`,
      `Дата формирования: ${new Date().toLocaleString('ru-RU')}`,
      '',
      headers.join(';'),
      ...rows
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="patient_visits_${req.params.patientId}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: translateDbError(err) });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
