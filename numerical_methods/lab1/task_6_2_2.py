"""
Задание 6.2.2 — Вычисление определителя матрицы методом Гаусса.
Вариант 10: матрица из задания 6.2.1.

В отличие от задания 6.2.1, здесь определитель накапливается прямо по ходу
исключения — как произведение ведущих элементов на каждом шаге, домноженное
на знак перестановок строк, — без построения отдельной "решающей" функции
для системы уравнений.
"""

MATRIX_A = [
    [7.9, 5.6, 5.7, -7.2],
    [8.5, -4.8, 0.8, 3.5],
    [4.3, 4.2, -3.2, 9.3],
    [3.2, -1.4, -8.9, 3.3],
]


def determinant_by_running_product(matrix):
    n = len(matrix)
    work = [row[:] for row in matrix]
    swaps = 0
    running_det = 1.0

    for step in range(n):
        lead = max(range(step, n), key=lambda r: abs(work[r][step]))
        if lead != step:
            work[step], work[lead] = work[lead], work[step]
            swaps += 1

        pivot = work[step][step]
        if abs(pivot) < 1e-15:
            print(f"  Шаг {step + 1}: ведущий элемент нулевой — det(A) = 0")
            return 0.0

        running_det *= pivot
        print(f"  Шаг {step + 1}: ведущий элемент = {pivot:.6f}, "
              f"накопленное произведение = {running_det:.6f}, перестановок = {swaps}")

        for row in range(step + 1, n):
            ratio = work[row][step] / pivot
            for col in range(step, n):
                work[row][col] -= ratio * work[step][col]

    sign = -1.0 if swaps % 2 else 1.0
    return sign * running_det


def main():
    print("=" * 60)
    print("Задание 6.2.2. Вариант 10. Определитель методом Гаусса.")
    print("Входные данные:")
    for row in MATRIX_A:
        print("   ", [f"{v:9.4f}" for v in row])
    print("=" * 60)
    print()

    det = determinant_by_running_product(MATRIX_A)

    print("\nВыходные данные:")
    print(f"  det(A) = {det:.6f}")


if __name__ == "__main__":
    main()
