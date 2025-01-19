#include <iostream>
#include <cstring>
#include <cctype> // Для функции isalpha
#include <limits> // Для numeric_limits
#include "main.h"

using namespace std;

// Конструктор по умолчанию для Car
Car::Car() : number_(0), price_(0) {
    brand_ = new char[8]; // Выделяем память для строки
    strcpy(brand_, "unknown"); // Копируем строку по умолчанию
}

// Конструктор с параметрами для Car
Car::Car(const char* brand, int number, float price)
    : number_(number), price_(price) {
    brand_ = new char[strlen(brand) + 1]; // Выделяем память под строку
    strcpy(brand_, brand); // Копируем переданную строку
}

// Деструктор для Car
Car::~Car() {
    delete[] brand_; // Освобождаем память
}

// Метод вывода информации о машине
void Car::Print() const {
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

    // Ввод марки машины с валидацией
    while (true) {
        cout << "Введите марку машины: ";
        cin >> brand_;

        // Проверка на наличие хотя бы одной буквы и отсутствие только цифр
        bool hasLetter = false;
        bool hasOnlyDigits = true;

        for (size_t i = 0; i < strlen(brand_); ++i) {
            if (isalpha(brand_[i])) {
                hasLetter = true;
            }
            if (isdigit(brand_[i])) {
                // Если есть хотя бы одна буква, то это не только цифры
                hasOnlyDigits = false;
            }
        }

        // Условие для проверки валидности
        if (hasLetter && !hasOnlyDigits) {
            break; // Ввод корректен, выходим из цикла
        }
        else {
            cout << "Ошибка: марка должна содержать хотя бы одну букву и не может состоять только из цифр." << endl;
        }
    }

    // Ввод номера машины с валидацией
    do {
        cout << "Введите номер машины: ";
        cin >> number_;
    } while (cin.fail() || number_ < 0);

    // Ввод цены машины с валидацией
    do {
        cout << "Введите цену машины: ";
        cin >> price_;
    } while (cin.fail() || price_ < 0);

    cin.clear(); // Очищаем флаг ошибки
    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Игнорируем оставшиеся символы в буфере
}

// Реализация методов SetBrand, SetNumber и SetPrice
void Car::SetBrand(const char* brand) {
    if (brand_ != nullptr) {
        delete[] brand_;
    }
    brand_ = new char[strlen(brand) + 1];
    strcpy(brand_, brand);
}

void Car::SetNumber(int number) {
    number_ = number;
}

void Car::SetPrice(float price) {
    price_ = price;
}

// Конструктор по умолчанию для ACar
ACar::ACar() : Car(), mainInfo_("unknown") {}

// Конструктор для ACar
ACar::ACar(const char* brand, const string& mainInfo, int number, float price)
    : Car(brand, number, price), mainInfo_(mainInfo) {
}

// Деструктор для ACar
ACar::~ACar() {}

// Метод вывода информации о машине с дополнительными данными для класса A
void ACar::Print() const {
    cout << "Машина класса A:" << endl;
    Car::Print(); // Вызов метода Print базового класса
    cout << "Краткая информация о классе машин:" << endl;
    cout << mainInfo_ << endl;
}

// Конструктор по умолчанию для CCar
CCar::CCar() : Car() {}

// Конструктор для CCar
CCar::CCar(const char* brand, int number, float price)
    : Car(brand, number, price) {
}

// Деструктор для CCar
CCar::~CCar() {}

// Метод вывода информации о машине с дополнительными данными для класса C
void CCar::Print() const {
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

    // Используем сеттеры для изменения значений
    car1.SetBrand("Тойота");
    car1.SetNumber(2021);
    car1.SetPrice(15000.0);

    cout << "\nОбновленная информация о машине car1:" << endl;
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