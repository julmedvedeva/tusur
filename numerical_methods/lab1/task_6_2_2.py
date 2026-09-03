"""
Задание 6.2.2 - Вычисление определителя матрицы методом Гаусса.
Вариант 10: матрица из задания 6.2.1.
"""

N = 4
MATRIX_A = [
    [7.9, 5.6, 5.7, -7.2],
    [8.5, -4.8, 0.8, 3.5],
    [4.3, 4.2, -3.2, 9.3],
    [3.2, -1.4, -8.9, 3.3],
]


def copy_matrix(a, n):
    result = []
    for i in range(n):
        result.append(list(a[i]))
    return result


def find_pivot_row(a, col, n):
    pivot_row = col
    pivot_value = abs(a[col][col])
    row = col + 1
    while row < n:
        if abs(a[row][col]) > pivot_value:
            pivot_value = abs(a[row][col])
            pivot_row = row
        row += 1
    return pivot_row


def eliminate_to_triangular(a, n):
    """Приводит матрицу a к верхнетреугольному виду in-place, возвращает число перестановок строк."""
    swap_count = 0
    for col in range(n - 1):
        pivot_row = find_pivot_row(a, col, n)
        if pivot_row != col:
            a[col], a[pivot_row] = a[pivot_row], a[col]
            swap_count += 1

        pivot = a[col][col]
        row = col + 1
        while row < n:
            factor = a[row][col] / pivot
            j = col
            while j < n:
                a[row][j] = a[row][j] - factor * a[col][j]
                j += 1
            row += 1
    return swap_count


def determinant_gauss(a, n):
    work = copy_matrix(a, n)
    swap_count = eliminate_to_triangular(work, n)

    product = 1.0
    for i in range(n):
        product *= work[i][i]

    if swap_count % 2 == 1:
        product = -product

    return product, work, swap_count


def main():
    print("=" * 60)
    print("Задание 6.2.2. Вариант 10. Определитель методом Гаусса.")
    print("Входные данные:")
    for row in MATRIX_A:
        cells = ", ".join(f"{v:.4f}" for v in row)
        print(f"    | {cells} |")
    print("=" * 60)

    det, triangular, swap_count = determinant_gauss(MATRIX_A, N)

    print(f"\nПеречислений строк выполнено: {swap_count}")
    print("Треугольная матрица после прямого хода:")
    for row in triangular:
        cells = ", ".join(f"{v:9.4f}" for v in row)
        print(f"    | {cells} |")

    print("\nВыходные данные:")
    print(f"  det(A) = {det:.6f}")


if __name__ == "__main__":
    main()
