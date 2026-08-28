"""
Задание 6.1 — Решение уравнения с одной переменной методом дихотомии.
Вариант 10: f(x) = 10*cos(x) - 0.1*x^2
"""

import math
import time

# ─── Входные данные ─────────────────────────────────────────────────
FUNC_NAME = "f(x) = 10*cos(x) - 0.1*x^2"
SEARCH_A, SEARCH_B = -10.0, 10.0   # интервал поиска корней
SCAN_STEP = 0.5                    # шаг сканирования при отделении корней
EPS_ARG = 1e-6                     # точность по аргументу
EPS_FUN = 1e-6                     # точность по функции


def f(x):
    return 10.0 * math.cos(x) - 0.1 * x * x


def locate_root_intervals(a, b, step):
    """Отделение корней перебором: ищет соседние узлы сетки с разными знаками f."""
    found = []
    x_left = a
    f_left = f(x_left)
    while x_left < b:
        x_right = min(x_left + step, b)
        f_right = f(x_right)
        if f_left == 0.0 or f_left * f_right < 0.0:
            found.append((x_left, x_right))
        x_left, f_left = x_right, f_right
    return found


class BisectionStats:
    """Счётчик итераций/вычислений и история приближений для одного корня."""

    def __init__(self):
        self.n_calls_f = 0
        self.approximations = []

    def evaluate(self, x):
        self.n_calls_f += 1
        return f(x)


def bisect_root(a, b, eps_arg=EPS_ARG, eps_fun=EPS_FUN):
    """Уточнение корня на [a, b] методом дихотомии (половинного деления)."""
    stats = BisectionStats()
    start_time = time.perf_counter()

    left, right = a, b
    f_left = stats.evaluate(left)
    mid = left
    f_mid = f_left

    while (right - left) / 2.0 >= eps_arg and abs(f_mid) >= eps_fun:
        mid = (left + right) / 2.0
        f_mid = stats.evaluate(mid)
        stats.approximations.append(mid)
        if f_left * f_mid <= 0.0:
            right = mid
        else:
            left, f_left = mid, f_mid

    elapsed = time.perf_counter() - start_time
    return {
        "root": mid,
        "f_root": f(mid),
        "n_iter": len(stats.approximations),
        "n_calls_f": stats.n_calls_f,
        "time_sec": elapsed,
        "history": stats.approximations,
    }


def convergence_rate(history, order=1):
    """α = |x_n - x_{n-1}| / |x_{n-1} - x_{n-2}|^order по трём последним приближениям."""
    if len(history) < 3:
        return float("nan")
    top = abs(history[-1] - history[-2])
    bottom = abs(history[-2] - history[-3]) ** order
    return top / bottom if bottom != 0.0 else float("nan")


def report_root(index, interval, result):
    alpha = convergence_rate(result["history"], order=1)
    a, b = interval
    print(f"Корень #{index} на [{a:.2f}, {b:.2f}]:")
    print(f"  xi = {result['root']:.10f}")
    print(f"  f(xi) = {result['f_root']:.3e}  (точность по функции: {EPS_FUN})")
    print(f"  точность по аргументу: {EPS_ARG}")
    print(f"  число итераций n = {result['n_iter']}")
    print(f"  число вычислений f = {result['n_calls_f']}")
    print(f"  время счёта = {result['time_sec'] * 1e6:.2f} мкс")
    print(f"  параметр сходимости alpha = {alpha:.4f}")
    print()


def main():
    print("=" * 60)
    print("Задание 6.1. Вариант 10. Метод дихотомии.")
    print("Входные данные:")
    print(f"  функция: {FUNC_NAME}")
    print(f"  интервал поиска: [{SEARCH_A}, {SEARCH_B}]")
    print(f"  eps1 (по аргументу) = {EPS_ARG}, eps2 (по функции) = {EPS_FUN}")
    print("=" * 60)

    intervals = locate_root_intervals(SEARCH_A, SEARCH_B, SCAN_STEP)
    print(f"\nОтделение корней (шаг h={SCAN_STEP}): найдено {len(intervals)} интервалов.")
    for a, b in intervals:
        print(f"  [{a:.2f}, {b:.2f}]  f(a)={f(a):.4f}  f(b)={f(b):.4f}")

    print("\nВыходные данные:")
    for i, (a, b) in enumerate(intervals, start=1):
        result = bisect_root(a, b)
        report_root(i, (a, b), result)


if __name__ == "__main__":
    main()
