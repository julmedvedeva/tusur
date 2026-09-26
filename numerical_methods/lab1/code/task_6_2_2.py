n = 4
A = [
    [7.9, 5.6, 5.7, -7.2],
    [8.5, -4.8, 0.8, 3.5],
    [4.3, 4.2, -3.2, 9.3],
    [3.2, -1.4, -8.9, 3.3],
]

print("="*60)
print("Задание 6.2.2. Вариант 10. Определитель методом Гаусса.")
print("Входные данные:")
print("Порядок матрицы n =", n)
for row in A:
    print("    | " + ", ".join("%.4f" % v for v in row) + " |")
print("="*60)

m = [row[:] for row in A]
swaps = 0

for k in range(n-1):
    piv_row = k
    piv_abs = abs(m[k][k])
    for i in range(k+1, n):
        if abs(m[i][k]) > piv_abs:
            piv_abs = abs(m[i][k])
            piv_row = i
    if piv_row != k:
        m[k], m[piv_row] = m[piv_row], m[k]
        swaps = swaps+1

    for i in range(k+1, n):
        mult = m[i][k]/m[k][k]
        for j in range(k, n):
            m[i][j] = m[i][j]-mult*m[k][j]

    print("Шаг", k+1, ":")
    for row in m:
        print(" ".join("%12.6f" % v for v in row))

det = 1.0
for i in range(n):
    det = det*m[i][i]
if swaps % 2 == 1:
    det = -det

print()
print("Перестановок строк выполнено:", swaps)
print("Треугольная матрица после прямого хода:")
for row in m:
    print("    | " + ", ".join("%9.4f" % v for v in row) + " |")

print()
print("Выходные данные:")
print("  det(A) =", "%.6f" % det)
