"""
Задание 6.3 — Приближение функций (интерполяция)
Вариант 10: y = sin²(x) + 1
Исходная сетка: xᵢ = i·h,  h = π/20,  i = 0,...,10
Новая сетка:   xⱼ = j·h/2, j = 0,...,20
Методы: полином Ньютона (равномерная сетка), полином Лагранжа
"""

import math

H = math.pi / 20
N_SRC = 10          # индексы 0..10
N_NEW = 20          # индексы 0..20

x_src = [i * H for i in range(N_SRC + 1)]
y_src = [math.sin(xi) ** 2 + 1 for xi in x_src]

x_new = [j * H / 2 for j in range(N_NEW + 1)]
y_exact = [math.sin(xi) ** 2 + 1 for xi in x_new]


# ─── Конечные разности (для Ньютона вперёд) ────────────────────────
def finite_differences(y):
    n = len(y)
    delta = [list(y)]
    for k in range(1, n):
        prev = delta[-1]
        delta.append([prev[i + 1] - prev[i] for i in range(len(prev) - 1)])
    return delta


# ─── Полином Ньютона (равномерная сетка, вперёд) ──────────────────
def newton_forward(x_nodes, y_nodes, x_eval, h):
    """Интерполяция полиномом Ньютона вперёд."""
    delta = finite_differences(y_nodes)
    results = []
    for x in x_eval:
        # Узел слева с запасом для высших разностей (не ближе 4 к концу)
        raw = int((x - x_nodes[0]) / h)
        idx = max(0, min(len(x_nodes) - 5, raw))
        t = (x - x_nodes[idx]) / h
        y = delta[0][idx]
        prod = 1.0
        factorial = 1
        for k in range(1, len(x_nodes) - idx):
            prod *= (t - (k - 1))
            factorial *= k
            if k < len(delta) and idx < len(delta[k]):
                y += prod / factorial * delta[k][idx]
        results.append(y)
    return results


# ─── Полином Лагранжа ──────────────────────────────────────────────
def lagrange(x_nodes, y_nodes, x_eval):
    n = len(x_nodes)
    results = []
    for x in x_eval:
        y = 0.0
        for i in range(n):
            basis = 1.0
            for j in range(n):
                if j != i:
                    basis *= (x - x_nodes[j]) / (x_nodes[i] - x_nodes[j])
            y += y_nodes[i] * basis
        results.append(y)
    return results


def main():
    print("=" * 65)
    print("Задание 6.3. Вариант 10.")
    print("y = sin²(x) + 1,  x ∈ [0, π/2],  h = π/20")
    print("=" * 65)

    print("\nИсходная сетка (xᵢ, yᵢ):")
    for xi, yi in zip(x_src, y_src):
        print(f"  x = {xi:.6f},  y = {yi:.8f}")

    yn = newton_forward(x_src, y_src, x_new, H)
    yl = lagrange(x_src, y_src, x_new)

    print("\nРезультаты интерполяции:")
    print(f"{'j':>3}  {'xj':>10}  {'y_точн':>12}  {'y_Ньютон':>12}  {'|err_N|':>10}  {'y_Лагранж':>12}  {'|err_L|':>10}")
    for j in range(N_NEW + 1):
        xj = x_new[j]
        ye = y_exact[j]
        en = abs(ye - yn[j])
        el = abs(ye - yl[j])
        print(f"{j:>3}  {xj:>10.6f}  {ye:>12.8f}  {yn[j]:>12.8f}  {en:>10.2e}  {yl[j]:>12.8f}  {el:>10.2e}")

    max_en = max(abs(y_exact[j] - yn[j]) for j in range(N_NEW + 1))
    max_el = max(abs(y_exact[j] - yl[j]) for j in range(N_NEW + 1))
    print(f"\nМакс. погрешность Ньютона:  {max_en:.2e}")
    print(f"Макс. погрешность Лагранжа: {max_el:.2e}")


if __name__ == "__main__":
    main()
