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
