    #include <iostream>
    #include <string>
    #include <cstring>
    #include "car.h"

    using namespace std;
    // Копирующий конструктор
    Car::Car(const Car& other)
        : number_(other.number_), price_(other.price_) {
        brand_ = new char[strlen(other.brand_) + 1]; // Выделяем память под строку
        strcpy(brand_, other.brand_); // Копируем бренд
    }

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

    // Оператор приведения типа к double
    Car::operator double() const {
        return this->price_;
    }

    // Оператор присваивания
    Car& Car::operator=(const Car& other) {
        if (this != &other) { // Проверка на самоприсваивание
            delete[] brand_; // Освобождаем старую память
            number_ = other.number_; // Копируем номер
            price_ = other.price_; // Копируем цену
            brand_ = new char[strlen(other.brand_) + 1]; // Выделяем новую память под строку
            strcpy(brand_, other.brand_); // Копируем бренд
        }
        return *this; // Возвращаем текущий объект
    }

    // Деструктор
    Car::~Car() {
        delete[] brand_; // Освобождаем память
    }

    // Метод вывода информации о машине
    void Car::Print() { // Добавлен const
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

    // определение оператора сложнения
    double operator + (Car& c1, Car& c2) {
        return (c1.price_ + c2.price_);
    }
