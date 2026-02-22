#include "car.h"
#include "additionalCar.h"
#include "myUtils.h"

using namespace std;

// Функция настройки отображения символов и поддержки киррилицы
static void setUpLocale() {
#ifdef _WIN32
    system("chcp 1251 > nul");
#endif
    setlocale(LC_ALL, "Russian");
}

// Номер пункта меню, соответствующий выходу из приложения
#define EXIT_CHOICE 6
// Мето для вывода меню на экран
static void printMenu() {
    cout << "\n------------------------------------------------\n";
    cout << "Выберите сценарий (1–5):" << endl;
    cout << "1. Объект Car на стеке (конструктор по умолчанию)\n";
    cout << "2. Объект Car на стеке (конструктор с параметрами)\n";
    cout << "3. Динамический объект Car (ввод с клавиатуры)\n";
    cout << "4. Динамический объект Car (конструктор с параметрами)\n";
    cout << "5. Объект AdditionalCar (наследник Car) на стеке (ввод с клавиатуры)\n";
    cout << EXIT_CHOICE << ". Выйти из приложения\n";
}

// Функция, выполняющая конкретный сценарий, в зависимости от choice
static void processChoice(int choice) {
    switch (choice) {
    case 1: {
        // Объект Car на стеке (конструктор по умолчанию)
        Car car;
        cout << "Информация о машине:" << endl;
        car.Print();
        break;
    }
    case 2: {
        // Объект Car на стеке(конструктор с параметрами)
        Car car("Ниссан", 1234, 18000.0);
        cout << "Информация о машине:" << endl;
        car.Print();
        break;
    }
    case 3: {
        // Динамический объект Car (ввод с клавиатуры)
        Car* car = new Car();
        car->Input();
        cout << "\nВведённая информация о машине:" << endl;
        car->Print();
        delete car; // Не забываем удалить динамический объект
        break;
    }
    case 4: {
        // Динамический объект Car (конструктор с параметрами)
        Car* car = new Car("Форд", 2020, 20000.0);
        cout << "Информация о машине:" << endl;
        car->Print();
        delete car; // Не забываем удалить динамический объект
        break;
    }
    case 5: {
        // Объект AditionalCar(наследник Car) на стеке (ввод с клавиатуры)
        AdditionalCar additionalCar;
        // Создадим ссылку на Car, ссылающуюся на инстнас AdditionalCar
        // и далее продемонстрируем полиморфизм, через вызов виртуальных методов
        Car &car = additionalCar;
        car.Input(); // вызов виртуального метода Input
                     // будет вызван метод AdditionalCar::Input
        cout << "\nВведённая информация о машине:" << endl;
        car.Print(); // вызов виртуального метода Print
                     // будет вызван метод AdditionalCar::Print
        break;
    }
    default:
        cout << "Некорректный выбор." << endl;
        break;
    }
}

// === Главная функция ===
int main() {
    // Настраиваем отображение символов и поддержку киррилицы
    setUpLocale();

    // В цикле выводим пункты меню и запускаем запрашиваемые сценарии,
    // пока пользователь не запросит завершения
    while (true) {
        printMenu(); // вывод на экран пунктов меню

        int choice;
        cin >> choice;
        // обработка ошибок ввода чисел
        if (cin.fail()) {
            // обрабатываем ошибку ввода
            HANDLE_INPUT_ERROR("введите число.");
            // продолжаем цикл для повторного ввода
            continue;
        }
        if (choice == EXIT_CHOICE) break;

        // выполняем сценарий, в зависимости от выбора пользователя
        processChoice(choice);
    }
    return 0;
}
