import math
import time

# вариант 10
a0 = -10.0
b0 = 10.0
h = 0.5
eps_x = 1e-6
eps_f = 1e-6


def f(x):
    return 10*math.cos(x) - 0.1*x*x


def find_intervals(a0, b0, h):
    intervals = []
    exact = []
    xl = a0
    fl = f(xl)
    calls = 1
    while xl < b0:
        xr = xl+h
        if xr > b0:
            xr = b0
        fr = f(xr)
        calls += 1
        if fl == 0:
            exact.append(xl)
        if fl*fr < 0:
            intervals.append((xl, xr, fl, fr))
        xl = xr
        fl = fr
    if fl == 0:
        exact.append(xl)
    return intervals, exact, calls


def bisection(a, b):
    t0 = time.perf_counter()
    fa = f(a)
    fb = f(b)
    calls = 2
    n = 0
    prev = None
    prev2 = None
    while True:
        n += 1
        c = (a+b)/2
        fc = f(c)
        calls += 1
        delta = (b-a)/2
        if fc == 0 or (delta <= eps_x and abs(fc) <= eps_f):
            break
        if fa*fc < 0:
            b = c
        else:
            a = c
            fa = fc
        prev2 = prev
        prev = c

    alpha = 0.5
    if prev is not None and prev2 is not None:
        d = abs(prev-prev2)
        if d > 0:
            alpha = abs(c-prev)/d
    mcs = (time.perf_counter()-t0)*1000000
    return c, fc, delta, n, calls, alpha, mcs


print("Вариант 10: f(x) = 10*cos(x) - 0.1*x^2")
print("Отрезок поиска: [", a0, ";", b0, "], шаг h =", h)
print("Точности: eps_x =", eps_x, "eps_f =", eps_f)

intervals, exact, sep_calls = find_intervals(a0, b0, h)
print("Узловые точки, точно совпавшие с корнем:", exact)
print("Вычислений f(x) на этапе отделения корней:", sep_calls)

total_calls = sep_calls
for a, b, fa, fb in intervals:
    print()
    print("Отрезок [%s; %s], f(a) = %.6f, f(b) = %.6f" % (a, b, fa, fb))
    root, froot, delta, n, nf, alpha, mcs = bisection(a, b)
    total_calls += nf
    print("  корень xi =", "%.12f" % root)
    print("  f(xi) = %.6e" % froot)
    print("  delta (оценка погрешности) = %.6e" % delta)
    print("  число итераций n =", n)
    print("  число вычислений f на уточнении Nf =", nf)
    print("  время уточнения = %.2f мкс" % mcs)
    print("  alpha =", alpha)

print()
print("Всего вычислений f(x):", total_calls)
print("Вычислений производной: 0, метод дихотомии их не требует")
