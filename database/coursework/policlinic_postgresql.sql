-- ═══════════════════════════════════════
-- ПОЛИКЛИНИКА - PostgreSQL
-- ═══════════════════════════════════════

-- Удаление таблиц (если существуют)
DROP TABLE IF EXISTS prescription_procedures CASCADE;
DROP TABLE IF EXISTS prescription_drugs CASCADE;
DROP TABLE IF EXISTS analyses CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_rooms CASCADE;
DROP TABLE IF EXISTS doctor_specialties CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS streets CASCADE;
DROP TABLE IF EXISTS towns CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS specialties CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS diagnoses CASCADE;
DROP TABLE IF EXISTS analyses_catalog CASCADE;
DROP TABLE IF EXISTS drugs CASCADE;
DROP TABLE IF EXISTS procedures CASCADE;

-- Удаление типов (enum)
DROP TYPE IF EXISTS gender_type CASCADE;
DROP TYPE IF EXISTS room_type CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;

-- ═══════════════════════════════════════
-- ENUM ТИПЫ
-- ═══════════════════════════════════════

CREATE TYPE gender_type AS ENUM ('male', 'female');

CREATE TYPE room_type AS ENUM (
    'therapist',
    'general_practice',
    'pediatric',
    'specialist',
    'preventive_checkup',
    'laboratory',
    'functional_diagnostics',
    'xray',
    'ultrasound',
    'procedure',
    'vaccination',
    'dressing',
    'physiotherapy',
    'dental',
    'emergency',
    'administrative'
);

CREATE TYPE appointment_status AS ENUM (
    'scheduled',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'no_show'
);

-- ═══════════════════════════════════════
-- СПРАВОЧНИКИ АДРЕСОВ
-- ═══════════════════════════════════════

CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE towns (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES countries(id),
    code VARCHAR(20) UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE streets (
    id SERIAL PRIMARY KEY,
    town_id INTEGER NOT NULL REFERENCES towns(id),
    code VARCHAR(20) UNIQUE,
    name VARCHAR(100) NOT NULL
);

-- ═══════════════════════════════════════
-- ПАЦИЕНТЫ
-- ═══════════════════════════════════════

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    patronymic VARCHAR(100),

    date_of_birth DATE NOT NULL CHECK (date_of_birth <= CURRENT_DATE),
    gender gender_type NOT NULL,

    phone_number VARCHAR(20),
    email VARCHAR(255) UNIQUE,

    -- Документы
    snils VARCHAR(14) UNIQUE,
    insurance_policy VARCHAR(16) UNIQUE,

    -- Адрес
    country_id INTEGER NOT NULL REFERENCES countries(id),
    town_id INTEGER NOT NULL REFERENCES towns(id),
    street_id INTEGER NOT NULL REFERENCES streets(id),
    building VARCHAR(20) NOT NULL,
    apartment_number VARCHAR(20),
    zipcode VARCHAR(10)
);

COMMENT ON TABLE patients IS 'Пациенты поликлиники';
COMMENT ON COLUMN patients.patronymic IS 'Отчество';
COMMENT ON COLUMN patients.snils IS 'СНИЛС: 123-456-789 01';
COMMENT ON COLUMN patients.insurance_policy IS 'Полис ОМС';

-- ═══════════════════════════════════════
-- ВРАЧИ И СПЕЦИАЛЬНОСТИ
-- ═══════════════════════════════════════

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    patronymic VARCHAR(100),
    phone_number VARCHAR(20),
    email VARCHAR(255) UNIQUE
);

COMMENT ON TABLE doctors IS 'Врачи поликлиники';

CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

COMMENT ON TABLE specialties IS 'Справочник специальностей врачей';

CREATE TABLE doctor_specialties (
    doctor_id INTEGER NOT NULL REFERENCES doctors(id),
    specialty_id INTEGER NOT NULL REFERENCES specialties(id),
    PRIMARY KEY (doctor_id, specialty_id)
);

COMMENT ON TABLE doctor_specialties IS 'Связь врачей и специальностей (many-to-many)';

-- ═══════════════════════════════════════
-- КАБИНЕТЫ И РАСПИСАНИЕ
-- ═══════════════════════════════════════

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    number VARCHAR(10) NOT NULL,
    floor SMALLINT CHECK (floor > 0),
    room_type room_type NOT NULL,
    description TEXT
);

COMMENT ON TABLE rooms IS 'Кабинеты поликлиники';

CREATE TABLE doctor_rooms (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id),
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CHECK (end_time > start_time)
);

COMMENT ON TABLE doctor_rooms IS 'Расписание врачей по кабинетам';
COMMENT ON COLUMN doctor_rooms.day_of_week IS '1=Пн, 2=Вт, 3=Ср, 4=Чт, 5=Пт, 6=Сб, 7=Вс';

-- ═══════════════════════════════════════
-- ПРИЁМЫ
-- ═══════════════════════════════════════

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id),
    doctor_id INTEGER NOT NULL REFERENCES doctors(id),
    scheduled_at TIMESTAMP NOT NULL,
    status appointment_status NOT NULL DEFAULT 'scheduled',
    purpose TEXT
);

COMMENT ON TABLE appointments IS 'Записи на приём';

