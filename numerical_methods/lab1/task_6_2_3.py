"""
Задание 6.2.3 - Вычисление обратной матрицы методом Гаусса-Жордана.
Вариант 10: матрица из задания 6.2.1.
"""

N = 4
MATRIX_A = [
    [7.9, 5.6, 5.7, -7.2],
    [8.5, -4.8, 0.8, 3.5],
    [4.3, 4.2, -3.2, 9.3],
    [3.2, -1.4, -8.9, 3.3],
]


def build_augmented(a, n):
    aug = []
    for i in range(n):
        row = list(a[i])
        for j in range(n):
            row.append(1.0 if j == i else 0.0)
        aug.append(row)
    return aug


def find_pivot_row(aug, col, n):
    pivot_row = col
    pivot_value = abs(aug[col][col])
    row = col + 1
    while row < n:
        if abs(aug[row][col]) > pivot_value:
            pivot_value = abs(aug[row][col])
            pivot_row = row
        row += 1
    return pivot_row


def eliminate_column(aug, col, n):
    """Нормирует ведущую строку и обнуляет столбец col во всех остальных строках."""
    pivot = aug[col][col]
    width = 2 * n
    j = 0
    while j < width:
        aug[col][j] = aug[col][j] / pivot
        j += 1

    row = 0
    while row < n:
        if row != col:
            factor = aug[row][col]
            if factor != 0.0:
                j = 0
                while j < width:
                    aug[row][j] = aug[row][j] - factor * aug[col][j]
                    j += 1
        row += 1

    return pivot


def gauss_jordan_inverse(a, n):
    aug = build_augmented(a, n)

    for col in range(n):
        pivot_row = find_pivot_row(aug, col, n)
        if pivot_row != col:
            aug[col], aug[pivot_row] = aug[pivot_row], aug[col]

        pivot = eliminate_column(aug, col, n)
        print(f"  Шаг {col + 1}: столбец {col + 1} приведён к единичному виду "
              f"(ведущий элемент до нормировки = {pivot:.6f})")

    inverse = []
    for row in aug:
        inverse.append(row[n:])
    return inverse


def max_deviation_from_identity(a, a_inv, n):
    worst = 0.0
    for i in range(n):
        for j in range(n):
            s = 0.0
            for k in range(n):
                s += a[i][k] * a_inv[k][j]
            target = 1.0 if i == j else 0.0
            diff = abs(s - target)
            if diff > worst:
                worst = diff
    return worst


def main():
    print("=" * 60)
    print("Задание 6.2.3. Вариант 10. Обратная матрица (Гаусс-Жордан).")
    print("Входные данные:")
    for row in MATRIX_A:
        cells = ", ".join(f"{v:10.6f}" for v in row)
        print(f"    | {cells} |")
    print("=" * 60)

    inv_a = gauss_jordan_inverse(MATRIX_A, N)

    print("\nВыходные данные:")
    print("  A^-1:")
    for row in inv_a:
        cells = ", ".join(f"{v:10.6f}" for v in row)
        print(f"    | {cells} |")

    deviation = max_deviation_from_identity(MATRIX_A, inv_a, N)
    print(f"  невязка max|A*A^-1 - E| = {deviation:.3e}")


if __name__ == "__main__":
    main()
