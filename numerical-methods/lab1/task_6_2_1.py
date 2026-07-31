"""
Задание 6.2.1 — Решение систем линейных уравнений
Вариант 10:
  7.9x1 + 5.6x2 + 5.7x3 - 7.2x4 = 6.68
  8.5x1 - 4.8x2 + 0.8x3 + 3.5x4 = 9.95
  4.3x1 + 4.2x2 - 3.2x3 + 9.3x4 = 8.6
  3.2x1 - 1.4x2 - 8.9x3 + 3.3x4 = 1.0
Методы: Гаусс, ортогонализация, Халецкий (LU), простая итерация, Зейдель
"""

import numpy as np
import copy

A_DATA = [
    [7.9,  5.6,  5.7, -7.2],
    [8.5, -4.8,  0.8,  3.5],
    [4.3,  4.2, -3.2,  9.3],
    [3.2, -1.4, -8.9,  3.3],
]
B_DATA = [6.68, 9.95, 8.6, 1.0]
EPS = 1e-8


def residual(A, x, b):
    r = np.array(b) - np.array(A) @ np.array(x)
    return r, np.linalg.norm(r)


def print_solution(name, x, A, b):
    r, norm_r = residual(A, x, b)
    print(f"\n  Метод: {name}")
    print(f"    x = [{', '.join(f'{xi:.8f}' for xi in x)}]")
    print(f"    Невязка ||r|| = {norm_r:.2e}")


# ─── Метод Гаусса с частичным выбором ведущего элемента ───────────
def gauss(A, b):
    n = len(b)
    Ab = [list(A[i]) + [b[i]] for i in range(n)]
    # Прямой ход
    for k in range(n):
        # Частичный выбор
        max_row = max(range(k, n), key=lambda i: abs(Ab[i][k]))
        Ab[k], Ab[max_row] = Ab[max_row], Ab[k]
        pivot = Ab[k][k]
        for i in range(k + 1, n):
            factor = Ab[i][k] / pivot
            for j in range(k, n + 1):
                Ab[i][j] -= factor * Ab[k][j]
    # Обратный ход
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = Ab[i][n]
        for j in range(i + 1, n):
            x[i] -= Ab[i][j] * x[j]
        x[i] /= Ab[i][i]
    return x


# ─── Метод ортогонализации (QR через Грама–Шмидта) ────────────────
def orthogonalization(A, b):
    n = len(b)
    A_ = np.array(A, dtype=float)
    b_ = np.array(b, dtype=float)
    # Строим QR разложение: Q — ортогональная, R — верхнетреугольная
    Q = np.zeros((n, n))
    R = np.zeros((n, n))
    # Работаем со столбцами A
    for j in range(n):
        v = A_[:, j].copy()
        for i in range(j):
            R[i, j] = Q[:, i] @ A_[:, j]
            v -= R[i, j] * Q[:, i]
        R[j, j] = np.linalg.norm(v)
        Q[:, j] = v / R[j, j]
    # Решаем R*x = Q^T * b
    Qtb = Q.T @ b_
    # Обратная подстановка
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = Qtb[i]
        for j in range(i + 1, n):
            x[i] -= R[i, j] * x[j]
        x[i] /= R[i, i]
    return x.tolist()


# ─── Метод Халецкого (LU-декомпозиция без выбора ведущего) ────────
def cholesky_like(A, b):
    """
    Метод Халецкого — разложение A = L*U, где L нижнетреугольная с 1 на диагонали,
    U верхнетреугольная. Затем L*y = b, U*x = y.
    """
    n = len(b)
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
    # L * y = b
    y = [0.0] * n
    for i in range(n):
        y[i] = b[i] - sum(L[i][k] * y[k] for k in range(i))
    # U * x = y
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = (y[i] - sum(U[i][k] * x[k] for k in range(i + 1, n))) / U[i][i]
    return x


