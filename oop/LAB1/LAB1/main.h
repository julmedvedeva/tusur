#pragma once
#pragma warning(disable : 4996)
#include <cstring>
#include <iostream>
#include <string>

class Car {
private:
    char* brand_;
    int number_;
    float price_;

public:
    Car(); // Конструктор по умолчанию
    Car(const char* brand, int number, float price); // Конструктор с параметрами
    virtual ~Car(); // Деструктор

    virtual void Print() const; // Метод вывода информации
    void Input(); // Метод ввода информации

    // Методы доступа (геттеры и сеттеры)
    const char* GetBrand() const { return brand_; }
    int GetNumber() const { return number_; }
    float GetPrice() const { return price_; }
    void SetBrand(const char* brand);
    void SetNumber(int number);
    void SetPrice(float price);
};

class ACar : public Car {
private:
    std::string mainInfo_;

public:
    ACar(); // Конструктор по умолчанию
    ACar(const char* brand, const std::string& mainInfo, int number, float price);
    virtual ~ACar(); // Деструктор
    void Print() const override; // Переопределяем метод Print
};

class CCar : public Car {
public:
    CCar(); // Конструктор по умолчанию
    CCar(const char* brand, int number, float price);
    virtual ~CCar(); // Деструктор
    void Print() const override; // Переопределяем метод Print
};