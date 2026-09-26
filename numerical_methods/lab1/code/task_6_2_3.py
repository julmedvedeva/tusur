n = 4
A = [
    [7.9, 5.6, 5.7, -7.2],
    [8.5, -4.8, 0.8, 3.5],
    [4.3, 4.2, -3.2, 9.3],
    [3.2, -1.4, -8.9, 3.3],
]

print("="*60)
print("Задание 6.2.3. Вариант 10. Обратная матрица методом Гаусса-Жордана.")
print("Входные данные:")
print("Порядок матрицы n =", n)
for row in A:
    print("    | " + ", ".join("%14.10f" % v for v in row) + " |")
print("="*60)

aug = []
for i in range(n):
    row = list(A[i])
    for j in range(n):
        if j == i:
            row.append(1.0)
        else:
            row.append(0.0)
    aug.append(row)

w = 2*n
for col in range(n):
    piv_row = col
    piv_abs = abs(aug[col][col])
    for i in range(col+1, n):
        if abs(aug[i][col]) > piv_abs:
            piv_abs = abs(aug[i][col])
            piv_row = i
    if piv_row != col:
        aug[col], aug[piv_row] = aug[piv_row], aug[col]

    piv = aug[col][col]
    for j in range(w):
        aug[col][j] = aug[col][j]/piv

    for row in range(n):
        if row != col:
            factor = aug[row][col]
            if factor != 0.0:
                for j in range(w):
                    aug[row][j] = aug[row][j]-factor*aug[col][j]

    print("  Шаг", col+1, ": столбец", col+1, "приведён к единичному виду (ведущий элемент до нормировки = %.6f)" % piv)
    for row in aug:
        print(" ".join("%12.6f" % v for v in row))

A_inv = []
for row in aug:
    A_inv.append(row[n:])

worst = 0.0
for i in range(n):
    for j in range(n):
        s = 0.0
        for k in range(n):
            s += A[i][k]*A_inv[k][j]
        target = 1.0 if i == j else 0.0
        diff = abs(s-target)
        if diff > worst:
            worst = diff

print()
print("Выходные данные:")
print("  A^-1:")
for row in A_inv:
    print("    | " + ", ".join("%14.10f" % v for v in row) + " |")
print("  невязка max|A*A^-1 - E| =", "%.3e" % worst)
