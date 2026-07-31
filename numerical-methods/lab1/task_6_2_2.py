"""
Задание 6.2.2 — Вычисление определителя матрицы
Вариант 10: матрица из задания 6.2.1
Методы: Гаусс, декомпозиция (LU)
"""

import numpy as np

A_DATA = [
    [7.9,  5.6,  5.7, -7.2],
    [8.5, -4.8,  0.8,  3.5],
    [4.3,  4.2, -3.2,  9.3],
    [3.2, -1.4, -8.9,  3.3],
]


def det_gauss(A):
    """Определитель методом Гаусса. det = произведение диагоналей после прямого хода."""
    n = len(A)
    M = [list(row) for row in A]
    sign = 1
    for k in range(n):
        max_row = max(range(k, n), key=lambda i: abs(M[i][k]))
        if max_row != k:
            M[k], M[max_row] = M[max_row], M[k]
            sign *= -1
        if abs(M[k][k]) < 1e-15:
            return 0.0
        for i in range(k + 1, n):
            factor = M[i][k] / M[k][k]
            for j in range(k, n):
                M[i][j] -= factor * M[k][j]
        print(f"  Шаг {k+1} (прямой ход):")
        for row in M:
            print("   ", [f"{v:8.4f}" for v in row])
    det = sign
    for i in range(n):
        det *= M[i][i]
    return det


def det_lu(A):
    """Определитель через LU-декомпозицию. det(A) = det(L)*det(U) = prod(U_ii)."""
    n = len(A)
    L = [[0.0] * n for _ in range(n)]
    U = [[0.0] * n for _ in range(n)]
    for i in range(n):
        L[i][i] = 1.0
        for j in range(i, n):
            s = sum(L[i][k] * U[k][j] for k in range(i))
            U[i][j] = A[i][j] - s
        for j in range(i + 1, n):
            s = sum(L[j][k] * U[k][i] for k in range(i))
            L[j][i] = (A[j][i] - s) / U[i][i]
    print("  Матрица L:")
    for row in L:
        print("   ", [f"{v:8.4f}" for v in row])
    print("  Матрица U:")
    for row in U:
        print("   ", [f"{v:8.4f}" for v in row])
    det = 1.0
    for i in range(n):
        det *= U[i][i]
    return det


def main():
    print("=" * 60)
    print("Задание 6.2.2. Вариант 10. Определитель матрицы")
    print("=" * 60)
    A = A_DATA
    ref = np.linalg.det(np.array(A))
    print(f"\nКонтрольное значение (numpy): det(A) = {ref:.6f}")

    print("\n--- Метод Гаусса ---")
    d1 = det_gauss(A)
    print(f"  det(A) = {d1:.6f}")

    print("\n--- Метод декомпозиции (LU) ---")
    d2 = det_lu(A)
    print(f"  det(A) = {d2:.6f}")


if __name__ == "__main__":
    main()
