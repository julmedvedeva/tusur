#pragma once // предотвращает множественное включение заголовочного (.h) файла
#include "car.h" // включаем содержимое хедера car.h

// Класс AdditionalCar, производный от базового класса Car
class AdditionalCar : public Car {
private:
    std::string mainInfo_; // дополнительная строковая переменная, содержащая основную информацию об автомобиле 

public:
    AdditionalCar();                        // конструктор по умолчанию
    AdditionalCar(const char* brand, const char* mainInfo, int power, float price); // конструктор с дополнительными аргументами
    ~AdditionalCar();                       // деструктор 
    void Print() const override;            // переопределённая (override) функция вывода информации
    void Input() override;                  // переопределённая функция ввода данных

    std::string GetMainInfo() { return this->mainInfo_; }; // геттер основной информации
    bool SetMainInfo(const char* mainInfo); // метод для изменения основной информации
};
