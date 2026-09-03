"""
Задание 6.2.1 - Решение системы линейных алгебраических уравнений
методом Гаусса с частичным выбором ведущего элемента.
Вариант 10:
  7.9x1 + 5.6x2 + 5.7x3 - 7.2x4 = 6.68
  8.5x1 - 4.8x2 + 0.8x3 + 3.5x4 = 9.95
  4.3x1 + 4.2x2 - 3.2x3 + 9.3x4 = 8.6
  3.2x1 - 1.4x2 - 8.9x3 + 3.3x4 = 1.0
"""

N = 4
MATRIX_A = [
    [7.9, 5.6, 5.7, -7.2],
    [8.5, -4.8, 0.8, 3.5],
    [4.3, 4.2, -3.2, 9.3],
    [3.2, -1.4, -8.9, 3.3],
]
VECTOR_B = [6.68, 9.95, 8.6, 1.0]


def print_matrix(title, rows):
    print(f"  {title}")
    for row in rows:
        line = "    | "
        for value in row:
            line += f"{value:9.4f} "
        line += "|"
        print(line)


def build_augmented(a, b, n):
    aug = []
    for i in range(n):
        row = []
        for j in range(n):
            row.append(a[i][j])
        row.append(b[i])
        aug.append(row)
    return aug


def swap_rows(aug, i, k):
    aug[i], aug[k] = aug[k], aug[i]


def find_pivot_row(aug, col, n):
    """Ищет строку с наибольшим по модулю элементом в столбце col среди строк col..n-1."""
    pivot_row = col
    pivot_value = abs(aug[col][col])
    row = col + 1
    while row < n:
        if abs(aug[row][col]) > pivot_value:
            pivot_value = abs(aug[row][col])
            pivot_row = row
        row += 1
    return pivot_row


def forward_elimination(aug, n):
    for col in range(n - 1):
        pivot_row = find_pivot_row(aug, col, n)
        if pivot_row != col:
            swap_rows(aug, col, pivot_row)

        pivot = aug[col][col]
        row = col + 1
        while row < n:
            factor = aug[row][col] / pivot
            j = col
            while j <= n:
                aug[row][j] = aug[row][j] - factor * aug[col][j]
                j += 1
            row += 1

        print(f"\n  Шаг {col + 1} прямого хода (ведущий элемент в строке {col + 1}):")
        print_matrix("расширенная матрица:", aug)


def back_substitution(aug, n):
    x = [0.0] * n
    row = n - 1
    while row >= 0:
        s = aug[row][n]
        col = row + 1
        while col < n:
            s -= aug[row][col] * x[col]
            col += 1
        x[row] = s / aug[row][row]
        row -= 1
    return x


def compute_residual(a, x, b, n):
    r = []
    for i in range(n):
        s = b[i]
        for j in range(n):
            s -= a[i][j] * x[j]
        r.append(s)
    r_norm = 0.0
    for v in r:
        if abs(v) > r_norm:
            r_norm = abs(v)
    return r, r_norm


def main():
    print("=" * 60)
    print("Задание 6.2.1. Вариант 10. Метод Гаусса (схема частичного выбора).")
    print("Входные данные:")
    print(f"  порядок системы n = {N}")
    print_matrix("матрица A:", MATRIX_A)
    print(f"  вектор b = {VECTOR_B}")
    print("=" * 60)

    aug = build_augmented(MATRIX_A, VECTOR_B, N)
    forward_elimination(aug, N)
    x = back_substitution(aug, N)
    r, r_norm = compute_residual(MATRIX_A, x, VECTOR_B, N)

    print("\nВыходные данные:")
    x_str = ", ".join(f"{v:.6f}" for v in x)
    print(f"  решение x = [{x_str}]")
    r_str = ", ".join(f"{v:.3e}" for v in r)
    print(f"  невязка r = b - A*x = [{r_str}]")
    print(f"  ||r||_inf = {r_norm:.3e}")


if __name__ == "__main__":
    main()
