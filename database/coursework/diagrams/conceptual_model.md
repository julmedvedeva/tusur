# Концептуальная модель данных "Поликлиника"

## ER-диаграмма (Mermaid)

```mermaid
erDiagram
    %% ═══════════════════════════════════════
    %% ОСНОВНЫЕ СУЩНОСТИ
    %% ═══════════════════════════════════════

    PATIENT["ПАЦИЕНТ"] {
        int id PK
        string last_name "Фамилия"
        string first_name "Имя"
        string patronymic "Отчество"
        date date_of_birth "Дата рождения"
        enum gender "Пол"
        string phone "Телефон"
        string email "Email"
        string snils "СНИЛС"
        string insurance_policy "Полис ОМС"
    }

    DOCTOR["ВРАЧ"] {
        int id PK
        string last_name "Фамилия"
        string first_name "Имя"
        string patronymic "Отчество"
        string phone "Телефон"
        string email "Email"
    }

    APPOINTMENT["ПРИЁМ"] {
        int id PK
        timestamp scheduled_at "Дата и время"
        enum status "Статус"
        text purpose "Цель визита"
    }

    MEDICAL_RECORD["МЕДИЦИНСКАЯ ЗАПИСЬ"] {
        int id PK
        timestamp created_at "Дата создания"
        text description "Описание"
    }

    %% ═══════════════════════════════════════
    %% СПРАВОЧНИКИ
    %% ═══════════════════════════════════════

    SPECIALTY["СПЕЦИАЛЬНОСТЬ"] {
        int id PK
        string name "Название"
        text description "Описание"
    }

    ROOM["КАБИНЕТ"] {
        int id PK
        string number "Номер"
        int floor "Этаж"
        enum room_type "Тип"
        text description "Описание"
    }

    DIAGNOSIS["ДИАГНОЗ (МКБ-10)"] {
        int id PK
        string code "Код МКБ-10"
        string name "Название"
        text description "Описание"
    }

    DRUG["ЛЕКАРСТВО"] {
        int id PK
        string code "Код"
        string name "Название"
    }

    PROCEDURE["ПРОЦЕДУРА"] {
        int id PK
        string code "Код"
        string name "Название"
        text description "Описание"
    }

    ANALYSIS_CATALOG["ВИД АНАЛИЗА"] {
        int id PK
        string code "Код"
        string name "Название"
        text description "Описание"
    }

    %% ═══════════════════════════════════════
    %% ОПЕРАЦИОННЫЕ СУЩНОСТИ
    %% ═══════════════════════════════════════

    DOCTOR_ROOM["РАСПИСАНИЕ"] {
        int id PK
        int day_of_week "День недели"
        time start_time "Начало"
        time end_time "Окончание"
    }

    ANALYSIS["АНАЛИЗ"] {
        int id PK
        timestamp scheduled_at "Назначен"
        timestamp completed_at "Выполнен"
        text result "Результат"
    }

    PRESCRIPTION_DRUG["НАЗНАЧЕНИЕ ЛЕКАРСТВА"] {
        int id PK
        string dosage "Дозировка"
        string duration "Длительность"
    }

    PRESCRIPTION_PROCEDURE["НАЗНАЧЕНИЕ ПРОЦЕДУРЫ"] {
        int id PK
        int quantity "Количество"
        int duration_minutes "Длительность"
    }

    %% ═══════════════════════════════════════
    %% АДРЕСНЫЕ СПРАВОЧНИКИ
    %% ═══════════════════════════════════════

    COUNTRY["СТРАНА"] {
        int id PK
        string code "Код"
        string name "Название"
    }

    TOWN["ГОРОД"] {
        int id PK
        string code "Код"
        string name "Название"
    }

    STREET["УЛИЦА"] {
        int id PK
        string code "Код"
        string name "Название"
    }

    %% ═══════════════════════════════════════
    %% СВЯЗИ
    %% ═══════════════════════════════════════

    %% Врач - Специальность (M:N)
    DOCTOR }o--o{ SPECIALTY : "имеет"

    %% Расписание врачей
    DOCTOR ||--o{ DOCTOR_ROOM : "работает"
    ROOM ||--o{ DOCTOR_ROOM : "в кабинете"

    %% Приёмы
    PATIENT ||--o{ APPOINTMENT : "записывается"
    DOCTOR ||--o{ APPOINTMENT : "проводит"

    %% Медицинская запись
    APPOINTMENT ||--o| MEDICAL_RECORD : "формирует"
    MEDICAL_RECORD }o--|| DIAGNOSIS : "диагноз"

    %% Назначения
    MEDICAL_RECORD ||--o{ PRESCRIPTION_DRUG : "назначает"
    MEDICAL_RECORD ||--o{ PRESCRIPTION_PROCEDURE : "назначает"
    PRESCRIPTION_DRUG }o--|| DRUG : "лекарство"
    PRESCRIPTION_PROCEDURE }o--|| PROCEDURE : "процедура"

    %% Анализы
    APPOINTMENT ||--o{ ANALYSIS : "назначает"
    ANALYSIS }o--|| ANALYSIS_CATALOG : "тип анализа"

    %% Адрес пациента
    COUNTRY ||--o{ TOWN : "содержит"
    TOWN ||--o{ STREET : "содержит"
    PATIENT }o--|| STREET : "проживает"
```

---

## Как сгенерировать картинку

### Вариант 1: VS Code
1. Установи расширение "Markdown Preview Mermaid Support"
2. Открой этот файл и нажми Ctrl+Shift+V

### Вариант 2: Онлайн
1. Открой https://mermaid.live
2. Скопируй код диаграммы (между ```mermaid и ```)
3. Скачай как PNG/SVG

### Вариант 3: PlantUML
1. Открой https://www.plantuml.com/plantuml/uml
2. Загрузи файл `conceptual_model.puml`
3. Скачай как PNG/SVG

---

## Описание сущностей

### Основные сущности

| Сущность | Описание |
|----------|----------|
| ПАЦИЕНТ | Физическое лицо, обращающееся за медицинской помощью |
| ВРАЧ | Медицинский работник, оказывающий помощь |
| ПРИЁМ | Запланированный или состоявшийся визит пациента к врачу |
| МЕДИЦИНСКАЯ ЗАПИСЬ | Результат приёма: осмотр, диагноз, назначения |

### Справочники

| Сущность | Описание |
|----------|----------|
| СПЕЦИАЛЬНОСТЬ | Медицинская специализация врача (терапевт, кардиолог...) |
| КАБИНЕТ | Помещение поликлиники для приёма пациентов |
| ДИАГНОЗ | Код и название заболевания по МКБ-10 |
| ЛЕКАРСТВО | Медицинский препарат для назначения |
| ПРОЦЕДУРА | Медицинская манипуляция (ЭКГ, УЗИ, инъекция...) |
| ВИД АНАЛИЗА | Тип лабораторного исследования |

### Связи (кардинальность)

| Связь | Тип | Описание |
|-------|-----|----------|
| Пациент → Приём | 1:N | Один пациент может иметь много приёмов |
| Врач → Приём | 1:N | Один врач проводит много приёмов |
| Врач ↔ Специальность | M:N | Врач может иметь несколько специальностей |
| Врач ↔ Кабинет | M:N | Расписание работы врачей в кабинетах |
| Приём → Мед. запись | 1:1 | Один приём = одна запись |
| Мед. запись → Назначения | 1:N | Одна запись может содержать много назначений |
| Приём → Анализы | 1:N | На приёме могут назначить несколько анализов |
