# Министерство науки и высшего образования Российской Федерации

**Федеральное государственное автономное образовательное учреждение высшего образования**

## ТОМСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ СИСТЕМ УПРАВЛЕНИЯ И РАДИОЭЛЕКТРОНИКИ (ТУСУР)

Кафедра автоматизированных систем управления (АСУ)

---

# Разработка веб-приложения на Python

**Отчёт по лабораторной работе № 1**
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
7. [Деплой на сервер](#7)
8. [Выводы](#8)
9. [Список использованной литературы](#9)
10. [Приложение А — Листинг программы](#10)

---

<a name="1"></a>
## 1 Цель работы

Освоить разработку веб-приложений на Python с использованием фреймворка Flask: обработку загружаемых пользователем файлов, генерацию изображений и графиков на сервере, защиту веб-формы от автоматических запросов (капча), настройку непрерывной интеграции (CI) и развёртывание приложения на сервере через WSGI-сервер Gunicorn.

---

<a name="2"></a>
## 2 Задание (Вариант 10)

Веб-приложение должно рисовать на картинке вертикальный или горизонтальный крест заданного цвета в зависимости от желания пользователя, выдавать графики распределения цветов исходной картинки и новой картинки.

**Общие требования:**
- реализация на Flask;
- защита от автоматических запросов (капча или аналог);
- удобное расположение элементов ввода/вывода.

---

<a name="3"></a>
## 3 Краткое теоретическое введение

**Flask** — микрофреймворк для Python, предоставляющий маршрутизацию HTTP-запросов, шаблонизатор Jinja2 и работу с сессиями поверх WSGI. Используется для построения серверной логики приложения без избыточной инфраструктуры «полного» фреймворка.

**Pillow (PIL)** — библиотека обработки растровых изображений: загрузка, изменение и сохранение файлов различных форматов (PNG, JPEG, BMP), рисование геометрических примитивов на изображении.

**Matplotlib** — библиотека построения графиков; в данной работе используется для построения гистограмм распределения значений цветовых каналов (R, G, B) изображения.

**Gunicorn (Green Unicorn)** — WSGI HTTP-сервер для запуска Python веб-приложений в production-режиме (в отличие от встроенного отладочного сервера Flask, не предназначенного для реальной эксплуатации).

**Непрерывная интеграция (CI)** — практика автоматической проверки работоспособности проекта при каждом коммите/push: установка зависимостей, запуск проверок — с целью раннего обнаружения ошибок сборки.

---

<a name="4"></a>
## 4 Описание программного обеспечения

Приложение реализовано на языке Python 3.11 (при развёртывании на сервере — Python 3.10) с использованием фреймворка Flask.

**Используемые библиотеки** (`requirements.txt`):

```
Flask==3.0.3
Pillow==10.4.0
matplotlib==3.9.2
gunicorn==22.0.0
python-dotenv==1.0.1
```

**Структура проекта:**

```
web-services-course/labs/lab1/
├── app.py                  — основной модуль приложения (маршруты, логика)
├── requirements.txt        — зависимости проекта
├── Procfile                — команда запуска для PaaS/сервера (gunicorn)
├── .env                    — переменные окружения (SECRET_KEY), в git не попадает
├── .gitignore               — исключения для git (venv, кэш, загруженные файлы, .env)
├── templates/
│   ├── index.html          — форма загрузки изображения и параметров
│   └── result.html         — страница с результатом обработки
└── static/
    ├── uploads/             — загруженные пользователем исходные изображения
    └── generated/           — сгенерированные изображения с крестом
```

**Содержимое `.env`** (структура; реальное значение секрета не публикуется):

```
SECRET_KEY=<случайная шестнадцатеричная строка, 32 символа>
```

Переменная `SECRET_KEY` используется Flask для подписи сессионных cookie (хранения ответа капчи между запросами `GET /` и `POST /process`) и защиты от подделки сессии.

---

<a name="5"></a>
## 5 Порядок выполнения работы

1. Создан проект Flask: `app.py`, каталоги `templates/` и `static/`, виртуальное окружение `venv`, файл зависимостей `requirements.txt`.
2. Реализована форма загрузки изображения с выбором параметров: ориентация креста (вертикальный / горизонтальный / оба), цвет (color picker), толщина линии в пикселях.
3. Реализована капча: при каждом GET-запросе к `/` генерируется случайный пример на сложение двух однозначных чисел (`new_captcha`), правильный ответ кладётся в серверную сессию; при обработке формы (`POST /process`) введённый ответ сверяется с ожидаемым, при несовпадении — редирект обратно с сообщением об ошибке.
4. Реализована обработка изображения средствами Pillow: функция `draw_cross` рисует прямоугольник(и) заданного цвета и толщины по центру изображения в выбранной ориентации.
5. Реализовано построение гистограмм распределения каналов R/G/B (`histogram_png_base64`) для исходного и итогового изображений средствами Matplotlib; графики кодируются в base64 и встраиваются в HTML напрямую, без сохранения промежуточных файлов на диск.
6. Страница результата (`result.html`) выводит оба изображения и обе гистограммы рядом.
7. Настроен CI (GitHub Actions, `.github/workflows/ci.yml`): при каждом push/pull request в ветки `web_services_course`/`main` выполняется установка зависимостей и проверка успешного импорта модуля `app.py`.
8. Настроен запуск через Gunicorn (`Procfile`: `web: gunicorn app:app`) и выполнено развёртывание на VPS (см. раздел 7).

---

<a name="6"></a>
## 6 Результаты работы программы

Ниже приводятся скриншоты работы приложения.

**Рисунок 6.1 — Форма загрузки изображения и параметров креста**

*[скриншот главной страницы `/` — форма с выбором файла, ориентации, цвета, толщины и капчей]*

**Рисунок 6.2 — Страница результата обработки**

*[скриншот страницы `/process` — исходное и новое изображение с крестом, гистограммы R/G/B обоих изображений]*

> Скриншоты сделать локально или через `http://93.77.183.153:8001/` и вставить сюда перед сдачей отчёта.

---

<a name="7"></a>
## 7 Деплой на сервер

Приложение развёрнуто на VPS (Ubuntu, Yandex Cloud), на котором уже эксплуатируется другой проект (nginx на 80 порту). Чтобы не затрагивать существующий сервис, лабораторная работа вынесена на отдельный порт и запущена как самостоятельный systemd-сервис — без изменения конфигурации nginx.

**Команды развёртывания:**

```bash
# 1. Клонирование только нужного каталога репозитория (sparse-checkout)
git clone --filter=blob:none --sparse https://github.com/julmedvedeva/tusur.git tusur-web
cd tusur-web
git sparse-checkout set web_services_course/labs/lab1

# 2. Виртуальное окружение и зависимости
cd web_services_course/labs/lab1
sudo apt install python3.10-venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Файл окружения
echo "SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(16))')" > .env
```

**systemd-юнит** `/etc/systemd/system/lab1.service`:

```ini
[Unit]
Description=TUSUR lab1 flask app
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/tusur-web/web-services-course/labs/lab1
Environment="PATH=/home/ubuntu/tusur-web/web-services-course/labs/lab1/venv/bin"
ExecStart=/home/ubuntu/tusur-web/web-services-course/labs/lab1/venv/bin/gunicorn --workers 2 --bind 0.0.0.0:8001 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

**Запуск сервиса:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now lab1
sudo systemctl status lab1
```

Приложение доступно по адресу `http://93.77.183.153:8001/`. Существующий сервис на порту 80 (nginx, проект `intickets`) не затронут.

---

<a name="8"></a>
## 8 Выводы

Разработано веб-приложение на Flask, реализующее наложение цветного креста на изображение с последующим построением гистограмм распределения цветовых каналов исходного и обработанного изображений. Реализована базовая защита формы от автоматических запросов через капчу на основе серверной сессии. Настроена непрерывная интеграция средствами GitHub Actions (проверка установки зависимостей и корректности импорта приложения). Приложение подготовлено к промышленному запуску через WSGI-сервер Gunicorn и развёрнуто на VPS как самостоятельный systemd-сервис на отдельном порту, изолированно от уже работающих на сервере сервисов.

---

<a name="9"></a>
## 9 Список использованной литературы

1. Разработка веб-сервисов для научных и прикладных задач : методические указания по выполнению лабораторных работ. — Томск : ТУСУР.
2. Flask Documentation. — URL: https://flask.palletsprojects.com/
3. Pillow (PIL Fork) Documentation. — URL: https://pillow.readthedocs.io/
4. Matplotlib Documentation. — URL: https://matplotlib.org/stable/contents.html
5. Gunicorn Documentation. — URL: https://docs.gunicorn.org/

---

<a name="10"></a>
## Приложение А (обязательное) — Листинг программы

Файл: `web-services-course/labs/lab1/app.py`

```python
"""
Лабораторная работа №1: веб-приложение на Flask.
Вариант 10: рисует на картинке вертикальный или горизонтальный крест
заданного цвета, строит гистограммы распределения цветов исходного
и нового изображения.
"""
import base64
import io
import os
import random
import uuid

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from flask import Flask, flash, redirect, render_template, request, session, url_for
from PIL import Image, ImageDraw

_ = load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")
GENERATED_DIR = os.path.join(BASE_DIR, "static", "generated")
ALLOWED_EXT = {"png", "jpg", "jpeg", "bmp"}

app = Flask(__name__)

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10 MB


def allowed_file(filename):
    # Проверка расширения файла из белого списка ALLOWED_EXT
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT


def new_captcha():
    # Генерация примера на сложение, ответ сохраняется в сессии пользователя
    a, b = random.randint(1, 9), random.randint(1, 9)
    session["captcha_answer"] = a + b
    return f"{a} + {b}"


def draw_cross(image: Image.Image, orientation: str, color: tuple, thickness: int) -> Image.Image:
    # Рисует крест заданной ориентации, цвета и толщины по центру изображения
    img = image.convert("RGB").copy()
    draw = ImageDraw.Draw(img)
    w, h = img.size
    cx, cy = w // 2, h // 2
    if orientation in ("vertical", "both"):
        draw.rectangle([cx - thickness // 2, 0, cx + thickness // 2, h], fill=color)
    if orientation in ("horizontal", "both"):
        draw.rectangle([0, cy - thickness // 2, w, cy + thickness // 2], fill=color)
    return img


def histogram_png_base64(image: Image.Image, title: str) -> str:
    # Строит гистограмму каналов R/G/B, возвращает PNG в виде base64-строки
    img = image.convert("RGB")
    r, g, b = img.split()
    fig, ax = plt.subplots(figsize=(5, 3))
    ax.hist(list(r.getdata()), bins=256, range=(0, 255), color="red", alpha=0.5, label="R")
    ax.hist(list(g.getdata()), bins=256, range=(0, 255), color="green", alpha=0.5, label="G")
    ax.hist(list(b.getdata()), bins=256, range=(0, 255), color="blue", alpha=0.5, label="B")
    ax.set_title(title)
    ax.set_xlabel("Значение канала")
    ax.set_ylabel("Кол-во пикселей")
    ax.legend()
    fig.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("ascii")


@app.route("/", methods=["GET"])
def index():
    question = new_captcha()
    return render_template("index.html", captcha_question=question)


@app.route("/process", methods=["POST"])
def process():
    # Проверка капчи
    captcha_input = request.form.get("captcha", "").strip()
    expected = session.get("captcha_answer")
    if expected is None or not captcha_input.isdigit() or int(captcha_input) != expected:
        flash("Неверный ответ капчи. Попробуйте ещё раз.")
        return redirect(url_for("index"))

    # Валидация загруженного файла
    file = request.files.get("image")
    if not file or file.filename == "" or not allowed_file(file.filename):
        flash("Загрузите изображение в формате png/jpg/jpeg/bmp.")
        return redirect(url_for("index"))

    # Параметры креста из формы
    orientation = request.form.get("orientation", "vertical")
    color_hex = request.form.get("color", "#ff0000").lstrip("#")
    try:
        color = tuple(int(color_hex[i:i + 2], 16) for i in (0, 2, 4))
    except ValueError:
        color = (255, 0, 0)
    try:
        thickness = max(1, int(request.form.get("thickness", 10)))
    except ValueError:
        thickness = 10

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    os.makedirs(GENERATED_DIR, exist_ok=True)

    # Сохранение исходного и обработанного изображений под уникальными именами
    uid = uuid.uuid4().hex
    ext = file.filename.rsplit(".", 1)[1].lower()
    original_name = f"{uid}_original.{ext}"
    result_name = f"{uid}_result.{ext}"
    original_path = os.path.join(UPLOAD_DIR, original_name)
    result_path = os.path.join(GENERATED_DIR, result_name)

    file.save(original_path)
    original_image = Image.open(original_path)
    result_image = draw_cross(original_image, orientation, color, thickness)
    result_image.save(result_path)

    hist_original = histogram_png_base64(original_image, "Гистограмма: исходное изображение")
    hist_result = histogram_png_base64(result_image, "Гистограмма: новое изображение")

    return render_template(
        "result.html",
        original_url=url_for("static", filename=f"uploads/{original_name}"),
        result_url=url_for("static", filename=f"generated/{result_name}"),
        hist_original=hist_original,
        hist_result=hist_result,
    )


if __name__ == "__main__":
    app.run(debug=True)
```

Файл: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ web_services_course, main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: web_services_course/labs/lab1
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Check app imports
        run: python -c "import app"
```
