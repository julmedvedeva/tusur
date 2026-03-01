#include <iostream>
#include <string>
#include <cstring>
#include <exception>
#include "group.h"
#include "car.h"

using namespace std;

Group::Group(int size) : size(size) {
    // Проверяем, является ли заданный размер положительным числом
    if (size <= 0) {
        // Бросаем исколючение "invalid_argument",
        // сигнализирующее  о передаче недопустимого аргумента
        throw std::invalid_argument(
            "Group::Group: Нельзя создать группу с нулевым или отрицательным количеством элементов."
        );
    }
    // Выделяем динамическую память под массив
    cars = new Car[size];
}

Group::~Group() {
	// Освобождаем память для массива
	delete[] cars; 
}

void Group::Print() const {
	for (int i = 0; i < size; i++)
	{
		cars[i].Print();
	}
}

int Group::Size() const {
	return size;
}

void Group::PutCar(int i, const Car& car) {
    // Проверка на выход за пределы массива
    if (i < 0 || i > size - 1) {
        // Формируем строку для ошибки
        std::string errMessage = "Group::PutCar: Обращение по несуществующему индексу: " + i;
        // Бросаем исколючение "out_of_range", т.е. "за границами"
        // Словить такое исключение в вызывающем коде можно с помощью
        // `try {} catch {}` кострукции
        throw std::out_of_range(errMessage);
    }
	cars[i] = car;
}

Car& Group::GetCar(int i) {
    // Проверка на выход за пределы массива
    if (i < 0 || i > size - 1) {
        // Формируем строку для ошибки
        std::string errMessage = "Group::GetCar: Обращение по несуществующему индексу: " + i;
        // Бросаем исколючение "за границами"
        throw std::out_of_range(errMessage);
    }
	return cars[i];
}

// Средняя цена всех машин
float Group::Price() const {
    if (size == 0) return 0.0; // Проверка на пустую группу

    float total = 0.0;
    for (int i = 0; i < size; ++i) {
        total += (float)(cars[i]); // Используем оператор приведения
    }
    return total / size; // Возвращаем среднюю цену
}

// Средняя цена машин с ценой <= limit
float Group::Price(int limit) const {
    if (size == 0) return 0.0; // Проверка на пустую группу

    float total = 0.0;
    int count = 0;

    for (int i = 0; i < size; ++i) {
        float price = (float)(cars[i]); // Используем оператор приведения
        if (price <= limit) {
            total += price;
            ++count; // Увеличиваем счетчик машин, подходящих по критерию
        }
    
    }

    // Если количество автомобилей больше нуля,
    // вычисляем среднее арифметическое стоимости автомобилей,
    // иначе возвращаем 0.0, чтобы избежать деление на ноль.
    return (count > 0) ? total / count : 0.0;
}

Car& Group::operator[](int i) {
    // Проверка на выход за пределы массива
    if (i < 0 || i > size - 1) {
        // Формируем строку для ошибки
        std::string errMessage = "Group::operator[] Обращение по несуществующему индексу: " + i;
        // Бросаем исколючение
        throw std::out_of_range(errMessage);
    }
    return cars[i];
}
