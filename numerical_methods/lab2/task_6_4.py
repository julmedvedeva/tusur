"""
Задание 6.4 - Численное дифференцирование.
Вариант 10: y = sin^2(x) + 1 (те же исходные данные, что и в задании 6.3).

Реализован один метод - дифференцирование интерполяционного полинома
Лагранжа. Степень полинома запрашивается у пользователя: для каждой точки
новой сетки берутся n+1 ближайших узлов исходной сетки, строится полином
Лагранжа степени n, и вычисляются его первая и вторая производные в точке.
"""

import math

H = math.pi / 20
N_SRC = 10
N_NEW = 20

x_src = [i * H for i in range(N_SRC + 1)]
y_src = [math.sin(xi) ** 2 + 1 for xi in x_src]
x_new = [j * H / 2 for j in range(N_NEW + 1)]


def dy_exact(x):
    return math.sin(2 * x)          # d/dx (sin^2 x + 1) = sin(2x)


def d2y_exact(x):
    return 2 * math.cos(2 * x)      # d^2/dx^2 (sin^2 x + 1) = 2*cos(2x)


def read_degree():
    while True:
        raw = input(f"Введите степень интерполяционного полинома n (2..{N_SRC}): ")
        try:
            n = int(raw)
        except ValueError:
            print("  нужно целое число, попробуйте снова")
            continue
        if 2 <= n <= N_SRC:
            return n
        print(f"  n должно быть в диапазоне 2..{N_SRC} (для второй производной нужно n >= 2)")


def nearest_nodes(x, x_nodes, count):
    indexed = list(range(len(x_nodes)))
    indexed.sort(key=lambda i: abs(x_nodes[i] - x))
    chosen = indexed[:count]
    chosen.sort()
    return chosen


def lagrange_derivatives_at(x_nodes, y_nodes, x):
    """Первая и вторая производная полинома Лагранжа, построенного по x_nodes/y_nodes, в точке x."""
    n = len(x_nodes)
    dy1 = 0.0
    dy2 = 0.0
    for i in range(n):
        dLi = 0.0
        d2Li = 0.0
        for k in range(n):
            if k == i:
                continue
            prod_k = 1.0
            for j in range(n):
                if j != i and j != k:
                    prod_k *= (x - x_nodes[j]) / (x_nodes[i] - x_nodes[j])
            dLi += prod_k / (x_nodes[i] - x_nodes[k])

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
    return dy1, dy2


def differentiate(x_eval, degree):
    dy1_list, dy2_list = [], []
    for x in x_eval:
        idxs = nearest_nodes(x, x_src, degree + 1)
        nodes_x = [x_src[i] for i in idxs]
        nodes_y = [y_src[i] for i in idxs]
        d1, d2 = lagrange_derivatives_at(nodes_x, nodes_y, x)
        dy1_list.append(d1)
        dy2_list.append(d2)
    return dy1_list, dy2_list


def main():
    print("=" * 75)
    print("Задание 6.4. Вариант 10. Дифференцирование полинома Лагранжа.")
    print("y = sin^2(x) + 1,  y' = sin(2x),  y'' = 2*cos(2x)")
    print("=" * 75)

    print("\nВходные данные - исходная сетка (xi, yi):")
    for xi, yi in zip(x_src, y_src):
        print(f"  x = {xi:.6f},  y = {yi:.8f}")

    degree = read_degree()
    print(f"\nСтепень полинома n = {degree} (используется {degree + 1} ближайших узлов на точку)")

    dy1, dy2 = differentiate(x_new, degree)

    print("\nВыходные данные - первая производная y':")
    header = f"{'j':>3}  {'xj':>10}  {'y_точн':>10}  {'y_полином':>10}  {'|err|':>8}"
    print(header)
    max_err1 = 0.0
    for j in range(N_NEW + 1):
        xj = x_new[j]
        exact = dy_exact(xj)
        err = abs(exact - dy1[j])
        max_err1 = max(max_err1, err)
        print(f"{j:>3}  {xj:>10.6f}  {exact:>10.6f}  {dy1[j]:>10.6f}  {err:>8.2e}")

    print("\nВыходные данные - вторая производная y'':")
    print(header)
    max_err2 = 0.0
    for j in range(N_NEW + 1):
        xj = x_new[j]
        exact = d2y_exact(xj)
        err = abs(exact - dy2[j])
        max_err2 = max(max_err2, err)
        print(f"{j:>3}  {xj:>10.6f}  {exact:>10.6f}  {dy2[j]:>10.6f}  {err:>8.2e}")

    print(f"\nМакс. погрешность y':  {max_err1:.2e}")
    print(f"Макс. погрешность y'': {max_err2:.2e}")


if __name__ == "__main__":
    main()
