#include "additionalCar.h"
#include <string>

// === Реализация класса AdditionalCar ===

// Используем пространство имен std, чтобы не писать везде 'std::'
using namespace std;

// Конструктор по умолчанию
// Инициализируем базовый класс Car() и поле mainInfo_ значением по умолчанию
AdditionalCar::AdditionalCar()
    : Car(), mainInfo_("нет описания") {
    cout << "Вызван конструктор по умолчанию AdditionalCar" << endl;
}

// Параметризованный конструктор класса AdditionalCar
// Инициализирует базовый класс Car с переданными параметрами brand, power, price
// И поcле mainInfo_ переданным значением mainInfo
AdditionalCar::AdditionalCar(const char* brand, const char* mainInfo, int power, float price)
    : Car(brand, power, price), mainInfo_(mainInfo) {
    cout << "Вызван конструктор с параметрами AdditionalCar" << endl;
}

// Деструктор класса AdditionalCar
// (автоматически вызывает деструктор базового класса Car)
AdditionalCar::~AdditionalCar() {
    cout << "Вызван деструктор AdditionalCar" << endl;
}

// Метод установки основного описания автомобиля
bool AdditionalCar::SetMainInfo(const char* mainInfo)
{
    if (mainInfo == nullptr || strlen(mainInfo) == 0) {
        cout << "Ошибка: описание не может быть пустым." << endl;
        return false;
    }
    this->mainInfo_ = mainInfo;
    return true;
}

// Метод ввода данных с клавиатуры с проверкой вводимых значений
// Сначала вызывает метод Input базового класса для ввода общих характеристик
// Затем запрашивает дополнительное описание
void AdditionalCar::Input() {
    Car::Input(); // Вызываем метод ввода базового класса

    string mainInfo;
    // Запрашиваем ввод описания с клавиатуры
    // В цикле, пока не будет введено валидное значение
    while (true) {
        cout << "Введите описание машины: ";
        cin >> ws; // Пропускаем начальные пробельные символы
        getline(cin, mainInfo); // Считываем всю строку (включая пробелы)
        // Используем сеттер для установки описания
        if (SetMainInfo(mainInfo.c_str()))
            break; // Выходим из цикла при успешной установке значения
    }
}

// Реализация виртуальной функции вывода информации
void AdditionalCar::Print() const {
    Car::Print(); // Вызываем метод вывода базового класса
    cout << "Описание: " << this->mainInfo_ << endl; // Выводим дополнительное описание
}
