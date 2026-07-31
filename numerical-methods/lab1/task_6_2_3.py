"""
Задание 6.2.3 — Вычисление обратной матрицы
Вариант 10: матрица из задания 6.2.1
Методы: Гаусс, ортогонализация (QR), Халецкий (LU)
"""

import numpy as np

A_DATA = [
    [7.9,  5.6,  5.7, -7.2],
    [8.5, -4.8,  0.8,  3.5],
    [4.3,  4.2, -3.2,  9.3],
    [3.2, -1.4, -8.9,  3.3],
]


def inv_gauss(A):
    """Обратная матрица методом Гаусса: решаем A*X = I по столбцам."""
    n = len(A)
    result = []
    e = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]
    for col in range(n):
        # Строим расширенную матрицу [A | e_col]
        Ab = [list(A[i]) + [e[i][col]] for i in range(n)]
        for k in range(n):
            max_row = max(range(k, n), key=lambda i: abs(Ab[i][k]))
            Ab[k], Ab[max_row] = Ab[max_row], Ab[k]
            for i in range(k + 1, n):
                f = Ab[i][k] / Ab[k][k]
                for j in range(k, n + 1):
                    Ab[i][j] -= f * Ab[k][j]
        x = [0.0] * n
        for i in range(n - 1, -1, -1):
            x[i] = Ab[i][n]
            for j in range(i + 1, n):
                x[i] -= Ab[i][j] * x[j]
            x[i] /= Ab[i][i]
        result.append(x)
    # result[col] — столбцы; транспонируем → строки
    return [[result[col][row] for col in range(n)] for row in range(n)]


def inv_orthogonalization(A):
    """Обратная матрица через QR: A=QR, A^{-1} = R^{-1} Q^T."""
    n = len(A)
    A_ = np.array(A, dtype=float)
    Q = np.zeros((n, n))
    R = np.zeros((n, n))
    for j in range(n):
        v = A_[:, j].copy()
        for i in range(j):
            R[i, j] = Q[:, i] @ A_[:, j]
            v -= R[i, j] * Q[:, i]
        R[j, j] = np.linalg.norm(v)
        Q[:, j] = v / R[j, j]
    # R^{-1} через обратную подстановку для каждого столбца I
    Rinv = np.zeros((n, n))
    for col in range(n - 1, -1, -1):
        x = np.zeros(n)
        x[col] = 1.0 / R[col, col]
        for i in range(col - 1, -1, -1):
            x[i] = -sum(R[i, k] * x[k] for k in range(i + 1, n)) / R[i, i]
        Rinv[:, col] = x
    Ainv = Rinv @ Q.T
    return Ainv.tolist()


def inv_lu(A):
    """Обратная матрица через LU: решаем L*U*x = e_i для каждого столбца."""
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
    result = []
    for col in range(n):
        e = [1.0 if i == col else 0.0 for i in range(n)]
        # L*y = e
        y = [0.0] * n
        for i in range(n):
            y[i] = e[i] - sum(L[i][k] * y[k] for k in range(i))
        # U*x = y
        x = [0.0] * n
        for i in range(n - 1, -1, -1):
            x[i] = (y[i] - sum(U[i][k] * x[k] for k in range(i + 1, n))) / U[i][i]
        result.append(x)
    return [[result[col][row] for col in range(n)] for row in range(n)]


def print_matrix(M, name):
    print(f"  {name}:")
    for row in M:
        print("   ", [f"{v:10.6f}" for v in row])


def residual_inv(A, Ainv):
    """Невязка: ||A * A^{-1} - I||"""
    n = len(A)
    prod = [[sum(A[i][k] * Ainv[k][j] for k in range(n)) for j in range(n)] for i in range(n)]
    err = max(abs(prod[i][j] - (1.0 if i == j else 0.0)) for i in range(n) for j in range(n))
    return err


def main():
    print("=" * 60)
    print("Задание 6.2.3. Вариант 10. Обратная матрица")
    print("=" * 60)
    A = A_DATA
    ref = np.linalg.inv(np.array(A))
    print("\nКонтрольное значение (numpy):")
    print_matrix(ref.tolist(), "A^{-1}")

    print("\n--- Метод Гаусса ---")
    inv1 = inv_gauss(A)
    print_matrix(inv1, "A^{-1}")
    print(f"  Невязка max|A*A^{{-1}} - I| = {residual_inv(A, inv1):.2e}")

    print("\n--- Метод ортогонализации (QR) ---")
    inv2 = inv_orthogonalization(A)
    print_matrix(inv2, "A^{-1}")
    print(f"  Невязка max|A*A^{{-1}} - I| = {residual_inv(A, inv2):.2e}")

    print("\n--- Метод Халецкого (LU) ---")
    inv3 = inv_lu(A)
    print_matrix(inv3, "A^{-1}")
    print(f"  Невязка max|A*A^{{-1}} - I| = {residual_inv(A, inv3):.2e}")


if __name__ == "__main__":
    main()
