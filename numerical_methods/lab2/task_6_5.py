"""
Задание 6.5 - Численное интегрирование.
Вариант 10: I = int_0^2 e^(-x^2)*cos(x) dx

3.1 Квадратурная формула Симпсона с автоматическим выбором шага по правилу
    Рунге; точность запрашивается у пользователя.
3.2 Формула Гаусса-Лежандра: узлы и веса вычисляются самостоятельно (корни
    полинома Лежандра ищутся методом Ньютона), порядок формулы увеличивается
    до тех пор, пока результат не перестанет меняться в пределах заданной
    пользователем точности.
"""

import math

A, B = 0.0, 2.0


def f(x):
    return math.exp(-x ** 2) * math.cos(x)


def read_eps(prompt):
    while True:
        raw = input(prompt)
        try:
            eps = float(raw)
        except ValueError:
            print("  нужно число, попробуйте снова")
            continue
        if eps > 0.0:
            return eps
        print("  точность должна быть положительным числом")


# --- 3.1 Формула Симпсона с правилом Рунге ------------------------------

def simpson(a, b, n):
    if n % 2 != 0:
        n += 1
    h = (b - a) / n
    total = f(a) + f(b)
    for i in range(1, n):
        total += (4.0 if i % 2 != 0 else 2.0) * f(a + i * h)
    return total * h / 3.0


def simpson_with_runge(a, b, n0, eps):
    """Удваивает n, пока оценка погрешности Рунге не станет меньше eps. p = 4 для Симпсона."""
    p = 4
    n = n0
    i_prev = simpson(a, b, n)
    while True:
        n *= 2
        i_new = simpson(a, b, n)
        runge_error = abs(i_new - i_prev) / (2 ** p - 1)
        scale = abs(i_new) if abs(i_new) > 1e-15 else 1.0
        if runge_error / scale < eps:
            return i_new, n, runge_error
        i_prev = i_new


# --- 3.2 Формула Гаусса-Лежандра с собственным вычислением узлов --------

def legendre(n, x):
    """Значения P_n(x) и P_n'(x) через рекуррентное соотношение."""
    p_prev, p_curr = 1.0, x
    if n == 0:
        return 1.0, 0.0
    for k in range(2, n + 1):
        p_next = ((2 * k - 1) * x * p_curr - (k - 1) * p_prev) / k
        p_prev, p_curr = p_curr, p_next
    derivative = n * (x * p_curr - p_prev) / (x * x - 1.0)
    return p_curr, derivative


def legendre_nodes_weights(n):
    """Узлы и веса формулы Гаусса-Лежандра на [-1, 1], узлы уточняются методом Ньютона."""
    nodes = []
    weights = []
    for i in range(n):
        x = math.cos(math.pi * (i + 0.75) / (n + 0.5))
        for _ in range(100):
            value, derivative = legendre(n, x)
            step = value / derivative
            x -= step
            if abs(step) < 1e-15:
                break
        _, derivative = legendre(n, x)
        w = 2.0 / ((1.0 - x * x) * derivative * derivative)
        nodes.append(x)
        weights.append(w)
    order = sorted(range(n), key=lambda k: nodes[k])
    return [nodes[k] for k in order], [weights[k] for k in order]


def gauss_integrate(a, b, n):
    nodes, weights = legendre_nodes_weights(n)
    mid = (a + b) / 2.0
    half = (b - a) / 2.0
    total = 0.0
    for t, w in zip(nodes, weights):
        total += w * f(mid + half * t)
    return total * half


def gauss_with_precision(a, b, eps, n_start=2, n_max=40):
    """Увеличивает порядок формулы Гаусса, пока результат не стабилизируется с точностью eps."""
    n = n_start
    i_prev = gauss_integrate(a, b, n)
    while n < n_max:
        n += 1
        i_new = gauss_integrate(a, b, n)
        scale = abs(i_new) if abs(i_new) > 1e-15 else 1.0
        if abs(i_new - i_prev) / scale < eps:
            return i_new, n
        i_prev = i_new
    return i_prev, n


def main():
    print("=" * 60)
    print("Задание 6.5. Вариант 10.")
    print("I = int_0^2 e^(-x^2)*cos(x) dx")
    print("=" * 60)

    i_ref = simpson(A, B, 10000)
    print(f"\nКонтрольное значение (Симпсон, n=10000): I = {i_ref:.10f}")

    print("\n--- 3.1 Формула Симпсона с правилом Рунге ---")
    eps1 = read_eps("Введите точность интегрирования eps: ")
    i_simp, n_simp, runge_err = simpson_with_runge(A, B, 4, eps1)
    print(f"\nВыходные данные:")
    print(f"  I = {i_simp:.10f}")
    print(f"  число разбиений n = {n_simp}")
    print(f"  оценка погрешности по Рунге = {runge_err:.2e}")
    print(f"  |I - I_ref| = {abs(i_simp - i_ref):.2e}")

    print("\n--- 3.2 Формула Гаусса-Лежандра с заданной точностью ---")
    eps2 = read_eps("Введите точность вычисления интеграла eps: ")
    i_gauss, n_gauss = gauss_with_precision(A, B, eps2)
    print(f"\nВыходные данные:")
    print(f"  I = {i_gauss:.10f}")
    print(f"  порядок формулы (число узлов) n = {n_gauss}")
    print(f"  |I - I_ref| = {abs(i_gauss - i_ref):.2e}")


if __name__ == "__main__":
    main()
