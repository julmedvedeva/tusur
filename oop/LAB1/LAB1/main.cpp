#define NOMINMAX 
#include "main.h"
#include <Windows.h>
#include <cctype> // Для функции isalpha
#include <cstring>
#include <iostream>
#include <limits> // Для numeric_limits
#include <stdlib.h>

using namespace std;

// Конструктор по умолчанию для Car
Car::Car() : number_(0), price_(0), brand_(L"unknown") {}

// Конструктор с параметрами для Car
Car::Car(const wchar_t* brand, int number, float price)
    : number_(number), price_(price), brand_(brand) {
}

// Деструктор для Car
Car::~Car() {}

// Метод вывода информации о машине
void Car::Print() const {
    wcout << L"Машина:" << endl;
    wcout << L"Марка: " << (brand_.empty() ? L"неизвестно" : brand_.c_str()) << endl;
    wcout << L"Номер: " << number_ << endl;
    wcout << L"Цена: " << price_ << endl;
}

void Car::Input() {
    // Ввод марки машины с валидацией
    while (true) {
        wcout << L"Введите марку машины: ";
        wstring brand;
        wcin >> brand;

        // Проверка на наличие хотя бы одной буквы и отсутствие только цифр
        bool hasLetter = false;
        bool hasOnlyDigits = true;

        for (wchar_t ch : brand) {
            if (iswalpha(ch)) {
                hasLetter = true;
            }
            if (!iswdigit(ch)) {
                hasOnlyDigits = false;
            }
        }

        // Условие для проверки валидности:
        if (hasLetter) { // Проверяем, есть ли хотя бы одна буква (латиница или кириллица)
            brand_ = brand; // Запоминаем марку
            break; // Ввод корректен, выходим из цикла
        }
        else {
            wcout << L"Ошибка: марка должна содержать хотя бы одну букву и не может состоять только из цифр." << endl;
        }
    }

    // Ввод номера машины с валидацией
    while (true) {
        wcout << L"Введите номер машины: ";
        wcin >> number_;
        if (wcin.fail() || number_ < 0) {
            wcin.clear(); // Очищаем флаг ошибки
            wcin.ignore(numeric_limits<streamsize>::max(), L'\n'); // Игнорируем оставшиеся символы в буфере
            wcout << L"Ошибка: введите корректный номер машины." << endl;
        }
        else {
            break; // Ввод корректен, выходим из цикла
        }
    }

    // Ввод цены машины с валидацией
    while (true) {
        wcout << L"Введите цену машины: ";
        wcin >> price_;
        if (wcin.fail() || price_ < 0) {
            wcin.clear(); // Очищаем флаг ошибки
            wcin.ignore(numeric_limits<streamsize>::max(), L'\n'); // Игнорируем оставшиеся символы в буфере
            wcout << L"Ошибка: введите корректную цену машины." << endl;
        }
        else {
            break; // Ввод корректен, выходим из цикла
        }
    }
}

// Реализация методов SetBrand, SetNumber и SetPrice
void Car::SetBrand(const wchar_t* brand) {
    brand_ = brand;
}

void Car::SetNumber(int number) {
    number_ = number;
}

void Car::SetPrice(float price) {
    price_ = price;
}

int main() {
    int numberChoice;
    setlocale(LC_ALL, "Russian");

    // Статическое выделение памяти с использованием конструктора по умолчанию
    Car car1; // Использует конструктор по умолчанию
    wcout << L"Информация о машине car1 (по умолчанию):" << endl;
    car1.Print();

    // Используем сеттеры для изменения значений
    car1.SetBrand(L"Тойота");
    car1.SetNumber(2021);
    car1.SetPrice(15000.0);

    wcout << L"\nОбновленная информация о машине car1:" << endl;
    car1.Print();

    // Создаем динамический объект машины
    Car* car2 = new Car(L"Рено", 2000, 1000.0); // Исправлено на L"Рено"
    wcout << L"Информация о машине car2:" << endl;
    car2->Print();
    delete car2;

    wcout << L"Выберите, что вы хотите сделать (введите номер):" << endl;
    wcout << L"1. Статическое выделение памяти с параметрами по умолчанию" << endl;
    wcout << L"2. Статическое выделение памяти с переданными параметрами" << endl;
    wcout << L"3. Динамическое выделение памяти с параметрами по умолчанию" << endl;
    wcout << L"4. Динамическое выделение памяти с переданными параметрами" << endl;

    cin >> numberChoice;

    if (numberChoice == 1) {
        // Статическое выделение памяти с параметрами по умолчанию
        Car car1; // Использует конструктор по умолчанию
        wcout << L"Информация о машине car1 (по умолчанию):" << endl;
        car1.Print();
    }
    else if (numberChoice == 2) {
        // Статическое выделение памяти с переданными параметрами
        Car car2(L"Тойота", 2021, 15000.0); // Использует конструктор с параметрами
        wcout << L"Информация о машине car2 (с параметрами):" << endl;
        car2.Print();
    }
    else if (numberChoice == 3) {
        // Динамическое выделение памяти с использованием конструктора по умолчанию
        Car* car3 = new Car(); // Создаем объект с использованием конструктора по умолчанию
        wcout << L"\nВведите информацию о машине car3:" << endl;
        car3->Input(); // Ввод информации о машине
        wcout << L"\nИнформация о машине car3:" << endl;
        car3->Print(); // Вывод информации о машине
        delete car3; // Освобождаем память
    }
    else if (numberChoice == 4) {
        // Динамическое выделение памяти с переданными параметрами
        Car* car4 = new Car(L"Форд", 2020, 20000.0); // Использует конструктор с параметрами
        wcout << L"Информация о машине car4 (с параметрами):" << endl;
        car4->Print();
        delete car4; // Освобождаем память
    }
    else {
        wcout << L"Введено неизвестное число" << endl;
    }

    // Добавлено ожидание ввода перед закрытием
    wcout << L"Нажмите Enter, чтобы выйти...";
    cin.ignore(); // Игнорируем символ новой строки, если он остался в буфере
    cin.get(); // Ждем ввода пользователя

    return 0;
}