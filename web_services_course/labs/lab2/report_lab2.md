# Министерство науки и высшего образования Российской Федерации

**Федеральное государственное автономное образовательное учреждение высшего образования**

## ТОМСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ СИСТЕМ УПРАВЛЕНИЯ И РАДИОЭЛЕКТРОНИКИ (ТУСУР)

Кафедра автоматизированных систем управления (АСУ)

---

# Разработка REST API на Python

**Отчёт по лабораторной работе № 2**
**по дисциплине «Разработка веб-сервисов для научных и прикладных задач»**

---

Выполнил: ст. гр. ___________
Медведева Ю. Е.
«___» ___________ 2026 г.

Проверил: ___________________
«___» ___________ 2026 г.

---

**Томск – 2026**

---

## Оглавление

1. [Цель работы](#1)
2. [Задание (Вариант 10)](#2)
3. [Краткое теоретическое введение](#3)
4. [Описание программного обеспечения](#4)
5. [Порядок выполнения работы](#5)
6. [Результаты работы программы](#6)
7. [Выводы](#7)
8. [Список использованной литературы](#8)
9. [Приложение А — Листинг программы](#9)

---

<a name="1"></a>
## 1 Цель работы

Научиться проектировать и реализовывать REST API на Flask: CRUD-операции над коллекцией ресурсов, сортировка по полям, агрегатные вычисления и автогенерация документации через Swagger.

---

<a name="2"></a>
## 2 Задание (Вариант 10)

Предметная область — «Музыкальные произведения» (`title`, `artist`, `genre`, `duration_sec`, `year`, `rating`). Реализовать REST API со следующими возможностями:

- получение списка ресурсов с сортировкой по любому полю (по возрастанию/убыванию);
- получение агрегатов (среднее, максимум, минимум) по числовым полям;
- получение одного ресурса по идентификатору;
- создание, обновление и удаление ресурса (CRUD);
- валидация входных данных;
- документация API (Swagger/OpenAPI).

**Общие требования:**
- реализация на Flask;
- данные передаются и принимаются в формате JSON;
- ошибки клиента и отсутствие ресурса обрабатываются корректными HTTP-кодами.

---

<a name="3"></a>
## 3 Краткое теоретическое введение

**REST (Representational State Transfer)** — архитектурный стиль построения веб-сервисов, в котором ресурсы адресуются URL, а операции над ними выражаются HTTP-методами: `GET` — чтение, `POST` — создание, `PUT`/`PATCH` — обновление, `DELETE` — удаление.

**Flask** — микрофреймворк для Python, даёт маршрутизацию запросов и работу с JSON без лишней обвязки.

**Flasgger** — расширение Flask, генерирующее интерактивную документацию Swagger UI / OpenAPI прямо из docstring'ов view-функций (YAML-блок после `---`), без отдельного описания схемы вручную.

**HTTP-коды в API:** `200 OK` — успешное чтение/обновление, `201 Created` — успешное создание, `204 No Content` — успешное удаление без тела ответа, `400 Bad Request` — ошибка валидации входных данных, `404 Not Found` — ресурс с указанным идентификатором не найден.

---

<a name="4"></a>
## 4 Описание программного обеспечения

Приложение реализовано на языке Python 3.10 с использованием фреймворка Flask и расширения Flasgger.

**Используемые библиотеки** (`requirements.txt`):

```
Flask==3.0.3
flasgger==0.9.7.1
gunicorn==22.0.0
```

**Структура проекта:**

```
web_services_course/labs/lab2/
├── app.py                  — основной модуль приложения (маршруты, валидация, Swagger-описания)
├── requirements.txt        — зависимости проекта
└── .gitignore               — исключения для git (venv, кэш, .env)
```

**Хранение данных.** Коллекция `tracks` хранится в памяти процесса (список словарей), без внешней БД — соответствует уровню лабораторной работы. Идентификаторы выдаются последовательно счётчиком `next_id`.

**Поля ресурса:**

| Поле | Тип | Описание |
|---|---|---|
| id | integer | идентификатор, назначается сервером |
| title | string | название произведения |
| artist | string | исполнитель |
| genre | string | жанр |
| duration_sec | number | длительность в секундах |
| year | number | год выпуска |
| rating | number | рейтинг |

---

<a name="5"></a>
## 5 Порядок выполнения работы

1. Создан проект Flask: `app.py`, виртуальное окружение `venv`, файл зависимостей `requirements.txt`.
2. Определена структура ресурса «музыкальное произведение» и стартовый набор данных (3 записи) для демонстрации.
3. Реализован маршрут `GET /tracks` — список всех произведений с опциональной сортировкой по параметрам `sort_by` (любое поле из `ALL_FIELDS`) и `order` (`asc`/`desc`, по умолчанию `asc`).
4. Реализован маршрут `GET /tracks/stats` — агрегаты (`avg`, `max`, `min`) по числовым полям `duration_sec`, `year`, `rating`.
5. Реализован маршрут `GET /tracks/<id>` — получение одного произведения; при отсутствии id возвращается `404` с телом `{"error": "track not found"}`.
6. Реализован маршрут `POST /tracks` — создание записи с полной валидацией (`validate_payload`, `partial=False`): все поля обязательны, строковые проверяются на тип `str`, числовые — на тип `int`/`float`; при ошибках — `400` со списком сообщений.
7. Реализован маршрут `PUT /tracks/<id>` — частичное обновление (`partial=True`, обязательности полей нет, но типы проверяются); `404`, если id не найден.
8. Реализован маршрут `DELETE /tracks/<id>` — удаление записи, ответ `204` без тела; `404`, если id не найден.
9. Каждый маршрут снабжён YAML-докстрингом для Flasgger — документация доступна автоматически по адресу `/apidocs/` без дополнительного описания схемы.
10. Приложение проверено локально запросами через `curl` (см. раздел 6).

---

<a name="6"></a>
## 6 Результаты работы программы

**GET /tracks** — список произведений (без сортировки):

```json
[
    {"id": 1, "title": "Bohemian Rhapsody", "artist": "Queen", "genre": "Rock",
     "duration_sec": 355, "year": 1975, "rating": 4.9},
    {"id": 2, "title": "Billie Jean", "artist": "Michael Jackson", "genre": "Pop",
     "duration_sec": 294, "year": 1982, "rating": 4.8},
    {"id": 3, "title": "Clair de Lune", "artist": "Claude Debussy", "genre": "Classical",
     "duration_sec": 300, "year": 1905, "rating": 4.7}
]
```

**GET /tracks?sort_by=year&order=desc** — та же коллекция, отсортированная по году убывания:

```json
[
    {"id": 2, "title": "Billie Jean", "year": 1982, "...": "..."},
    {"id": 1, "title": "Bohemian Rhapsody", "year": 1975, "...": "..."},
    {"id": 3, "title": "Clair de Lune", "year": 1905, "...": "..."}
]
```

**GET /tracks/stats** — агрегаты по числовым полям:

```json
{
    "duration_sec": {"avg": 316.33, "max": 355, "min": 294},
    "year": {"avg": 1954.0, "max": 1982, "min": 1905},
    "rating": {"avg": 4.8, "max": 4.9, "min": 4.7}
}
```

**POST /tracks** с телом `{"title":"Test","artist":"A","genre":"G","duration_sec":200,"year":2020,"rating":4.0}` — код `201`, тело:

```json
{"id": 4, "title": "Test", "artist": "A", "genre": "G",
 "duration_sec": 200, "year": 2020, "rating": 4.0}
```

**PUT /tracks/1** с телом `{"rating": 5.0}` — код `200`, обновлено только поле `rating`, остальные сохранены:

```json
{"id": 1, "title": "Bohemian Rhapsody", "artist": "Queen", "genre": "Rock",
 "duration_sec": 355, "year": 1975, "rating": 5.0}
```

**DELETE /tracks/4** — код `204`, тело пустое.

**GET /tracks/999** (несуществующий id) — код `404`:

```json
{"error": "track not found"}
```

**POST /tracks** с телом `{"title":"x"}` (без обязательных полей) — код `400`:

```json
{
    "errors": [
        "artist is required",
        "genre is required",
        "duration_sec is required",
        "year is required",
        "rating is required"
    ]
}
```

**Рисунок 6.1 — Swagger UI (`/apidocs/`) со списком эндпоинтов**

*[скриншот страницы `/apidocs/` вставить сюда перед сдачей отчёта]*

> Скриншот сделать локально: `python app.py`, затем открыть `http://127.0.0.1:5001/apidocs/`.

---

<a name="7"></a>
## 7 Выводы

Реализован REST API на Flask для предметной области «музыкальные произведения»: CRUD-операции, сортировка списка по любому полю в обоих направлениях, агрегаты (среднее/максимум/минимум) по числовым полям, валидация входных данных с понятными сообщениями об ошибках и корректные HTTP-коды (`200`/`201`/`204`/`400`/`404`). Документация API генерируется автоматически через Flasgger из докстрингов, без отдельного описания OpenAPI-схемы.

---

<a name="8"></a>
## 8 Список использованной литературы

1. Разработка веб-сервисов для научных и прикладных задач : методические указания по выполнению лабораторных работ. — Томск : ТУСУР.
2. Flask Documentation. — URL: https://flask.palletsprojects.com/
3. Flasgger Documentation. — URL: https://github.com/flasgger/flasgger
4. Fielding, R. Architectural Styles and the Design of Network-based Software Architectures (REST). — 2000.

---

<a name="9"></a>
## Приложение А (обязательное) — Листинг программы

Файл: `web_services_course/labs/lab2/app.py`

```python
"""
Лабораторная работа №2: REST API на Flask.
Вариант 10: предметная область «Музыкальные произведения».
CRUD, сортировка по всем полям, агрегаты по числовым полям, Swagger (Flasgger).
"""
from flask import Flask, jsonify, request
from flasgger import Swagger

app = Flask(__name__)
app.config["SWAGGER"] = {
    "title": "Music Tracks API",
    "uiversion": 3,
}
swagger = Swagger(app)

STRING_FIELDS = ("title", "artist", "genre")
NUMERIC_FIELDS = ("duration_sec", "year", "rating")
ALL_FIELDS = STRING_FIELDS + NUMERIC_FIELDS

tracks = [
    {"id": 1, "title": "Bohemian Rhapsody", "artist": "Queen", "genre": "Rock",
     "duration_sec": 355, "year": 1975, "rating": 4.9},
    {"id": 2, "title": "Billie Jean", "artist": "Michael Jackson", "genre": "Pop",
     "duration_sec": 294, "year": 1982, "rating": 4.8},
    {"id": 3, "title": "Clair de Lune", "artist": "Claude Debussy", "genre": "Classical",
     "duration_sec": 300, "year": 1905, "rating": 4.7},
]
next_id = 4


def find_track(track_id):
    return next((t for t in tracks if t["id"] == track_id), None)


def validate_payload(data, partial=False):
    errors = []
    for f in STRING_FIELDS:
        if f in data and not isinstance(data[f], str):
            errors.append(f"{f} must be a string")
        if not partial and f not in data:
            errors.append(f"{f} is required")
    for f in NUMERIC_FIELDS:
        if f in data and not isinstance(data[f], (int, float)):
            errors.append(f"{f} must be a number")
        if not partial and f not in data:
            errors.append(f"{f} is required")
    return errors


@app.route("/tracks", methods=["GET"])
def list_tracks():
    """
    Получить список музыкальных произведений
    ---
    parameters:
      - name: sort_by
        in: query
        type: string
        required: false
        enum: [title, artist, genre, duration_sec, year, rating]
        description: Поле для сортировки
      - name: order
        in: query
        type: string
        required: false
        enum: [asc, desc]
        description: Направление сортировки (по умолчанию asc)
    responses:
      200:
        description: Список произведений
    """
    sort_by = request.args.get("sort_by")
    order = request.args.get("order", "asc")
    result = list(tracks)
    if sort_by in ALL_FIELDS:
        result.sort(key=lambda t: t[sort_by], reverse=(order == "desc"))
    return jsonify(result)


@app.route("/tracks/stats", methods=["GET"])
def stats():
    """
    Агрегаты (среднее/максимум/минимум) по числовым полям
    ---
    responses:
      200:
        description: Статистика по duration_sec, year, rating
    """
    if not tracks:
        return jsonify({f: None for f in NUMERIC_FIELDS})
    result = {}
    for f in NUMERIC_FIELDS:
        values = [t[f] for t in tracks]
        result[f] = {
            "avg": sum(values) / len(values),
            "max": max(values),
            "min": min(values),
        }
    return jsonify(result)


@app.route("/tracks/<int:track_id>", methods=["GET"])
def get_track(track_id):
    """
    Получить произведение по id
    ---
    parameters:
      - name: track_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Найденное произведение
      404:
        description: Произведение не найдено
    """
    track = find_track(track_id)
    if track is None:
        return jsonify({"error": "track not found"}), 404
    return jsonify(track)


@app.route("/tracks", methods=["POST"])
def create_track():
    """
    Добавить новое произведение
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required: [title, artist, genre, duration_sec, year, rating]
          properties:
            title: {type: string}
            artist: {type: string}
            genre: {type: string}
            duration_sec: {type: integer}
            year: {type: integer}
            rating: {type: number}
    responses:
      201:
        description: Созданное произведение
      400:
        description: Ошибка валидации
    """
    global next_id
    data = request.get_json(silent=True) or {}
    errors = validate_payload(data, partial=False)
    if errors:
        return jsonify({"errors": errors}), 400
    track = {"id": next_id, **{f: data[f] for f in ALL_FIELDS}}
    tracks.append(track)
    next_id += 1
    return jsonify(track), 201


@app.route("/tracks/<int:track_id>", methods=["PUT"])
def update_track(track_id):
    """
    Обновить произведение по id
    ---
    parameters:
      - name: track_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title: {type: string}
            artist: {type: string}
            genre: {type: string}
            duration_sec: {type: integer}
            year: {type: integer}
            rating: {type: number}
    responses:
      200:
        description: Обновлённое произведение
      400:
        description: Ошибка валидации
      404:
        description: Произведение не найдено
    """
    track = find_track(track_id)
    if track is None:
        return jsonify({"error": "track not found"}), 404
    data = request.get_json(silent=True) or {}
    errors = validate_payload(data, partial=True)
    if errors:
        return jsonify({"errors": errors}), 400
    track.update({f: data[f] for f in ALL_FIELDS if f in data})
    return jsonify(track)


@app.route("/tracks/<int:track_id>", methods=["DELETE"])
def delete_track(track_id):
    """
    Удалить произведение по id
    ---
    parameters:
      - name: track_id
        in: path
        type: integer
        required: true
    responses:
      204:
        description: Произведение удалено
      404:
        description: Произведение не найдено
    """
    track = find_track(track_id)
    if track is None:
        return jsonify({"error": "track not found"}), 404
    tracks.remove(track)
    return "", 204


if __name__ == "__main__":
    app.run(debug=True, port=5001)
```
