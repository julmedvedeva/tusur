#pragma once
#pragma warning(disable : 4996)
#include <cstring>
#include <iostream>
#include <string>

class Car {
private:
    std::wstring brand_; // Используем std::wstring
    int number_;
    float price_;

public:
    Car(); // Конструктор по умолчанию
    Car(const wchar_t* brand, int number, float price); // Конструктор с параметрами
    virtual ~Car(); // Деструктор

    virtual void Print() const; // Метод вывода информации
    void Input(); // Метод ввода информации

    // Методы доступа (геттеры и сеттеры)
    const wchar_t* GetBrand() const { return brand_.c_str(); }
    int GetNumber() const { return number_; }
    float GetPrice() const { return price_; }
    void SetBrand(const wchar_t* brand);
    void SetNumber(int number);
    void SetPrice(float price);
};

class AdditionalCar : public Car {
private:
    const wchar_t* mainInfo_;

public:
    AdditionalCar(); // Конструктор по умолчанию
    AdditionalCar(const wchar_t* brand, const wchar_t* mainInfo, int number, float price);
    virtual ~AdditionalCar(); // Деструктор
    void Print() const override; // Переопределяем метод Print
};

