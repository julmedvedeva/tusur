#include <iostream>
#include <string>
#include <cstring>
#include "group.h"
#include "car.h"

using namespace std;

Group::Group(int size) : size(size) {
	cars = new Car[size];
}

Group::~Group()
{
	// Освобождаем память для массива указателей
	delete[] cars; 
}

void Group::Print()
{
	for (int i = 0; i < size; i++)
	{
		cars[i].Print();
	}
}

int Group::Size()
{
	return size;
}

void Group::PutCar(int i, const Car& car)
{
	cars[i] = car;
}

Car& Group::GetCar(int i)
{
	return cars[i];
}

// Средняя цена всех машин
double Group::Price() {
    if (size == 0) return 0.0; // Проверка на пустую группу

    double total = 0.0;
    for (int i = 0; i < size; ++i) {
        total += static_cast<double>(cars[i]); // Используем оператор приведения
    }
    return total / size; // Возвращаем среднюю цену
}

// Средняя цена машин с ценой <= limit
double Group::Price(int limit) {
    if (size == 0) return 0.0; // Проверка на пустую группу

    double total = 0.0;
    int count = 0;

    for (int i = 0; i < size; ++i) {
        double price = static_cast<double>(cars[i]); // Используем оператор приведения
        if (price <= limit) {
            total += price;
            ++count; // Увеличиваем счетчик машин, подходящих по критерию
        }
    
    }

    return (count > 0) ? total / count : 0.0; // Возвращаем среднюю цену или 0, если нет подходящих машин
}

Car& Group::operator[](int i) {
    return cars[i];
}