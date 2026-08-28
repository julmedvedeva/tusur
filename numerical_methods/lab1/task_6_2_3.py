"""
Задание 6.2.3 — Вычисление обратной матрицы методом Гаусса-Жордана.
Вариант 10: матрица из задания 6.2.1.

В отличие от задания 6.2.1 (прямой ход + обратная подстановка), здесь
применяется полная схема Гаусса-Жордана: расширенная матрица [A | E]
приводится сразу к виду [E | A^-1] — каждый ведущий столбец обнуляется
не только ниже, но и выше диагонали, обратная подстановка не нужна.
"""

MATRIX_A = [
    [7.9, 5.6, 5.7, -7.2],
    [8.5, -4.8, 0.8, 3.5],
    [4.3, 4.2, -3.2, 9.3],
    [3.2, -1.4, -8.9, 3.3],
]


def identity(n):
    return [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]


def gauss_jordan_inverse(matrix):
    n = len(matrix)
    augmented = [row[:] + identity(n)[i] for i, row in enumerate(matrix)]

    for col in range(n):
        lead = max(range(col, n), key=lambda r: abs(augmented[r][col]))
        augmented[col], augmented[lead] = augmented[lead], augmented[col]

        pivot = augmented[col][col]
        augmented[col] = [value / pivot for value in augmented[col]]

        for row in range(n):
            if row == col:
                continue
            factor = augmented[row][col]
            if factor == 0.0:
                continue
            augmented[row] = [
                augmented[row][k] - factor * augmented[col][k]
                for k in range(2 * n)
            ]

        print(f"  Шаг {col + 1}: столбец {col + 1} приведён к единичному виду "
              f"(ведущий элемент до нормировки = {pivot:.6f})")

    return [row[n:] for row in augmented]


def max_absolute_deviation(matrix, matrix_inv):
    n = len(matrix)
    worst = 0.0
    for i in range(n):
        for j in range(n):
            product_ij = sum(matrix[i][k] * matrix_inv[k][j] for k in range(n))
            target = 1.0 if i == j else 0.0
            worst = max(worst, abs(product_ij - target))
    return worst


def main():
    print("=" * 60)
    print("Задание 6.2.3. Вариант 10. Обратная матрица (Гаусс-Жордан).")
    print("Входные данные:")
    for row in MATRIX_A:
        print("   ", [f"{v:10.6f}" for v in row])
    print("=" * 60)

    inv_a = gauss_jordan_inverse(MATRIX_A)

    print("\nВыходные данные:")
    print("  A^-1:")
    for row in inv_a:
        print("   ", [f"{v:10.6f}" for v in row])

    deviation = max_absolute_deviation(MATRIX_A, inv_a)
    print(f"  невязка max|A*A^-1 - E| = {deviation:.3e}")


if __name__ == "__main__":
    main()
