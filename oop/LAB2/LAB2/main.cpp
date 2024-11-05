#include <iostream>
#include <string>
#include <cstring>
#include <random>
#include "car.h"
#include "group.h"
using namespace std;
int main() {
    
    // Установка кодировки для Windows
    #ifdef _WIN32
        system("chcp 1251 > nul"); 
    #endif
    char brands[3][20] = { "Рено", "ВАЗ", "Мазда" };
    Group group(3);
    int length =  group.Size();

    // Создаем генератор случайных чисел
    // Получаем случайное число от аппаратного генератора
    std::random_device rd;
    // Инициализируем генератор случайных чисел с использованием rd() как начального значения
    std::mt19937 gen(rd());
    // Определяем диапазон случайных чисел с плавающей точкой
    // Генерируем случайное число от 1.0 до 100.0
    std::uniform_real_distribution<float> distrib(1.0, 100.0); 


    for(int i{0}; i< length && i < 3; i++)
    {
        Car car(brands[i], i + 1910, distrib(gen));
        group.PutCar(i, car);
    }

    group.Print();
    double price = group.GetCar(1);
    std::cout << "Цена автомобиля: " << price << std::endl;
    Car car = group.GetCar(1);
    std::cout << "Автомобиль через .GetCar: " << car << std::endl;
    Car car2 = group[1];
    std::cout << "Автомобиль через group[1]: " << car2 << std::endl;

    double sum = group[0] + group[2];
    std::cout << "Сумма цены для group[0] и group[2]: " << sum << std::endl;


    //// Добавлено ожидание ввода перед закрытием
    //cout << "Нажмите Enter, чтобы выйти...";
    //cin.ignore(); // Игнорируем символ новой строки, если он остался в буфере
    //cin.get(); // Ждем ввода пользователя

    return 0;


}

