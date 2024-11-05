#pragma once
#pragma warning(disable : 4996)
// подключаем возможность работы со строками
#include <cstring>
// подключаем возможность работы с вводом и выводом
#include <iostream>
// объявляем класс 
class Car
{
	// объявляем приватные члены класса 
private:
    // указатель на строку для хранения бренда автомобиля
    char* brand_;
    // целочисленная переменная для хранения номера автомобиля
    int number_;
    // переменная с плавающей точкой для хранения цены автомобиля
    float price_;
	// объявляем члены класса, доступные извне
public:
    Car(); // Конструктор по умолчанию
    Car(const char* brand, int number, float price); // Конструктор с параметрами
    Car(const Car& other); // Копирующий конструктор
    Car& operator=(const Car& other); // Оператор присваивания
    ~Car(); // Деструктор
	void Print();
	// объявление метода ввода
	void Input();
    // Метод для приведения к числу (используя this->)
    operator double() const;
    friend double operator+(Car& c1, Car& c2);
};