# ─── Метод простой итерации (Якоби) ───────────────────────────────
def simple_iteration_sle(A, b, eps=EPS, max_iter=10000):
    """
    Метод Якоби: x_i^{k+1} = (b_i - sum_{j≠i} A_ij * x_j^k) / A_ii
    Матрица итерации B = -D^{-1}*(L+U), c = D^{-1}*b.
    Сходится если ||B|| < 1 (достаточное условие — диагональное преобладание).
    """
    n = len(b)
    # Матрица итерации Якоби
    B = np.zeros((n, n))
    c = np.zeros(n)
    for i in range(n):
        for j in range(n):
            if j != i:
                B[i, j] = -A[i][j] / A[i][i]
        c[i] = b[i] / A[i][i]
    rho = max(abs(np.linalg.eigvals(B)))
    print(f"    [Якоби] спектральный радиус ||B|| = {rho:.4f}", end="")
    if rho >= 1.0:
        print(" — метод расходится!")
        return [float('nan')] * n, 0

    print()
    x = np.zeros(n)
    for it in range(max_iter):
        x_new = B @ x + c
        if np.linalg.norm(x_new - x) < eps:
            x = x_new
            break
        x = x_new
    return x.tolist(), it + 1


# ─── Метод Зейделя ────────────────────────────────────────────────
def seidel(A, b, eps=EPS, max_iter=10000):
    """
    Гаусс-Зейдель: использует обновлённые значения сразу.
    Сходится гарантированно при диагональном преобладании или СПД-матрице.
    """
    n = len(b)
    # Проверка сходимости через спектральный радиус матрицы итерации Зейделя
    D = np.diag([A[i][i] for i in range(n)])
    L = np.array([[A[i][j] if i > j else 0.0 for j in range(n)] for i in range(n)])
    U = np.array([[A[i][j] if i < j else 0.0 for j in range(n)] for i in range(n)])
    Bs = -np.linalg.inv(D + L) @ U
    rho = max(abs(np.linalg.eigvals(Bs)))
    print(f"    [Зейдель] спектральный радиус ||Bs|| = {rho:.4f}", end="")
    if rho >= 1.0:
        print(" — метод расходится!")
        return [float('nan')] * n, 0

    print()
    x = [0.0] * n
    for it in range(max_iter):
        x_old = x[:]
        for i in range(n):
            s = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x[i] = (b[i] - s) / A[i][i]
        if max(abs(x[i] - x_old[i]) for i in range(n)) < eps:
            break
    return x, it + 1


# ─── Главная функция ───────────────────────────────────────────────
def main():
    print("=" * 60)
    print("Задание 6.2.1. Вариант 10. Решение СЛУ 4×4")
    print("=" * 60)
    A, b = A_DATA, B_DATA

    x_ref = np.linalg.solve(np.array(A), np.array(b))
    print(f"\nКонтрольное решение (numpy): x = [{', '.join(f'{xi:.8f}' for xi in x_ref)}]")

    x1 = gauss(A, b)
    print_solution("Гаусс", x1, A, b)

    x2 = orthogonalization(A, b)
    print_solution("Ортогонализация (QR)", x2, A, b)

    x3 = cholesky_like(A, b)
    print_solution("Халецкий (LU)", x3, A, b)

    print("\n  --- Итерационные методы ---")
    print("  Проверка диагонального преобладания:")
    for i in range(len(A)):
        diag = abs(A[i][i])
        off = sum(abs(A[i][j]) for j in range(len(A)) if j != i)
        print(f"    Строка {i+1}: |a_ii|={diag:.2f}, сумма |a_ij|={off:.2f} — {'OK' if diag > off else 'НЕТ'}")

    x4, it4 = simple_iteration_sle(A, b)
    print_solution(f"Простая итерация ({it4} итер.)", x4, A, b)

    x5, it5 = seidel(A, b)
    print_solution(f"Зейдель ({it5} итер.)", x5, A, b)

    # Для итерационных методов: трансформация A^T*A*x = A^T*b
    # A^T*A — симметрична положительно определённая → итерации сходятся
    print("\n  [Примечание] Матрица не имеет диагонального преобладания.")
    print("  Применяем нормальные уравнения: A^T*A*x = A^T*b")
    An = np.array(A)
    bn = np.array(b)
    A2 = (An.T @ An).tolist()
    b2 = (An.T @ bn).tolist()
    x6, it6 = simple_iteration_sle(A2, b2)
    print_solution(f"Простая итерация A^T*A ({it6} итер.)", x6, A, b)
    x7, it7 = seidel(A2, b2)
    print_solution(f"Зейдель A^T*A ({it7} итер.)", x7, A, b)


if __name__ == "__main__":
    main()
