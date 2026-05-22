"""
Задание 6.1 — Решение уравнений с одной переменной
Вариант 10: f(x) = 10*cos(x) - 0.1*x^2
Методы: дихотомия, хорды, золотое сечение, Ньютон, итерации, комбинированный
"""

import math
import time

EPS1 = 1e-6   # точность по аргументу
EPS2 = 1e-6   # точность по функции
A, B = -10.0, 10.0  # интервал поиска
H_SCAN = 0.5  # шаг для отделения корней


def f(x):
    return 10 * math.cos(x) - 0.1 * x ** 2


def df(x):
    return -10 * math.sin(x) - 0.2 * x


def d2f(x):
    return -10 * math.cos(x) - 0.2


def separate_roots(a, b, h):
    """Отделение корней методом перебора. Возвращает список интервалов [a_i, b_i]."""
    intervals = []
    x1, x2 = a, a + h
    y1 = f(x1)
    while x2 <= b:
        y2 = f(x2)
        if y1 * y2 <= 0:
            intervals.append((x1, x2))
        x1, x2, y1 = x2, x2 + h, y2
    return intervals


def convergence_param(history, k=1):
    """Параметр сходимости α = |xn - xn-1| / |xn-1 - xn-2|^k."""
    if len(history) < 3:
        return float('nan')
    num = abs(history[-1] - history[-2])
    den = abs(history[-2] - history[-3]) ** k
    return num / den if den != 0 else float('nan')


def print_result(name, root, n_iter, n_f, n_df, n_d2f, elapsed, history, k=1):
    alpha = convergence_param(history, k)
    print(f"  Метод: {name}")
    print(f"    ξ = {root:.10f},  f(ξ) = {f(root):.2e}")
    print(f"    Итераций: {n_iter},  вычислений f: {n_f},  f': {n_df},  f'': {n_d2f}")
    print(f"    Время: {elapsed*1e6:.2f} мкс,  α = {alpha:.4f}")
    print()


# ─── Метод дихотомии ───────────────────────────────────────────────
def dichotomy(a, b, eps1=EPS1, eps2=EPS2):
    n_iter = n_f = 0
    history = []
    t0 = time.perf_counter()
    fa = f(a); fb = f(b)
    n_f += 2
    while True:
        c = (a + b) / 2
        fc = f(c)
        n_f += 1; n_iter += 1
        history.append(c)
        if (b - a) / 2 < eps1 or abs(fc) < eps2:
            break
        if fa * fc <= 0:
            b, fb = c, fc
        else:
            a, fa = c, fc
    elapsed = time.perf_counter() - t0
    print_result("Дихотомия", c, n_iter, n_f, 0, 0, elapsed, history, k=1)
    return c


# ─── Метод хорд ────────────────────────────────────────────────────
def chords(a, b, eps1=EPS1, eps2=EPS2):
    n_iter = n_f = 0
    history = []
    t0 = time.perf_counter()
    fa, fb = f(a), f(b)
    n_f += 2
    an, bn = a, b
    fan, fbn = fa, fb
    x_prev = a
    x = a - fan / (fbn - fan) * (bn - an)
    n_f += 1; n_iter += 1
    history.append(an)
    history.append(x)
    while True:
        fx = f(x)
        n_f += 1
        if abs(x - x_prev) < eps1 or abs(fx) < eps2:
            break
        if fan * fx <= 0:
            bn, fbn = x, fx
        else:
            an, fan = x, fx
        x_prev = x
        x = an - fan / (fbn - fan) * (bn - an)
        n_iter += 1
        history.append(x)
    elapsed = time.perf_counter() - t0
    print_result("Хорды", x, n_iter, n_f, 0, 0, elapsed, history, k=1)
    return x


# ─── Метод золотого сечения ────────────────────────────────────────
def golden_section(a, b, eps1=EPS1, eps2=EPS2):
    GAMMA = (math.sqrt(5) + 1) / 2
    n_iter = n_f = 0
    history = []
    t0 = time.perf_counter()
    ak, bk = a, b
    Delta1 = bk - ak
    Delta2 = Delta1 / GAMMA
    Delta3 = Delta1 * (GAMMA - 1) ** 2
    ck = ak + Delta3
    dk = ak + Delta2
    fak, fck, fdk, fbk = f(ak), f(ck), f(dk), f(bk)
    n_f += 4
    xk = (ak + bk) / 2
    history.append(xk)
    while True:
        n_iter += 1
        if fak * fdk <= 0:
            bk, fbk = dk, fdk
        else:
            ak, fak = ck, fck
        xk_new = (ak + bk) / 2
        history.append(xk_new)
        if (bk - ak) / 2 < eps1 or abs(f(xk_new)) < eps2:
            xk = xk_new
            n_f += 1
            break
        Delta1 = bk - ak
        Delta2 = Delta1 / GAMMA
        Delta3 = Delta1 * (GAMMA - 1) ** 2
        ck = ak + Delta3
        dk = ak + Delta2
        fck, fdk = f(ck), f(dk)
        n_f += 2
        xk = xk_new
    elapsed = time.perf_counter() - t0
    print_result("Золотое сечение", xk, n_iter, n_f, 0, 0, elapsed, history, k=1)
    return xk


