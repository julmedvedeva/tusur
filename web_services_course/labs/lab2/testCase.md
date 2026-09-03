# Тест-кейсы — Music Tracks API (лаб. работа №2)

Запуск перед тестированием:

```bash
cd web_services_course/labs/lab2
source venv/bin/activate
python app.py
# http://127.0.0.1:5001
```

| № | Кейс | Запрос | Ожидаемый результат | Факт |
|---|---|---|---|---|
| 1 | Получить список произведений | `GET /tracks` | `200`, JSON-массив из 3 записей (id 1-3) | ✅ |
| 2 | Сортировка по возрастанию | `GET /tracks?sort_by=year&order=asc` | `200`, порядок year: 1905, 1975, 1982 | ✅ |
| 3 | Сортировка по убыванию | `GET /tracks?sort_by=rating&order=desc` | `200`, порядок rating: 4.9, 4.8, 4.7 | ✅ |
| 4 | Сортировка без order (по умолчанию asc) | `GET /tracks?sort_by=duration_sec` | `200`, порядок по возрастанию duration_sec | — |
| 5 | Сортировка по несуществующему полю | `GET /tracks?sort_by=foo` | `200`, порядок не меняется (sort_by игнорируется) | — |
| 6 | Агрегаты по числовым полям | `GET /tracks/stats` | `200`, `avg/max/min` для duration_sec, year, rating | ✅ |
| 7 | Получить существующую запись | `GET /tracks/1` | `200`, тело записи с id=1 | — |
| 8 | Получить несуществующую запись | `GET /tracks/999` | `404`, `{"error": "track not found"}` | ✅ |
| 9 | Создать запись — валидное тело | `POST /tracks` `{"title":"Test","artist":"A","genre":"Rock","duration_sec":200,"year":2020,"rating":4.5}` | `201`, тело с новым `id` | ✅ |
| 10 | Создать запись — не хватает обязательных полей | `POST /tracks` `{"title":"x"}` | `400`, `errors` со списком отсутствующих полей (artist, genre, duration_sec, year, rating) | ✅ |
| 11 | Создать запись — неверный тип поля | `POST /tracks` `{"title":"Test","artist":"A","genre":"Rock","duration_sec":"200","year":2020,"rating":4.5}` | `400`, `errors: ["duration_sec must be a number"]` | — |
| 12 | Создать запись — невалидный JSON в теле | `POST /tracks` тело `not json` | `400` (не `500`), `errors` со списком обязательных полей | ✅ |
| 13 | Частичное обновление — одно поле | `PUT /tracks/1` `{"rating":5.0}` | `200`, `rating` обновлён, остальные поля записи сохранены | ✅ |
| 14 | Обновление несуществующей записи | `PUT /tracks/999` `{"rating":5.0}` | `404`, `{"error": "track not found"}` | — |
| 15 | Обновление — неверный тип поля | `PUT /tracks/1` `{"year":"2020"}` | `400`, `errors: ["year must be a number"]` | — |
| 16 | Удаление существующей записи | `DELETE /tracks/4` | `204`, пустое тело | ✅ |
| 17 | Удаление несуществующей записи | `DELETE /tracks/999` | `404`, `{"error": "track not found"}` | — |
| 18 | Повторное удаление той же записи | `DELETE /tracks/4` (после кейса 16) | `404` | — |
| 19 | Swagger UI доступен | `GET /apidocs/` | `200`, страница Swagger UI загружается | ✅ |

## curl-команды по кейсам

```bash
# 1
curl -s http://127.0.0.1:5001/tracks

# 2-3
curl -s "http://127.0.0.1:5001/tracks?sort_by=year&order=asc"
curl -s "http://127.0.0.1:5001/tracks?sort_by=rating&order=desc"

# 6
curl -s http://127.0.0.1:5001/tracks/stats

# 7-8
curl -s http://127.0.0.1:5001/tracks/1
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5001/tracks/999

# 9-11
curl -s -X POST http://127.0.0.1:5001/tracks -H "Content-Type: application/json" \
  -d '{"title":"Test","artist":"A","genre":"Rock","duration_sec":200,"year":2020,"rating":4.5}'
curl -s -X POST http://127.0.0.1:5001/tracks -H "Content-Type: application/json" -d '{"title":"x"}'
curl -s -X POST http://127.0.0.1:5001/tracks -H "Content-Type: application/json" \
  -d '{"title":"Test","artist":"A","genre":"Rock","duration_sec":"200","year":2020,"rating":4.5}'

# 12
curl -s -X POST http://127.0.0.1:5001/tracks -H "Content-Type: application/json" -d 'not json'

# 13-15
curl -s -X PUT http://127.0.0.1:5001/tracks/1 -H "Content-Type: application/json" -d '{"rating":5.0}'
curl -s -X PUT http://127.0.0.1:5001/tracks/999 -H "Content-Type: application/json" -d '{"rating":5.0}'
curl -s -X PUT http://127.0.0.1:5001/tracks/1 -H "Content-Type: application/json" -d '{"year":"2020"}'

# 16-18
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE http://127.0.0.1:5001/tracks/4
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE http://127.0.0.1:5001/tracks/999
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE http://127.0.0.1:5001/tracks/4

# 19
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5001/apidocs/
```
