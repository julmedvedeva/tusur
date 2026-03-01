#pragma once // предотвращает множественное включение заголовочного (.h) файла
#define _CRT_SECURE_NO_WARNINGS
#include <cstring> // c++ версия библиотеки string.h из Си
#include <iostream> // библиотека для работы с потоками ввода/ввывода

class Car {
private:
    char* brand_;
    int power_;
    float price_;

public:
    Car();                          // конструктор по умолчанию
    Car(const char* brand, int power, float price); // конструктор с параметрами
    Car(const Car& other); // копирующий конструктор
    Car& operator=(const Car& other); // оператор присваивания
    virtual ~Car();                 // деструктор
                                    // virtual - для правильного освобождения памяти наследуемых классов

    virtual void Print() const;     // виртуальная функция вывода информации об автомобиле
                                    // константная, т.к. информация об автомобиле не изменяется при выводе 
    virtual void Print(std::ostream& os) const; // перегрузка метода Print
                                                // ostream - это любой поток вывода. Может использоваться, например
                                                // для вывода в файл (std::ofstream) или в консоль (std::cout)

    virtual void Input();           // виртуальная функция ввода данных об автомобиле

    const char* GetBrand() const { return brand_; } // метод доступа (геттер) для чтения марки
    int GetPower() const { return power_; }         // геттер для мощности
    float GetPrice() const { return price_; }       // геттер для цены

    bool SetBrand(const char* brand);      // метод установки нового значения (сеттер) марки
    bool SetPower(int power);              // сеттер для мощности
    bool SetPrice(float price);            // сеттер для стоимости

    // Оператор приведения к float
    operator float() const { return price_; };
    // Объявляем оператор + дружественным,
    // чтобы у него был доступ к приватному полю price_
    friend float operator+(Car& c1, Car& c2);
};

// Перегрузка оператора вывода в поток,
// для корректоной работы вывода Car на консоль с помощью оператора <<
std::ostream& operator<<(std::ostream& os, const Car& car);
