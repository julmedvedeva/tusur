#include <iostream>
#include <string>
#include <cstring>
#include "car.h"
#include "group.h"
#include "utils.h"
using namespace std;

#define GROUP_LENGHT 5

// Функция настройки отображения символов и поддержки киррилицы
static void setUpLocale() {
#ifdef _WIN32
    system("chcp 1251 > nul");
#endif
    setlocale(LC_ALL, "Russian");
}

// Создаёт число, близкое к переданному, но похожее на цену
// Алгоритм: сохраняем первые три цифры числа,
// если третья цифра >= 5, то заполняем оставшиеся цифры девятками,
// иначе - нулями
static float makeLookLikePrice(float x) {
    // Отбрасываем копейки
    int price = (int)(x);
    // Преобразуем цену в строку для работы с цифрами
    std::string priceStr = std::to_string(price);
    size_t length = priceStr.length();

    // Берем первые 3 цифры сразу записываем их в результат
    std::string firstThree = priceStr.substr(0, 3);
    std::string result = firstThree;
    // Последняя цифра из первых трех
    char thirdDigit = firstThree[2];
    // Заменяем оставшиеся цифры
    // Определяем, заполнять нулями или девятками
    if (thirdDigit >= '5') {
        // Заполняем оставшиеся позиции девятками
        result.append(length - 3, '9');
    }
    else {
        // Заполняем оставшиеся позиции нулями
        result.append(length - 3, '0');
    }
    // Преобразуем обратно в число
    // "stoi" = "string to int"
    return (float)(std::stoi(result));
}

int main() {
    // Настраиваем отображение символов и поддержку киррилицы
    setUpLocale();

    Group group(GROUP_LENGHT);

    char brands[GROUP_LENGHT][20] = { "Рено", "ВАЗ", "Мазда", "Лада", "Тойота"};
    // Инициализируем псевдослучайный генератор для генерации мощности
    RandomGenerator powerGen(10.0, 500.0);
    // Инициализируем псевдослучайный генератор для генерации стоимости
    RandomGenerator priceGen(1000.0, 50000.0);

    // Создаем автомобили и помещаем их в группу
    for(int i{0}; i < GROUP_LENGHT; i++)
    {
        // Генерируем случайную мощность:
        //    - получаем дробное число от powerGen (например, 123.456)
        //    - приводим к целому типу (123)
        //    - округляем до ближайшего десятка: 123 - 123 % 10 = 123 - 3 = 120
        //      с целью сделать цифру более 
        int randomPower = (int)powerGen.getNumber();
        randomPower = randomPower - randomPower % 10;

        // Генерируем случайную стоимость:
        //    - получаем дробное число от priceGen
        //    - преобразуем к "похожему на цену" виду
        float randomPrice = makeLookLikePrice(priceGen.getNumber());

        // Создаем объект автомобиля
        Car car(brands[i], randomPower, randomPrice);
        // Помещаем созданный автомобиль в группу на позицию i
        group.PutCar(i, car);
    }

    group.Print();
    std::cout << '\n';

    float price = group.GetCar(1);
    std::cout << "Цена автомобиля, через приведение его к float: " << price << "\n\n";

    std::cout << "Среднее арифметическое цены автомобилей: " << group.Price() << "\n";
    std::cout << "Среднее арифметическое цены автомобилей дешевле 25000: "
              << group.Price(25000) << "\n\n";

    Car car = group.GetCar(1);
    std::cout << "Второй автомобиль в группе через Group::GetCar():\n" << car << "\n";
    Car car2 = group[1];
    std::cout << "Второй автомобиль в группе через operator[]:\n" << car2 << "\n";

    float sum = group[0] + group[2];
    std::cout << "Сумма цены для group[0] и group[2]: " << sum << std::endl;


    // Ожидание выхода перед закрытием
    cout << "Нажмите Enter, чтобы выйти...";
    cin.get(); // Ждем ввода пользователя

    return 0;
}
