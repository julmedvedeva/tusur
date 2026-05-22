"""
Задание 6.5 — Численное интегрирование
Вариант 10: ∫₀² e^(-x²)·cos(x) dx,  n = 6 (для формулы Гаусса)
Методы: трапеции, Симпсона, прямоугольников (с правилом Рунге), формула Гаусса
"""

import math

A, B = 0.0, 2.0
N0 = 4       # начальное число интервалов (удваивается до сходимости)
EPS = 1e-6   # относительная точность
N_GAUSS = 6  # порядок формулы Гаусса


def f(x):
    return math.exp(-x ** 2) * math.cos(x)


# ─── Правило трапеций ──────────────────────────────────────────────
def trapezoid(a, b, n):
    h = (b - a) / n
    s = (f(a) + f(b)) / 2
    for i in range(1, n):
        s += f(a + i * h)
    return s * h


# ─── Правило Симпсона ──────────────────────────────────────────────
def simpson(a, b, n):
    if n % 2 != 0:
        n += 1
    h = (b - a) / n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i % 2 != 0 else 2) * f(a + i * h)
    return s * h / 3


# ─── Правило прямоугольников (средних) ────────────────────────────
def midpoint(a, b, n):
    h = (b - a) / n
    return sum(f(a + (i + 0.5) * h) for i in range(n)) * h


# ─── Автовыбор шага по правилу Рунге ─────────────────────────────
def auto_integrate(method, a, b, n0, eps, p):
    """
    Удваиваем n до выполнения критерия Рунге: |I_2n - I_n| / (2^p - 1) < eps * |I_2n|
    p: порядок метода (трапеция=2, Симпсон=4, прямоугольник=2)
    """
    n = n0
    I_prev = method(a, b, n)
    while True:
        n *= 2
        I_new = method(a, b, n)
        runge_err = abs(I_new - I_prev) / (2 ** p - 1)
        rel = runge_err / (abs(I_new) if abs(I_new) > 1e-15 else 1.0)
        if rel < eps:
            return I_new, n, runge_err
        I_prev = I_new


# ─── Формула Гаусса на [a,b] ──────────────────────────────────────
# Узлы и веса Гаусса–Лежандра на [-1, 1] для n=6
GAUSS_NODES_6 = [
    -0.9324695142, -0.6612093865, -0.2386191861,
     0.2386191861,  0.6612093865,  0.9324695142
]
GAUSS_WEIGHTS_6 = [
    0.1713244924, 0.3607615730, 0.4679139346,
    0.4679139346, 0.3607615730, 0.1713244924
]


def gauss_legendre(a, b, nodes, weights):
    """Формула Гаусса–Лежандра: трансформация [-1,1] → [a,b]."""
    mid = (a + b) / 2
    half = (b - a) / 2
    return half * sum(w * f(mid + half * t) for t, w in zip(nodes, weights))


def main():
    print("=" * 60)
    print("Задание 6.5. Вариант 10.")
    print("I = ∫₀² e^(-x²)·cos(x) dx")
    print("=" * 60)

    # Приближённое точное значение (Симпсон с большим n)
    I_ref = simpson(A, B, 10000)
    print(f"\nКонтрольное значение (Симпсон, n=10000): I ≈ {I_ref:.10f}")

    print("\n--- Квадратурные формулы с правилом Рунге ---")

    I_trap, n_trap, err_trap = auto_integrate(trapezoid, A, B, N0, EPS, p=2)
    print(f"\n  Трапеций:      I = {I_trap:.10f},  n = {n_trap:5d},  погрешность ≈ {err_trap:.2e}")

    I_simp, n_simp, err_simp = auto_integrate(simpson, A, B, N0, EPS, p=4)
    print(f"  Симпсона:      I = {I_simp:.10f},  n = {n_simp:5d},  погрешность ≈ {err_simp:.2e}")

    I_mid, n_mid, err_mid = auto_integrate(midpoint, A, B, N0, EPS, p=2)
    print(f"  Прямоугольн.:  I = {I_mid:.10f},  n = {n_mid:5d},  погрешность ≈ {err_mid:.2e}")

    print(f"\n--- Формула Гаусса–Лежандра (n = {N_GAUSS} узлов) ---")
    I_gauss = gauss_legendre(A, B, GAUSS_NODES_6, GAUSS_WEIGHTS_6)
    err_g = abs(I_gauss - I_ref)
    print(f"  I = {I_gauss:.10f},  погрешность ≈ {err_g:.2e}")
    print(f"\n  Сравнение с точным значением:")
    print(f"    Трапеций:     |I - I_ref| = {abs(I_trap - I_ref):.2e}")
    print(f"    Симпсона:     |I - I_ref| = {abs(I_simp - I_ref):.2e}")
    print(f"    Прямоугольн.: |I - I_ref| = {abs(I_mid - I_ref):.2e}")
    print(f"    Гаусс:        |I - I_ref| = {err_g:.2e}")


if __name__ == "__main__":
    main()
