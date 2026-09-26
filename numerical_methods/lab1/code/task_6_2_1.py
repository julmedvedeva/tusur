n = 4
A = [
    [7.9, 5.6, 5.7, -7.2],
    [8.5, -4.8, 0.8, 3.5],
    [4.3, 4.2, -3.2, 9.3],
    [3.2, -1.4, -8.9, 3.3],
]
b = [6.68, 9.95, 8.6, 1.0]


def show(title, m):
    print(title)
    for row in m:
        print(" | ".join("%12.6f" % v for v in row))


print("Задание 6.2.1. Вариант 10. Метод Гаусса с частичным выбором ведущего элемента.")
print("Входные данные:")
print("  порядок системы n =", n)
show("матрица A:", A)
print("  вектор b =", b)

m = []
for i in range(n):
    m.append(A[i]+[b[i]])

for k in range(n-1):
    best = k
    for i in range(k+1, n):
        if abs(m[i][k]) > abs(m[best][k]):
            best = i
    if best != k:
        m[k], m[best] = m[best], m[k]

    for i in range(k+1, n):
        mult = m[i][k]/m[k][k]
        for j in range(k, n+1):
            m[i][j] = m[i][j]-mult*m[k][j]

    print()
    print("  Шаг", k+1, "прямого хода (ведущий элемент в строке", k+1, "):")
    show("расширенная матрица:", m)

x = [0]*n
i = n-1
while i >= 0:
    s = m[i][n]
    for j in range(i+1, n):
        s = s-m[i][j]*x[j]
    x[i] = s/m[i][i]
    i -= 1

r = []
for i in range(n):
    s = b[i]
    for j in range(n):
        s -= A[i][j]*x[j]
    r.append(s)
r_norm = max(abs(v) for v in r)

print()
print("Выходные данные:")
print("  решение x = [" + ", ".join("%.12f" % v for v in x) + "]")
print("  невязка r = b - A*x = [" + ", ".join("%.3e" % v for v in r) + "]")
print("  ||r||_inf =", "%.3e" % r_norm)