-- ═══════════════════════════════════════
-- ДИАГНОЗЫ И МЕДИЦИНСКИЕ ЗАПИСИ
-- ═══════════════════════════════════════

CREATE TABLE diagnoses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

COMMENT ON TABLE diagnoses IS 'Справочник диагнозов (МКБ-10)';

CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL REFERENCES appointments(id),
    patient_id INTEGER NOT NULL REFERENCES patients(id),
    diagnosis_id INTEGER NOT NULL REFERENCES diagnoses(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    description TEXT
);

COMMENT ON TABLE medical_records IS 'Медицинские записи';

-- ═══════════════════════════════════════
-- АНАЛИЗЫ
-- ═══════════════════════════════════════

CREATE TABLE analyses_catalog (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

COMMENT ON TABLE analyses_catalog IS 'Справочник типов анализов';

CREATE TABLE analyses (
    id SERIAL PRIMARY KEY,
    analysis_catalog_id INTEGER NOT NULL REFERENCES analyses_catalog(id),
    appointment_id INTEGER NOT NULL REFERENCES appointments(id),
    diagnosis_id INTEGER REFERENCES diagnoses(id),
    scheduled_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    result TEXT,
    CHECK (completed_at IS NULL OR completed_at >= scheduled_at)
);

COMMENT ON TABLE analyses IS 'Анализы пациентов';

-- ═══════════════════════════════════════
-- ЛЕКАРСТВА
-- ═══════════════════════════════════════

CREATE TABLE drugs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE,
    name VARCHAR(100) NOT NULL
);

COMMENT ON TABLE drugs IS 'Справочник лекарств';

CREATE TABLE prescription_drugs (
    id SERIAL PRIMARY KEY,
    medical_record_id INTEGER NOT NULL REFERENCES medical_records(id),
    drug_id INTEGER NOT NULL REFERENCES drugs(id),
    dosage VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL
);

COMMENT ON TABLE prescription_drugs IS 'Назначения лекарств';
COMMENT ON COLUMN prescription_drugs.dosage IS 'Например: 1 таблетка 2 раза в день';
COMMENT ON COLUMN prescription_drugs.duration IS 'Например: 7 дней';

-- ═══════════════════════════════════════
-- ПРОЦЕДУРЫ
-- ═══════════════════════════════════════

CREATE TABLE procedures (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

COMMENT ON TABLE procedures IS 'Справочник процедур';

CREATE TABLE prescription_procedures (
    id SERIAL PRIMARY KEY,
    medical_record_id INTEGER NOT NULL REFERENCES medical_records(id),
    procedure_id INTEGER NOT NULL REFERENCES procedures(id),
    quantity SMALLINT DEFAULT 1 CHECK (quantity > 0),
    duration_minutes SMALLINT CHECK (duration_minutes > 0)
);

COMMENT ON TABLE prescription_procedures IS 'Назначения процедур';

-- ═══════════════════════════════════════
-- ИНДЕКСЫ ДЛЯ ОПТИМИЗАЦИИ
-- ═══════════════════════════════════════

-- Пациенты: базовые индексы
CREATE INDEX idx_patients_last_name ON patients(last_name);
CREATE INDEX idx_patients_snils ON patients(snils);

-- Пациенты: дополнительные индексы
CREATE INDEX idx_patients_insurance_policy ON patients(insurance_policy);
CREATE INDEX idx_patients_date_of_birth ON patients(date_of_birth);
CREATE INDEX idx_patients_full_name ON patients(last_name, first_name);

-- Врачи
CREATE INDEX idx_doctors_last_name ON doctors(last_name);

-- Приёмы: базовые индексы
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);

-- Приёмы: дополнительные индексы
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, scheduled_at);
CREATE INDEX idx_appointments_patient_date ON appointments(patient_id, scheduled_at DESC);

-- Медицинские записи
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_medical_records_diagnosis_id ON medical_records(diagnosis_id);
CREATE INDEX idx_medical_records_created_at ON medical_records(created_at);
CREATE INDEX idx_medical_records_appointment_id ON medical_records(appointment_id);

-- Анализы
CREATE INDEX idx_analyses_appointment_id ON analyses(appointment_id);
CREATE INDEX idx_analyses_catalog_id ON analyses(analysis_catalog_id);
CREATE INDEX idx_analyses_pending ON analyses(completed_at) WHERE completed_at IS NULL;

-- Назначения лекарств и процедур
CREATE INDEX idx_prescription_drugs_drug_id ON prescription_drugs(drug_id);
CREATE INDEX idx_prescription_procedures_procedure_id ON prescription_procedures(procedure_id);

-- Расписание врачей
CREATE INDEX idx_doctor_rooms_day ON doctor_rooms(day_of_week);
CREATE INDEX idx_doctor_rooms_room_day ON doctor_rooms(room_id, day_of_week);

-- Справочники (для быстрого поиска по коду)
CREATE INDEX idx_diagnoses_code ON diagnoses(code);
CREATE INDEX idx_analyses_catalog_code ON analyses_catalog(code);
CREATE INDEX idx_drugs_code ON drugs(code);
CREATE INDEX idx_procedures_code ON procedures(code);
