# Настройка базы данных PostgreSQL через Docker

## Требования

- Docker Desktop: https://www.docker.com/products/docker-desktop/

## Быстрый старт

### 1. Запустить Docker Desktop

Открой приложение Docker Desktop и дождись, пока иконка кита в меню-баре перестанет "крутиться".

### 2. Создать файл .env

Скопируй `.env.example` в `.env`:

```bash
cp .env.example .env
```

Отредактируй пароль в `.env` при необходимости.

### 3. Запустить базу данных

```bash
cd ~/Documents/computer-science/tusur/database/coursework
docker compose up -d
```

При первом запуске Docker:
- Скачает образ PostgreSQL 16
- Создаст контейнер `policlinic-db`
- Автоматически выполнит `policlinic_postgresql.sql` (схема)
- Автоматически выполнит `seed_data.sql` (тестовые данные)

### 4. Проверить, что всё работает

```bash
docker exec policlinic-db psql -U postgres -d policlinic -c "SELECT COUNT(*) FROM patients;"
```

Должно вернуть `12`.

## Команды Docker

| Команда | Описание |
|---------|----------|
| `docker compose up -d` | Запустить базу в фоне |
| `docker compose down` | Остановить базу |
| `docker compose logs -f` | Смотреть логи |
| `docker compose ps` | Статус контейнера |

## Подключение к базе

### Через терминал (psql)

```bash
docker exec -it policlinic-db psql -U postgres -d policlinic
```

Полезные команды psql:
- `\dt` — список таблиц
- `\d patients` — структура таблицы patients
- `\q` — выход

### Через GUI-клиент (DBeaver, TablePlus, pgAdmin)

| Параметр | Значение |
|----------|----------|
| Host | `localhost` |
| Port | `5432` |
| Database | `policlinic` |
| User | `postgres` |
| Password | из файла `.env` |

### Connection string

```
postgresql://postgres:password@localhost:5432/policlinic
```

## Сброс базы данных

Если нужно пересоздать базу с нуля:

```bash
docker compose down -v   # удалит данные
docker compose up -d     # создаст заново
```

## Структура файлов

```
coursework/
├── .env                      # Настройки (не в git)
├── .env.example              # Шаблон настроек
├── docker-compose.yml        # Конфигурация Docker
├── policlinic_postgresql.sql # Схема базы данных
├── seed_data.sql             # Тестовые данные
├── readme.md                 # Описание предметной области
└── readme2.md                # Эта инструкция
```
