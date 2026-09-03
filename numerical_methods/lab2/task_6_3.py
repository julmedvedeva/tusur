"""
Задание 6.3 - Приближение функций (интерполяция).
Вариант 10: y = sin^2(x) + 1
Исходная сетка: xi = i*h,  h = pi/20,  i = 0,...,10
Новая сетка:   xj = j*h/2, j = 0,...,20

Реализован один метод - интерполяционный полином Лагранжа. Степень полинома
запрашивается у пользователя: для каждой точки новой сетки берутся n+1
ближайших узлов исходной сетки, и по ним строится полином Лагранжа степени n.
"""

import math

H = math.pi / 20
N_SRC = 10          # индексы исходных узлов 0..10
N_NEW = 20          # индексы новой сетки 0..20

x_src = [i * H for i in range(N_SRC + 1)]
y_src = [math.sin(xi) ** 2 + 1 for xi in x_src]

x_new = [j * H / 2 for j in range(N_NEW + 1)]
y_exact = [math.sin(xi) ** 2 + 1 for xi in x_new]


def read_degree():
    while True:
        raw = input(f"Введите степень интерполяционного полинома n (1..{N_SRC}): ")
        try:
            n = int(raw)
        except ValueError:
            print("  нужно целое число, попробуйте снова")
            continue
        if 1 <= n <= N_SRC:
            return n
        print(f"  n должно быть в диапазоне 1..{N_SRC}")


def nearest_nodes(x, x_nodes, count):
    """Возвращает индексы count узлов из x_nodes, ближайших к точке x (по возрастанию)."""
    indexed = list(range(len(x_nodes)))
    indexed.sort(key=lambda i: abs(x_nodes[i] - x))
    chosen = indexed[:count]
    chosen.sort()
    return chosen


def lagrange_value(x_nodes, y_nodes, x):
    n = len(x_nodes)
    total = 0.0
    for i in range(n):
        basis = 1.0
        for j in range(n):
            if j != i:
                basis *= (x - x_nodes[j]) / (x_nodes[i] - x_nodes[j])
        total += y_nodes[i] * basis
    return total


def interpolate(x_eval, degree):
    results = []
    for x in x_eval:
        idxs = nearest_nodes(x, x_src, degree + 1)
        nodes_x = [x_src[i] for i in idxs]
        nodes_y = [y_src[i] for i in idxs]
        results.append(lagrange_value(nodes_x, nodes_y, x))
    return results


def main():
    print("=" * 65)
    print("Задание 6.3. Вариант 10. Полином Лагранжа.")
    print("y = sin^2(x) + 1,  x in [0, pi/2],  h = pi/20")
    print("=" * 65)

    print("\nВходные данные - исходная сетка (xi, yi):")
    for xi, yi in zip(x_src, y_src):
        print(f"  x = {xi:.6f},  y = {yi:.8f}")

    degree = read_degree()
    print(f"\nСтепень полинома n = {degree} (используется {degree + 1} ближайших узлов на точку)")

    y_poly = interpolate(x_new, degree)

    print("\nВыходные данные - результаты интерполяции:")
    header = f"{'j':>3}  {'xj':>10}  {'y_точн':>12}  {'y_полином':>12}  {'|err|':>10}"
    print(header)
    max_err = 0.0
    for j in range(N_NEW + 1):
        xj = x_new[j]
        ye = y_exact[j]
        yp = y_poly[j]
        err = abs(ye - yp)
        max_err = max(max_err, err)
        print(f"{j:>3}  {xj:>10.6f}  {ye:>12.8f}  {yp:>12.8f}  {err:>10.2e}")

    print(f"\nМакс. погрешность интерполяции: {max_err:.2e}")


if __name__ == "__main__":
    main()
