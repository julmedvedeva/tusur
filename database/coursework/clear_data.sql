-- Удаление данных в правильном порядке (от зависимых к независимым)
TRUNCATE TABLE prescription_procedures CASCADE;
TRUNCATE TABLE prescription_drugs CASCADE;
TRUNCATE TABLE analyses CASCADE;
TRUNCATE TABLE medical_records CASCADE;
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE patients CASCADE;
TRUNCATE TABLE doctor_rooms CASCADE;
TRUNCATE TABLE doctor_specialties CASCADE;
TRUNCATE TABLE doctors CASCADE;
TRUNCATE TABLE procedures CASCADE;
TRUNCATE TABLE drugs CASCADE;
TRUNCATE TABLE analyses_catalog CASCADE;
TRUNCATE TABLE diagnoses CASCADE;
TRUNCATE TABLE rooms CASCADE;
TRUNCATE TABLE specialties CASCADE;
TRUNCATE TABLE streets CASCADE;
TRUNCATE TABLE towns CASCADE;
TRUNCATE TABLE countries CASCADE;

-- Сброс последовательностей
ALTER SEQUENCE countries_id_seq RESTART WITH 1;
ALTER SEQUENCE towns_id_seq RESTART WITH 1;
ALTER SEQUENCE streets_id_seq RESTART WITH 1;
ALTER SEQUENCE specialties_id_seq RESTART WITH 1;
ALTER SEQUENCE rooms_id_seq RESTART WITH 1;
ALTER SEQUENCE doctors_id_seq RESTART WITH 1;
ALTER SEQUENCE patients_id_seq RESTART WITH 1;
ALTER SEQUENCE diagnoses_id_seq RESTART WITH 1;
ALTER SEQUENCE analyses_catalog_id_seq RESTART WITH 1;
ALTER SEQUENCE drugs_id_seq RESTART WITH 1;
ALTER SEQUENCE procedures_id_seq RESTART WITH 1;
ALTER SEQUENCE appointments_id_seq RESTART WITH 1;
ALTER SEQUENCE medical_records_id_seq RESTART WITH 1;
ALTER SEQUENCE analyses_id_seq RESTART WITH 1;

SELECT 'Все данные очищены!' AS result;
