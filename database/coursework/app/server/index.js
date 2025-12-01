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
// ВРАЧИ (DOCTORS)
// ═══════════════════════════════════════

app.get('/api/doctors', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.last_name, d.first_name, d.patronymic, d.phone_number, d.email,
             STRING_AGG(s.name, ', ') as specialties
      FROM doctors d
      LEFT JOIN doctor_specialties ds ON d.id = ds.doctor_id
      LEFT JOIN specialties s ON ds.specialty_id = s.id
      GROUP BY d.id
      ORDER BY d.last_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctors/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/doctors/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════
// ПАЦИЕНТЫ (PATIENTS)
// ═══════════════════════════════════════

app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.last_name, p.first_name, p.patronymic, p.date_of_birth,
             p.gender, p.phone_number, p.email, p.snils, p.insurance_policy,
             p.country_id, p.town_id, p.street_id, p.building, p.apartment_number, p.zipcode,
             t.name as town, s.name as street
      FROM patients p
      LEFT JOIN towns t ON p.town_id = t.id
      LEFT JOIN streets s ON p.street_id = s.id
      ORDER BY p.last_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════
// ПРИЁМЫ (APPOINTMENTS)
// ═══════════════════════════════════════

app.get('/api/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.patient_id, a.doctor_id, a.scheduled_at, a.status, a.purpose,
             p.last_name || ' ' || p.first_name as patient_name,
             d.last_name || ' ' || d.first_name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.scheduled_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/diagnoses/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diagnoses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/diagnoses/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM diagnoses WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analyses-catalog/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analyses_catalog WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/analyses-catalog/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM analyses_catalog WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/drugs/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drugs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/drugs/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM drugs WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/procedures/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM procedures WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/procedures/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM procedures WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rooms/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/specialties/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM specialties WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/specialties/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM specialties WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════
// МЕДИЦИНСКИЕ ЗАПИСИ (MEDICAL_RECORDS)
// ═══════════════════════════════════════

app.get('/api/medical-records', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mr.id, mr.appointment_id, mr.patient_id, mr.diagnosis_id, mr.created_at, mr.description,
             p.last_name || ' ' || p.first_name as patient_name,
             diag.code as diagnosis_code, diag.name as diagnosis_name
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN diagnoses diag ON mr.diagnosis_id = diag.id
      ORDER BY mr.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/medical-records/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medical_records WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/medical-records/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM medical_records WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctor-rooms/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctor_rooms WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/doctor-rooms/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM doctor_rooms WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════
// АНАЛИЗЫ ПАЦИЕНТОВ (ANALYSES)
// ═══════════════════════════════════════

app.get('/api/analyses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT an.id, an.analysis_catalog_id, an.appointment_id, an.diagnosis_id,
             an.scheduled_at, an.completed_at, an.result,
             ac.code as analysis_code, ac.name as analysis_name,
             p.last_name || ' ' || p.first_name as patient_name
      FROM analyses an
      JOIN analyses_catalog ac ON an.analysis_catalog_id = ac.id
      JOIN appointments a ON an.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      ORDER BY an.scheduled_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analyses/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analyses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/analyses/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM analyses WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/prescription-procedures/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM prescription_procedures WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/prescription-procedures/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM prescription_procedures WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Не найдено' });
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/towns', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM towns ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/streets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM streets ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

// Приёмы по статусу (idx_appointments_status)
app.get('/api/search/appointments/by-status/:status', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*,
             p.last_name || ' ' || p.first_name as patient_name,
             d.last_name || ' ' || d.first_name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.status = $1
      ORDER BY a.scheduled_at
    `, [req.params.status]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
