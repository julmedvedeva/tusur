# Изменения в серверной части (index.js)

## 1. Фильтрация пациентов

**Эндпоинт:** `GET /api/patients`

**Добавленные параметры запроса:**

| Параметр | Тип | Описание | Пример |
|----------|-----|----------|--------|
| `search` | string | Поиск по ФИО (ILIKE) | `?search=Иванов` |
| `gender` | string | Фильтр по полу | `?gender=male` |
| `town_id` | number | Фильтр по городу | `?town_id=1` |
| `age_from` | number | Минимальный возраст | `?age_from=18` |
| `age_to` | number | Максимальный возраст | `?age_to=65` |
| `has_policy` | string | Наличие полиса ОМС | `?has_policy=yes` или `?has_policy=no` |
| `has_snils` | string | Наличие СНИЛС | `?has_snils=yes` или `?has_snils=no` |

**SQL-логика:**
```sql
-- Возраст вычисляется через:
EXTRACT(YEAR FROM AGE(p.date_of_birth)) >= $1

-- Проверка наличия полиса:
-- has_policy=yes:
p.insurance_policy IS NOT NULL AND TRIM(p.insurance_policy) != ''
-- has_policy=no:
p.insurance_policy IS NULL OR TRIM(p.insurance_policy) = ''
```

---

## 2. Фильтрация приёмов

**Эндпоинт:** `GET /api/appointments`

**Добавленные параметры запроса:**

| Параметр | Тип | Описание | Пример |
|----------|-----|----------|--------|
| `status` | string | Статус приёма | `?status=completed` |
| `doctor_id` | number | ID врача | `?doctor_id=1` |
| `patient_id` | number | ID пациента | `?patient_id=5` |
| `date_from` | date | Дата начала периода | `?date_from=2024-01-01` |
| `date_to` | date | Дата конца периода | `?date_to=2024-12-31` |
| `today` | string | Только сегодняшние | `?today=yes` |

**SQL-логика:**
```sql
-- Фильтр по дате:
a.scheduled_at::date >= $1
a.scheduled_at::date <= $2

-- Только сегодня:
a.scheduled_at::date = CURRENT_DATE
```

---

## 3. Фильтрация врачей

**Эндпоинт:** `GET /api/doctors`

**Добавленные параметры запроса:**

| Параметр | Тип | Описание | Пример |
|----------|-----|----------|--------|
| `search` | string | Поиск по ФИО | `?search=Петров` |
| `specialty_id` | number | ID специальности | `?specialty_id=2` |
| `has_specialty` | string | Наличие специальности | `?has_specialty=yes` или `?has_specialty=no` |

**SQL-логика:**
```sql
-- Фильтр по специальности (подзапрос):
d.id IN (SELECT doctor_id FROM doctor_specialties WHERE specialty_id = $1)

-- Наличие специальности через HAVING:
-- has_specialty=yes:
HAVING COUNT(s.id) > 0
-- has_specialty=no:
HAVING COUNT(s.id) = 0
```

---

## 4. Фильтрация медицинских записей

**Эндпоинт:** `GET /api/medical-records`

**Добавленные параметры запроса:**

| Параметр | Тип | Описание | Пример |
|----------|-----|----------|--------|
| `patient_id` | number | ID пациента | `?patient_id=3` |
| `diagnosis_id` | number | ID диагноза | `?diagnosis_id=10` |
| `date_from` | date | Дата начала периода | `?date_from=2024-01-01` |
| `date_to` | date | Дата конца периода | `?date_to=2024-12-31` |

---

## 5. Фильтрация анализов

**Эндпоинт:** `GET /api/analyses`

**Добавленные параметры запроса:**

| Параметр | Тип | Описание | Пример |
|----------|-----|----------|--------|
| `analysis_catalog_id` | number | ID типа анализа | `?analysis_catalog_id=5` |
| `status` | string | Статус выполнения | `?status=pending` или `?status=completed` |
| `date_from` | date | Дата назначения с | `?date_from=2024-01-01` |
| `date_to` | date | Дата назначения по | `?date_to=2024-12-31` |

**SQL-логика:**
```sql
-- Статус через проверку completed_at:
-- status=pending:
an.completed_at IS NULL
-- status=completed:
an.completed_at IS NOT NULL
```

---

## 6. Выборки (Selections)

### 6.1. Пациенты без полиса ОМС

**Эндпоинт:** `GET /api/selections/patients-without-policy`

```sql
SELECT p.*, t.name as town, s.name as street
FROM patients p
LEFT JOIN towns t ON p.town_id = t.id
LEFT JOIN streets s ON p.street_id = s.id
WHERE p.insurance_policy IS NULL OR TRIM(p.insurance_policy) = ''
ORDER BY p.last_name, p.first_name
```

