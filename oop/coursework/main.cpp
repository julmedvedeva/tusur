#include "timer.h"
#include <iostream>
#include <clocale>
#include "group.h"

#ifdef _WIN32
    #include <windows.h>
#endif

using namespace std;

// Функция для отображения меню
void showMenu() {
    cout << "\n========================================" << endl;
    cout << "   ПРОГРАММА РАБОТЫ СО ВРЕМЕНЕМ" << endl;
    cout << "========================================" << endl;
    cout << "1. Вычитание секунд из времени" << endl;
    cout << "2. Подсчёт секунд между двумя моментами" << endl;
    cout << "3. Демонстрация всех операций" << endl;
    cout << "0. Выход" << endl;
    cout << "========================================" << endl;
    cout << "Выберите пункт меню: ";
}

// Функция для вычитания секунд из времени
void subtractSecondsOperation() {
    cout << "\n--- Вычитание секунд из времени ---" << endl;

    // Создаём объект времени и вводим данные
    Time time1;
    cout << "\nВведите исходное время:" << endl;
    time1.inputFromConsole();

    cout << "\nВведённое время: " << time1 << endl;

    // Ввод количества секунд для вычитания
    int secondsToSubtract;
    cout << "\nВведите количество секунд для вычитания: ";
    cin >> secondsToSubtract;

    while (cin.fail() || secondsToSubtract < 0) {
        cin.clear();
        cin.ignore(10000, '\n');
        cout << "Ошибка: введите положительное число секунд: ";
        cin >> secondsToSubtract;
    }

    // Вычитание секунд с использованием перегруженного оператора
    Time result = time1 - secondsToSubtract;

    cout << "\n========================================" << endl;
    cout << "Результат:" << endl;
    cout << "Исходное время: " << time1 << endl;
    cout << "Вычитаемые секунды: " << secondsToSubtract << endl;
    cout << "Оставшееся время: " << result << endl;
    cout << "========================================" << endl;
}

// Функция для подсчёта секунд между двумя моментами времени
void calculateSecondsBetween() {
    cout << "\n--- Подсчёт секунд между двумя моментами ---" << endl;

    // Ввод первого момента времени
    Time time1;
    cout << "\nВведите первый момент времени:" << endl;
    time1.inputFromConsole();

    // Ввод второго момента времени
    Time time2;
    cout << "\nВведите второй момент времени:" << endl;
    time2.inputFromConsole();

    // Вычисление разницы
    int difference = time1.secondsBetween(time2);

    cout << "\n========================================" << endl;
    cout << "Результат:" << endl;
    cout << "Первый момент времени: " << time1 << endl;
    cout << "Второй момент времени: " << time2 << endl;
    cout << "Разница в секундах: " << difference << endl;

    // Дополнительный вывод в удобном формате
    int hours = difference / 3600;
    int mins = (difference % 3600) / 60;
    int secs = difference % 60;
    cout << "Что составляет: " << hours << " ч. " << mins << " мин. " << secs << " сек." << endl;
    cout << "========================================" << endl;
}

// Демонстрация всех возможностей класса
void demonstrateAllOperations() {
    cout << "\n--- Демонстрация всех операций класса Time ---" << endl;

    // Демонстрация конструкторов
    cout << "\n1. Демонстрация конструкторов:" << endl;
    cout << "-------------------------------" << endl;

    Time t1;                    // Конструктор по умолчанию
    cout << "t1 (по умолчанию): " << t1 << endl;

    Time t2(14, 30, 45);        // Конструктор с параметрами
    cout << "t2 (14, 30, 45): " << t2 << endl;

    Time t3(3661);              // Конструктор из секунд
    cout << "t3 (из 3661 сек): " << t3 << endl;

    Time t4(t2);                // Конструктор копирования
    cout << "t4 (копия t2): " << t4 << endl;

    // Демонстрация преобразований
    cout << "\n2. Преобразование в секунды:" << endl;
    cout << "-------------------------------" << endl;
    cout << "t2 (" << t2 << ") = " << t2.toSeconds() << " секунд" << endl;

    // Демонстрация вычитания
    cout << "\n3. Вычитание секунд:" << endl;
    cout << "-------------------------------" << endl;
    Time t5(10, 0, 0);
    cout << "Исходное время t5: " << t5 << endl;
    Time t6 = t5 - 3661;
    cout << "t5 - 3661 сек = " << t6 << endl;

    // Демонстрация разницы между моментами времени
    cout << "\n4. Разница между моментами времени:" << endl;
    cout << "-------------------------------" << endl;
    Time morning(8, 30, 0);
    Time evening(18, 45, 30);
    int diff = morning.secondsBetween(evening);
    cout << "Между " << morning << " и " << evening << endl;
    cout << "Разница: " << diff << " секунд" << endl;

    // Демонстрация операторов сравнения
    cout << "\n5. Операторы сравнения:" << endl;
    cout << "-------------------------------" << endl;
    cout << morning << " < " << evening << " : " << (morning < evening ? "true" : "false") << endl;
    cout << morning << " > " << evening << " : " << (morning > evening ? "true" : "false") << endl;
    cout << morning << " == " << evening << " : " << (morning == evening ? "true" : "false") << endl;

    // Демонстрация оператора -=
    cout << "\n6. Оператор -= :" << endl;
    cout << "-------------------------------" << endl;
    Time t7(12, 0, 0);
    cout << "t7 до операции: " << t7 << endl;
    t7 -= 1800;
    cout << "t7 -= 1800: " << t7 << endl;

    // Демонстрация класса Group
    cout << "\n7. Демонстрация класса Group:" << endl;
    cout << "-------------------------------" << endl;
    Group group(2);
    Time time1(10, 30, 0);
    Time time2(14, 45, 30);
    group.setTimer(0, time1);
    group.setTimer(1, time2);
    cout << "group[0]: " << group[0] << endl;
    cout << "group[1]: " << group[1] << endl;

    cout << "\n--- Конец демонстрации ---" << endl;
    cout << "(Обратите внимание на вызовы деструкторов)" << endl;
}

int main() {
    // Настройка кодировки для Windows
    #ifdef _WIN32
        SetConsoleCP(1251);
        SetConsoleOutputCP(1251);
        setlocale(LC_ALL, "Russian");
    #else
        setlocale(LC_ALL, "ru_RU.UTF-8");
    #endif

    int choice;

    do {
        showMenu();
        cin >> choice;

        if (cin.fail()) {
            cin.clear();
            cin.ignore(10000, '\n');
            cout << "Ошибка ввода! Попробуйте снова." << endl;
            continue;
        }

        switch (choice) {
            case 1:
                subtractSecondsOperation();
                break;
            case 2:
                calculateSecondsBetween();
                break;
            case 3:
                demonstrateAllOperations();
                break;
            case 0:
                cout << "\nЗавершение программы..." << endl;
                break;
            default:
                cout << "\nНеверный выбор! Попробуйте снова." << endl;
        }

    } while (choice != 0);

    // Ожидание нажатия Enter перед закрытием
    cout << "Нажмите Enter, чтобы выйти...";
    cin.ignore();
    cin.get();

    return 0;
}