# ─── Метод Ньютона ─────────────────────────────────────────────────
def newton(a, b, eps1=EPS1, eps2=EPS2):
    n_iter = n_f = n_df = n_d2f = 0
    history = []
    t0 = time.perf_counter()
    # Выбор начального приближения: x0 там, где f*f'' > 0
    fa, d2fa = f(a), d2f(a)
    fb, d2fb = f(b), d2f(b)
    n_f += 2; n_d2f += 2
    x = a if fa * d2fa > 0 else b
    history.append(x)
    while True:
        fx = f(x); dfx = df(x)
        n_f += 1; n_df += 1
        x_new = x - fx / dfx
        n_iter += 1
        history.append(x_new)
        if abs(x_new - x) < eps1 or abs(fx) < eps2:
            x = x_new
            break
        x = x_new
    elapsed = time.perf_counter() - t0
    print_result("Ньютон", x, n_iter, n_f, n_df, n_d2f, elapsed, history, k=2)
    return x


# ─── Метод простых итераций ────────────────────────────────────────
def simple_iteration(a, b, eps1=EPS1, eps2=EPS2):
    """
    x = g(x), где g(x) = arccos(0.01*x^2) при x>=0 или через сдвиг.
    Используем: x = arccos(0.1*x^2 / 10) = arccos(x^2/100).
    Для сходимости нужно |g'(x)| < 1 на [a,b].
    Используем tau-метод: x_{n+1} = x_n - tau*f(x_n).
    tau = 2/(M+m), M=max|f'|, m=min|f'| на [a,b].
    """
    n_iter = n_f = n_df = 0
    history = []
    t0 = time.perf_counter()
    # Оценка tau по интервалу [a, b]: tau = 2 / (maxF' + minF')
    # Нужно: tau * f'(x) ∈ (0, 2), т.е. знак tau совпадает со знаком f'
    xs = [a + i * (b - a) / 100 for i in range(101)]
    dfs_vals = [df(xi) for xi in xs]
    n_df += len(xs)
    maxdf = max(dfs_vals)
    mindf = min(dfs_vals)
    s = maxdf + mindf
    if abs(s) > 1e-12:
        tau = 2.0 / s   # правильный знак: tau > 0 если f'>0, tau < 0 если f'<0
    else:
        Mabs = max(abs(v) for v in dfs_vals)
        tau = 1.0 / Mabs if Mabs > 1e-12 else 0.01
    x = (a + b) / 2
    history.append(x)
    for _ in range(10000):
        fx = f(x)
        n_f += 1
        x_new = x - tau * fx
        n_iter += 1
        history.append(x_new)
        if abs(x_new - x) < eps1 or abs(fx) < eps2:
            x = x_new
            break
        x = x_new
    elapsed = time.perf_counter() - t0
    print_result("Простые итерации", x, n_iter, n_f, n_df, 0, elapsed, history, k=1)
    return x


# ─── Комбинированный метод (хорды + Ньютон) ────────────────────────
def combined(a, b, eps1=EPS1, eps2=EPS2):
    """
    Один конец движется по методу хорд, другой — по методу Ньютона.
    Неподвижный конец выбирается по условию f*f'' > 0.
    """
    n_iter = n_f = n_df = n_d2f = 0
    history = []
    t0 = time.perf_counter()
    fa, fb = f(a), f(b)
    d2fa = d2f(a)
    n_f += 2; n_d2f += 1
    # Ньютон стартует с того конца, где f*f'' > 0
    if fa * d2fa > 0:
        xN, xC = a, b  # xN — Ньютон, xC — хорды
    else:
        xN, xC = b, a
    history.append(xN)
    history.append(xC)
    while True:
        fxN = f(xN); dfxN = df(xN)
        fxC = f(xC)
        n_f += 2; n_df += 1
        xN_new = xN - fxN / dfxN
        xC_new = xC - fxC / (f(xN) - fxC) * (xN - xC)
        n_f += 1; n_iter += 1
        history.append(xN_new)
        if abs(xN_new - xC_new) < eps1 or abs(fxN) < eps2:
            xN = xN_new
            break
        xN, xC = xN_new, xC_new
    elapsed = time.perf_counter() - t0
    print_result("Комбинированный", xN, n_iter, n_f, n_df, n_d2f, elapsed, history, k=2)
    return xN


# ─── Главная функция ───────────────────────────────────────────────
def main():
    print("=" * 60)
    print("Задание 6.1. Вариант 10.")
    print("f(x) = 10·cos(x) − 0.1·x²")
    print(f"Интервал [{A}, {B}], eps1={EPS1}, eps2={EPS2}")
    print("=" * 60)

    intervals = separate_roots(A, B, H_SCAN)
    print(f"\nОтделение корней (шаг h={H_SCAN}):")
    for i, (ai, bi) in enumerate(intervals):
        print(f"  [{ai:.2f}, {bi:.2f}]  f(a)={f(ai):.4f}  f(b)={f(bi):.4f}")

    print(f"\nНайдено {len(intervals)} корней.\n")

    for i, (ai, bi) in enumerate(intervals):
        print(f"{'─'*60}")
        print(f"Корень #{i+1} на [{ai:.2f}, {bi:.2f}]")
        print()
        dichotomy(ai, bi)
        chords(ai, bi)
        golden_section(ai, bi)
        newton(ai, bi)
        simple_iteration(ai, bi)
        combined(ai, bi)


if __name__ == "__main__":
    main()
