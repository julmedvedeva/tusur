# Веб-интерфейс для базы данных Поликлиники

React + Bootstrap приложение для просмотра данных из PostgreSQL.

## Структура

```
view/
├── client/          # React приложение (Vite + React Bootstrap)
│   └── src/
│       ├── components/   # Компоненты таблиц
│       └── App.jsx       # Главный компонент с навигацией
├── server/          # Express.js API сервер
│   └── index.js     # API endpoints
└── package.json     # Скрипты для запуска
```

## Требования

- Node.js 18+
- Запущенная база данных PostgreSQL (см. ../readme2.md)

## Установка

```bash
cd app

# Установить зависимости для клиента и сервера
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

## Запуск

### Вариант 1: Раздельный запуск

Терминал 1 (API сервер):
```bash
cd app/server
npm run dev
```

Терминал 2 (React клиент):
```bash
cd app/client
npm run dev
```

### Вариант 2: Одновременный запуск

```bash
cd app
npm run dev
```

## Доступ

- **Веб-интерфейс:** http://localhost:3000
- **API сервер:** http://localhost:3001

## API Endpoints

| Endpoint | Описание |
|----------|----------|
| GET /api/doctors | Список врачей |
| GET /api/patients | Список пациентов |
| GET /api/appointments | Список приёмов |
| GET /api/medical-records | Медицинские записи |
| GET /api/diagnoses | Справочник диагнозов |
| GET /api/analyses-catalog | Каталог анализов |
| GET /api/drugs | Справочник лекарств |
| GET /api/procedures | Справочник процедур |
| GET /api/rooms | Список кабинетов |
| GET /api/specialties | Специальности врачей |

## Отображаемые сущности

- Врачи (со специальностями)
- Пациенты (с адресами)
- Приёмы (со статусами)
- Медицинские записи
- Диагнозы (МКБ-10)
- Каталог анализов
- Лекарства
- Процедуры
- Кабинеты
- Специальности