### 6.2. Приёмы на сегодня

**Эндпоинт:** `GET /api/selections/appointments-today`

```sql
SELECT a.*,
       p.last_name || ' ' || p.first_name as patient_name,
       d.last_name || ' ' || d.first_name as doctor_name
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN doctors d ON a.doctor_id = d.id
WHERE a.scheduled_at::date = CURRENT_DATE
ORDER BY a.scheduled_at
```

### 6.3. Неявки за месяц

**Эндпоинт:** `GET /api/selections/no-shows-month`

```sql
SELECT a.*,
       p.last_name || ' ' || p.first_name as patient_name,
       d.last_name || ' ' || d.first_name as doctor_name
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN doctors d ON a.doctor_id = d.id
WHERE a.status = 'no_show'
  AND a.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY a.scheduled_at DESC
```

---

## 7. Экспорт в CSV

### 7.1. Вспомогательные функции

```javascript
// Экранирование значений для CSV
function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Форматирование как текст для Excel (телефоны, СНИЛС и т.д.)
function asText(value) {
  if (value === null || value === undefined || String(value).trim() === '') return '';
  return `="${String(value).replace(/"/g, '""')}"`;
}
```

### 7.2. Экспорт пациентов

**Эндпоинт:** `GET /api/export/patients`

**Возвращает:** CSV-файл `patients_report.csv`

**Колонки:**
- ID, Фамилия, Имя, Отчество, Дата рождения, Пол
- Телефон (как текст), Email, СНИЛС (как текст), Полис ОМС (как текст)
- Страна, Город, Улица, Дом, Квартира, Индекс (как текст)

```sql
SELECT p.*,
       CASE p.gender WHEN 'male' THEN 'Мужской' ELSE 'Женский' END as gender,
       c.name as country, t.name as town, s.name as street
FROM patients p
LEFT JOIN countries c ON p.country_id = c.id
LEFT JOIN towns t ON p.town_id = t.id
LEFT JOIN streets s ON p.street_id = s.id
ORDER BY p.last_name, p.first_name
```

### 7.3. Экспорт врачей

**Эндпоинт:** `GET /api/export/doctors`

**Возвращает:** CSV-файл `doctors_report.csv`

**Колонки:**
- ID, Фамилия, Имя, Отчество
- Телефон (как текст), Email
- Специальности (через запятую)

```sql
SELECT d.*, STRING_AGG(s.name, ', ') as specialties
FROM doctors d
LEFT JOIN doctor_specialties ds ON d.id = ds.doctor_id
LEFT JOIN specialties s ON ds.specialty_id = s.id
GROUP BY d.id
ORDER BY d.last_name, d.first_name
```

### 7.4. Экспорт посещений пациента

**Эндпоинт:** `GET /api/export/patient-visits/:patientId`

**Возвращает:** CSV-файл `patient_visits_{id}.csv`

**Содержимое:**
- Строка 1: "Отчёт по посещениям пациента: {ФИО}"
- Строка 2: "Дата формирования: {дата и время}"
- Строка 3: пустая
- Строка 4: заголовки колонок
- Далее: данные

**Колонки:**
- ID, Дата и время, Статус, Цель визита
- Врач, Специальность, Диагнозы

```sql
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
```

---

## 8. Особенности реализации CSV

### Разделитель
Используется `;` вместо `,` — это стандарт для русской локали Excel.

### Кодировка
UTF-8 с BOM (`\uFEFF` в начале файла) — обеспечивает корректное отображение кириллицы в Excel.

### Числовые поля как текст
Телефоны, СНИЛС, полис ОМС, индекс форматируются как `="значение"` — это заставляет Excel воспринимать их как текст, сохраняя ведущие нули.

### HTTP-заголовки
```javascript
res.setHeader('Content-Type', 'text/csv; charset=utf-8');
res.setHeader('Content-Disposition', 'attachment; filename="filename.csv"');
```

---

## Примеры запросов

```bash
# Пациенты-мужчины старше 30 лет без полиса
GET /api/patients?gender=male&age_from=30&has_policy=no

# Завершённые приёмы врача с ID=1 за январь 2024
GET /api/appointments?doctor_id=1&status=completed&date_from=2024-01-01&date_to=2024-01-31

# Врачи-терапевты (specialty_id=1)
GET /api/doctors?specialty_id=1

# Врачи без специальности
GET /api/doctors?has_specialty=no

# Невыполненные анализы
GET /api/analyses?status=pending

# Скачать CSV всех пациентов
GET /api/export/patients

# Скачать историю посещений пациента с ID=5
GET /api/export/patient-visits/5
```
