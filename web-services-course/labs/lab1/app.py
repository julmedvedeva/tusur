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
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT


def new_captcha():
    a, b = random.randint(1, 9), random.randint(1, 9)
    session["captcha_answer"] = a + b
    return f"{a} + {b}"


def draw_cross(image: Image.Image, orientation: str, color: tuple, thickness: int) -> Image.Image:
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
    captcha_input = request.form.get("captcha", "").strip()
    expected = session.get("captcha_answer")
    if expected is None or not captcha_input.isdigit() or int(captcha_input) != expected:
        flash("Неверный ответ капчи. Попробуйте ещё раз.")
        return redirect(url_for("index"))

    file = request.files.get("image")
    if not file or file.filename == "" or not allowed_file(file.filename):
        flash("Загрузите изображение в формате png/jpg/jpeg/bmp.")
        return redirect(url_for("index"))

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
