#define NOMINMAX
#include "main.h"
#include <Windows.h>
#undef max
#undef min
#include <limits>
#include <io.h>
#include <fcntl.h>

using namespace std;

// === Реализация класса Car ===

Car::Car() : number_(0), price_(0), brand_(L"unknown") {}

Car::Car(const wchar_t* brand, int number, float price)
    : number_(number), price_(price), brand_(brand) {
}

Car::~Car() {
    wcout << L"[~Car] Вызван деструктор Car" << endl;
}

// === Методы проверки и записи===
bool Car::SetBrand(const wchar_t* brand) {
    if (brand == nullptr || wcslen(brand) == 0) {
        wcout << L"Ошибка: марка не может быть пустой." << endl;
        return false;
    }
    brand_ = brand;
    return true;
}

bool Car::SetNumber(int number) {
    if (number < 0) {
        wcout << L"Ошибка: номер не может быть отрицательным." << endl;
        return false;
    }
    number_ = number;
    return true;
}

bool Car::SetPrice(float price) {
    if (price < 0) {
        wcout << L"Ошибка: цена не может быть отрицательной." << endl;
        return false;
    }
    price_ = price;
    return true;
}

// === Метод Input с использованием сеттеров ===
void Car::Input() {
    wstring brand;
    while (true) {
        wcout << L"Введите марку машины: ";
        wcin >> brand;
        if (SetBrand(brand.c_str())) break;
    }

    int num;
    while (true) {
        wcout << L"Введите номер машины: ";
        wcin >> num;
        if (wcin.fail()) {
            wcin.clear();
            wcin.ignore(numeric_limits<streamsize>::max(), L'\n');
            wcout << L"Ошибка: введите число." << endl;
            continue;
        }
        if (SetNumber(num)) break;
    }

    float price;
    while (true) {
        wcout << L"Введите цену машины: ";
        wcin >> price;
        if (wcin.fail()) {
            wcin.clear();
            wcin.ignore(numeric_limits<streamsize>::max(), L'\n');
            wcout << L"Ошибка: введите число." << endl;
            continue;
        }
        if (SetPrice(price)) break;
    }
}

// === Вывод информации ===
void Car::Print() const {
    wcout << L"Марка: " << brand_ << endl;
    wcout << L"Номер: " << number_ << endl;
    wcout << L"Цена: " << price_ << endl;
}

// === Класс AdditionalCar ===
AdditionalCar::AdditionalCar()
    : Car(L"unknown", 0, 0), mainInfo_(L"нет описания") {
}

AdditionalCar::AdditionalCar(const wchar_t* brand, const wchar_t* mainInfo, int number, float price)
    : Car(brand, number, price), mainInfo_(mainInfo) {
}

AdditionalCar::~AdditionalCar() {
    wcout << L"[~AdditionalCar] Вызван деструктор AdditionalCar" << endl;
}

void AdditionalCar::Print() const {
    Car::Print();
    wcout << L"Описание: " << mainInfo_ << endl;
}

// === Главная функция ===
int main() {
#ifdef _WIN32
    system("chcp 1251 > nul");
#endif
    setlocale(LC_ALL, "Russian");
    SetConsoleOutputCP(866);

    int choice;
    wcout << L"Выберите вариант (1–4):" << endl;
    wcout << L"1. Статическое выделение памяти (по умолчанию)\n";
    wcout << L"2. Статическое выделение (с параметрами)\n";
    wcout << L"3. Динамическое выделение (по умолчанию)\n";
    wcout << L"4. Динамическое выделение (с параметрами)\n";
    wcin >> choice;

    if (choice == 1) {
        Car car1;
        wcout << L"Информация о машине car1:" << endl;
        car1.Print();
    }
    else if (choice == 2) {
       
        Car car2(L"Ниссан", 1234, 18000.0);
        wcout << L"Информация о машине car2 (статическая, с параметрами):" << endl;
        car2.Print();

        AdditionalCar car3(L"MiniCar",
            L"Компактный автомобиль для города.",
            2024, 15000.0);
        wcout << L"\nИнформация о машине car3 (наследник):" << endl;
        car3.Print();
    }
    else if (choice == 3) {
        Car* car4 = new Car();
        car4->Input();
        wcout << L"\nВведённая информация:" << endl;
        car4->Print();
        delete car4;
    }
    else if (choice == 4) {
        Car* car5 = new Car(L"Форд", 2020, 20000.0);
        wcout << L"Информация о машине car5:" << endl;
        car5->Print();
        delete car5;
    }
    else {
        wcout << L"Некорректный выбор." << endl;
    }

    wcout << L"\nНажмите Enter, чтобы выйти...";
    wcin.ignore();
    wcin.get();
    return 0;
}
