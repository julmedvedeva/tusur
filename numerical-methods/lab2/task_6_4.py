"""
Задание 6.4 — Численное дифференцирование
Вариант 10: y = sin²(x) + 1 (те же данные что 6.3)
Методы: производная полинома Ньютона, производная полинома Лагранжа
Вывод: y'(xⱼ), y''(xⱼ), погрешность
"""

import math

H = math.pi / 20
N_SRC = 10
N_NEW = 20

x_src = [i * H for i in range(N_SRC + 1)]
y_src = [math.sin(xi) ** 2 + 1 for xi in x_src]
x_new = [j * H / 2 for j in range(N_NEW + 1)]


def dy_exact(x):
    return math.sin(2 * x)   # d/dx (sin²x + 1) = 2*sin(x)*cos(x) = sin(2x)


def d2y_exact(x):
    return 2 * math.cos(2 * x)   # d²/dx² = 2*cos(2x)


# ─── Конечные разности ─────────────────────────────────────────────
def finite_differences(y):
    n = len(y)
    delta = [list(y)]
    for k in range(1, n):
        prev = delta[-1]
        delta.append([prev[i + 1] - prev[i] for i in range(len(prev) - 1)])
    return delta


# ─── Производные полинома Ньютона ──────────────────────────────────
def newton_derivatives(x_nodes, y_nodes, x_eval, h):
    """
    Производная P'_n(x) и P''_n(x) через конечные разности.
    t = (x - x_0) / h
    P'(x) = (1/h) * [Δy₀ + (2t-1)/2! * Δ²y₀ + (3t²-6t+2)/3! * Δ³y₀ + ...]
    """
    delta = finite_differences(y_nodes)
    n = len(x_nodes)
    dy1_list, dy2_list = [], []
    for x in x_eval:
        raw = int((x - x_nodes[0]) / h)
        idx = max(0, min(n - 5, raw))
        t = (x - x_nodes[idx]) / h
        # Первая производная (формула Ньютона вперёд, дифференцируя по t)
        dy1 = 0.0
        dy2 = 0.0
        # Члены ряда: P(t) = y₀ + t*Δy₀ + t(t-1)/2 * Δ²y₀ + ...
        # dP/dt = Δy₀ + (2t-1)/2 * Δ²y₀ + (3t²-6t+2)/6 * Δ³y₀ + ...
        # d²P/dt² = Δ²y₀ + (t-1) * Δ³y₀ + ...
        # dP/dx = (1/h) * dP/dt, d²P/dx² = (1/h²) * d²P/dt²
        if 1 < len(delta) and idx < len(delta[1]):
            dy1 += delta[1][idx]
        if 2 < len(delta) and idx < len(delta[2]):
            dy1 += (2 * t - 1) / 2.0 * delta[2][idx]
            dy2 += delta[2][idx]
        if 3 < len(delta) and idx < len(delta[3]):
            dy1 += (3 * t**2 - 6 * t + 2) / 6.0 * delta[3][idx]
            dy2 += (t - 1) * delta[3][idx]
        if 4 < len(delta) and idx < len(delta[4]):
            dy1 += (4 * t**3 - 18 * t**2 + 22 * t - 6) / 24.0 * delta[4][idx]
            dy2 += (6 * t**2 - 18 * t + 11) / 6.0 * delta[4][idx]
        dy1_list.append(dy1 / h)
        dy2_list.append(dy2 / h**2)
    return dy1_list, dy2_list


# ─── Производные полинома Лагранжа ────────────────────────────────
def lagrange_derivatives(x_nodes, y_nodes, x_eval):
    """Численное дифференцирование полинома Лагранжа."""
    n = len(x_nodes)
    dy1_list, dy2_list = [], []
    for x in x_eval:
        dy1 = 0.0
        dy2 = 0.0
        for i in range(n):
            # L_i(x) = prod_{j≠i} (x-x_j)/(x_i-x_j)
            # L_i'(x) = sum_{k≠i} [prod_{j≠i,j≠k} (x-x_j)/(x_i-x_j)] / (x_i-x_k)
            dLi = 0.0
            d2Li = 0.0
            for k in range(n):
                if k == i:
                    continue
                # Производная: L_i'(x) через сумму
                prod_k = 1.0
                for j in range(n):
                    if j != i and j != k:
                        prod_k *= (x - x_nodes[j]) / (x_nodes[i] - x_nodes[j])
                dLi += prod_k / (x_nodes[i] - x_nodes[k])
                # Вторая производная: L_i''(x)
                for m in range(n):
                    if m == i or m == k:
                        continue
                    prod_km = 1.0
                    for j in range(n):
                        if j != i and j != k and j != m:
                            prod_km *= (x - x_nodes[j]) / (x_nodes[i] - x_nodes[j])
                    d2Li += prod_km / ((x_nodes[i] - x_nodes[k]) * (x_nodes[i] - x_nodes[m]))
            dy1 += y_nodes[i] * dLi
            dy2 += y_nodes[i] * d2Li
        dy1_list.append(dy1)
        dy2_list.append(dy2)
    return dy1_list, dy2_list


def main():
    print("=" * 75)
    print("Задание 6.4. Вариант 10.")
    print("y = sin²(x) + 1,  y' = sin(2x),  y'' = 2·cos(2x)")
    print("=" * 75)

    dy1_n, dy2_n = newton_derivatives(x_src, y_src, x_new, H)
    dy1_l, dy2_l = lagrange_derivatives(x_src, y_src, x_new)

    header1 = f"{'j':>3}  {'xj':>10}  {'y_точн':>10}  {'y_N':>10}  {'|err|':>8}  {'y_L':>10}  {'|err|':>8}"
    print(f"\nПервая производная y':")
    print(header1)
    for j in range(N_NEW + 1):
        xj = x_new[j]
        d1e = dy_exact(xj)
        en = abs(d1e - dy1_n[j])
        el = abs(d1e - dy1_l[j])
        print(f"{j:>3}  {xj:>10.6f}  {d1e:>10.6f}  {dy1_n[j]:>10.6f}  {en:>8.2e}  {dy1_l[j]:>10.6f}  {el:>8.2e}")

    header2 = f"{'j':>3}  {'xj':>10}  {'y_точн':>10}  {'y_N':>10}  {'|err|':>8}  {'y_L':>10}  {'|err|':>8}"
    print(f"\nВторая производная y'':")
    print(header2)
    for j in range(N_NEW + 1):
        xj = x_new[j]
        d2e = d2y_exact(xj)
        en = abs(d2e - dy2_n[j])
        el = abs(d2e - dy2_l[j])
        print(f"{j:>3}  {xj:>10.6f}  {d2e:>10.6f}  {dy2_n[j]:>10.6f}  {en:>8.2e}  {dy2_l[j]:>10.6f}  {el:>8.2e}")

    max_en1 = max(abs(dy_exact(x_new[j]) - dy1_n[j]) for j in range(N_NEW + 1))
    max_el1 = max(abs(dy_exact(x_new[j]) - dy1_l[j]) for j in range(N_NEW + 1))
    max_en2 = max(abs(d2y_exact(x_new[j]) - dy2_n[j]) for j in range(N_NEW + 1))
    max_el2 = max(abs(d2y_exact(x_new[j]) - dy2_l[j]) for j in range(N_NEW + 1))
    print(f"\nМакс. погрешность y':  Ньютон {max_en1:.2e},  Лагранж {max_el1:.2e}")
    print(f"Макс. погрешность y'': Ньютон {max_en2:.2e},  Лагранж {max_el2:.2e}")


if __name__ == "__main__":
    main()
