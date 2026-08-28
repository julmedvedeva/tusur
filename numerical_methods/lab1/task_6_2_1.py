"""
Задание 6.2.1 — Решение системы линейных алгебраических уравнений
методом Гаусса с частичным выбором ведущего элемента.
Вариант 10:
  7.9x1 + 5.6x2 + 5.7x3 - 7.2x4 = 6.68
  8.5x1 - 4.8x2 + 0.8x3 + 3.5x4 = 9.95
  4.3x1 + 4.2x2 - 3.2x3 + 9.3x4 = 8.6
  3.2x1 - 1.4x2 - 8.9x3 + 3.3x4 = 1.0

Ведущая строка на каждом шаге выбирается не физической перестановкой строк
матрицы, а перестановкой индексов в массиве порядка обхода `order`: это
избавляет от лишнего копирования строк и явно отделяет "логический" номер
строки от её позиции в исходном массиве.
"""

ORDER_N = 4
MATRIX_A = [
    [7.9, 5.6, 5.7, -7.2],
    [8.5, -4.8, 0.8, 3.5],
    [4.3, 4.2, -3.2, 9.3],
    [3.2, -1.4, -8.9, 3.3],
]
VECTOR_B = [6.68, 9.95, 8.6, 1.0]


def show_matrix(title, rows):
    print(f"  {title}")
    for row in rows:
        cells = "  ".join(f"{value:9.4f}" for value in row)
        print(f"    | {cells} |")


def eliminate_forward(aug, n):
    """Прямой ход: возвращает порядок строк order, приводящий aug к треугольному виду."""
    order = list(range(n))
    for step in range(n):
        candidates = range(step, n)
        best = max(candidates, key=lambda i: abs(aug[order[i]][step]))
        order[step], order[best] = order[best], order[step]

        lead_row = aug[order[step]]
        lead_value = lead_row[step]
        for i in range(step + 1, n):
            row = aug[order[i]]
            ratio = row[step] / lead_value
            for col in range(step, n + 1):
                row[col] -= ratio * lead_row[col]

        print(f"\n  Шаг {step + 1} прямого хода (ведущая строка исходно №{order[step] + 1}):")
        show_matrix("расширенная матрица в текущем порядке:", [aug[order[i]] for i in range(n)])
    return order


def substitute_backward(aug, order, n):
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        row = aug[order[i]]
        known_sum = sum(row[j] * x[j] for j in range(i + 1, n))
        x[i] = (row[n] - known_sum) / row[i]
    return x


def residual_vector(a, x, b):
    n = len(b)
    r = [b[i] - sum(a[i][j] * x[j] for j in range(n)) for i in range(n)]
    return r, max(abs(v) for v in r)


def main():
    n = ORDER_N
    print("=" * 60)
    print("Задание 6.2.1. Вариант 10. Метод Гаусса (схема частичного выбора).")
    print("Входные данные:")
    print(f"  порядок системы n = {n}")
    show_matrix("матрица A:", MATRIX_A)
    print(f"  вектор b = {VECTOR_B}")
    print("=" * 60)

    augmented = [list(MATRIX_A[i]) + [VECTOR_B[i]] for i in range(n)]
    order = eliminate_forward(augmented, n)
    x = substitute_backward(augmented, order, n)
    r, r_norm = residual_vector(MATRIX_A, x, VECTOR_B)

    print("\nВыходные данные:")
    print("  решение x = [" + ", ".join(f"{v:.6f}" for v in x) + "]")
    print("  невязка r = b - A*x = [" + ", ".join(f"{v:.3e}" for v in r) + "]")
    print(f"  ||r||_inf = {r_norm:.3e}")


if __name__ == "__main__":
    main()
