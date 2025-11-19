import csv
import matplotlib.pyplot as plt

# Читаем данные из CSV файла
x = []
y = []
with open('cardioid_coordinates.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        x.append(float(row[0]))
        y.append(float(row[1]))

# Создаем график
plt.figure(figsize=(8, 6))
plt.plot(x, y, marker='o', linestyle='-', color='b')
plt.title('График координат из CSV файла')
plt.xlabel('X')
plt.ylabel('Y')
plt.grid(True)

# Сохраняем график в файл
plt.savefig('plot.png')

# Отображаем график (опционально)
plt.show()
