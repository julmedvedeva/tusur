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

    ~Car();                         // деструктор
                                    // для правильного освобождения памяти наследуемых классов

    virtual void Print() const;     // виртуальная функция вывода информации об автомобиле
                                    // константная, т.к. информация об автомобиле не изменяется при выводе 
    virtual void Input();           // виртуальная функция ввода данных об автомобиле

    const char* GetBrand() const { return brand_; } // метод доступа (геттер) для чтения марки
    int GetPower() const { return power_; }         // геттер для мощности
    float GetPrice() const { return price_; }       // геттер для цены

    bool SetBrand(const char* brand);      // метод установки нового значения (сеттер) марки
    bool SetPower(int power);              // сеттер для мощности
    bool SetPrice(float price);            // сеттер для стоимости
};
