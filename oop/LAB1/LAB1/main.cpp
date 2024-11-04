#include <iostream>
#include <string>
#include <cstring>
#include "main.h"

using namespace std;

// Конструктор по умолчанию
Car::Car() : number_(0), price_(0) {
    brand_ = new char[8]; // Выделяем память для строки
    strcpy(brand_, "unknown"); // Копируем строку по умолчанию
}

// Конструктор с параметрами
Car::Car(const char* brand, int number, float price)
    : number_(number), price_(price) {
    brand_ = new char[strlen(brand) + 1]; // Выделяем память под строку
    strcpy(brand_, brand); // Копируем переданную строку
}

Car::~Car() {
    delete[] brand_; // Освобождаем память
}

// Метод вывода информации о машине
void Car::Print() {
    cout << "Машина:" << endl;
    cout << "Марка: " << (brand_ ? brand_ : "неизвестно") << endl; // Проверка на nullptr
    cout << "Номер: " << number_ << endl;
    cout << "Цена: " << price_ << endl;
}

// Метод ввода информации о машине
void Car::Input() {
    // Освобождаем старую память
    if (brand_ != nullptr) {
        delete[] brand_;
    }
    // Выделяем память для новой строки
    brand_ = new char[100];
    cout << "Введите марку машины: ";
    cin >> brand_;
    cout << "Введите номер машины: ";
    cin >> number_;
    cout << "Введите цену машины: ";
    cin >> price_;
}

// Конструктор для класса ACar
ACar::ACar(const char* brand, const string& mainInfo, int number, float price)
    : Car(brand, number, price), mainInfo_(mainInfo) {}

// Метод вывода информации о машине с дополнительными данными для класса A
void ACar::Print() {
    cout << "Машина класса A:" << endl;
    Car::Print(); // Вызов метода Print базового класса
    cout << "Краткая информация о классе машин:" << endl;
    cout << mainInfo_ << endl;
}

// Конструктор для класса CCar
CCar::CCar(const char* brand, int number, float price)
    : Car(brand, number, price) {}

// Метод вывода информации о машине с дополнительными данными для класса C
void CCar::Print() {
    cout << "Машина класса C:" << endl;
    Car::Print(); // Вызов метода Print базового класса
}

int main() {
    int numberChoice;

    #ifdef _WIN32
        system("chcp 1251 > nul"); // Установка кодировки для Windows
    #endif

    // Создаем объект машины с использованием конструктора с параметрами
    Car car1("Рено", 1994, 100.0);
    cout << "Информация о машине car1:" << endl;
    car1.Print();

    // Создаем динамический объект машины
    Car* car2 = new Car("Рено", 2000, 1000.0);
    cout << "Информация о машине car2:" << endl;
    car2->Print();
    delete car2;

    cout << "Выберите, что вы хотите сделать (введите номер):" << endl;
    cout << "1. Посмотреть машину класса A" << endl;
    cout << "2. Посмотреть машину класса C" << endl;
    cout << "3. Ввести и посмотреть информацию о машине без класса" << endl;

    cin >> numberChoice;

    if (numberChoice == 1) {
        // Создаем объект машины класса A
        ACar* carA = new ACar("Фиат 500",
            "Это маленькие, юркие городские авто с небольшими моторами (чаще объемом от 0,8 до 1,4 л), с механическими, роботизированными либо автоматическими коробками передач и багажниками символических размеров.",
            2007, 50000.00);
        cout << "Информация о машине carA:" << endl;
        carA->Print();
        delete carA; // Освобождаем память
    }
    else if (numberChoice == 2) {
        // Создаем объект машины класса C
        CCar* carC = new CCar("Форд Фокус", 2003, 20000.5);
        cout << "Информация о машине carC:" << endl;
        carC->Print();
        delete carC; // Освобождаем память
    }
    else if (numberChoice == 3) {
        // Создаем объект машины с использованием конструктора по умолчанию
        Car car3;
        cout << "\nВведите информацию о машине car3:" << endl;
        car3.Input(); // Ввод информации о машине
        cout << "\nИнформация о машине car3:" << endl;
        car3.Print(); // Вывод информации о машине
    }
    else {
        cout << "Введено неизвестное число" << endl;
    }

    // Добавлено ожидание ввода перед закрытием
    cout << "Нажмите Enter, чтобы выйти...";
    cin.ignore(); // Игнорируем символ новой строки, если он остался в буфере
    cin.get(); // Ждем ввода пользователя

    return 0;
}
