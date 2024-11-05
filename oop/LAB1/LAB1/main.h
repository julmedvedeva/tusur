#pragma once
#pragma warning(disable : 4996)
// подключаем возможность работы со строками
#include <cstring>
// подключаем возможность работы с вводом и выводом
#include <iostream>
// объ€вл€ем класс 
class Car
{
	// объ€вл€ем приватные члены класса 
private:
    // указатель на строку дл€ хранени€ бренда автомобил€
    char* brand_;
    // целочисленна€ переменна€ дл€ хранени€ номера автомобил€
    int number_;
    // переменна€ с плавающей точкой дл€ хранени€ цены автомобил€
    float price_;
	// объ€вл€ем члены класса, доступные извне
public:
	// конструктор класса по умолчанию
	// (нужно при создании объекта класса без параметров)
	Car();
	// объ€вление конструктора класса с параметрами (указаны в скобках)
	// при создании объекта класса в месте использовани€ 
	// нужно передвать три аргумента дл€ создани€ нового инстанса
	Car(const char* brand_, int number_, float price_);
	// объ€вление метода печати с возможностью перезаписать его
	virtual void Print();
	// объ€вление метода ввода
	void Input();
	virtual ~Car(); // ƒеструктор

};


// объ€вление класса ACar, наследующего от класса Car
class ACar : public Car
{
private:
	std::string mainInfo_;
public:
    ACar(const char* brand_, const std::string& mainInfo_, int number_, float price_);
    void Print() override;  // переопредел€ем метод Print
};


// объ€вление класса CCar, наследующего от класса Car
class CCar : public Car {
public:
	CCar(const char* brand_, int number_, float price_);
	void Print() override;  // переопредел€ем метод Print
};

