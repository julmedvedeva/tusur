#pragma once
#ifndef TIME_H
#define TIME_H

#include <string>
#include <iostream>

class Time {
private:
    int hours;
    int minutes;
    int seconds;

    // Вспомогательный метод для нормализации времени
    void normalize();

public:
    // Конструкторы
    Time();                                     // Конструктор по умолчанию
    Time(int h, int m, int s);                  // Конструктор с параметрами
    Time(int totalSeconds);                     // Конструктор из общего числа секунд
    Time(const Time& other);                    // Конструктор копирования

    // Деструктор
    ~Time();

    // Геттеры
    int getHours() const;
    int getMinutes() const;
    int getSeconds() const;

    // Сеттеры
    void setTime(int h, int m, int s);
    void setHours(int h);
    void setMinutes(int m);
    void setSeconds(int s);

    // Преобразования
    int toSeconds() const;
    void fromSeconds(int totalSeconds);

    // Операции со временем
    void deductSeconds(int sec);
    int secondsBetween(const Time& other) const;

    // Перегрузка операторов
    Time operator-(int sec) const;              // Вычитание секунд
    Time& operator-=(int sec);                  // Вычитание с присваиванием
    Time& operator=(const Time& other);         // Оператор присваивания
    bool operator==(const Time& other) const;   // Сравнение на равенство
    bool operator<(const Time& other) const;    // Сравнение "меньше"
    bool operator>(const Time& other) const;    // Сравнение "больше"

    // Ввод/вывод
    friend std::ostream& operator<<(std::ostream& os, const Time& t);
    friend std::istream& operator>>(std::istream& is, Time& t);

    // Преобразование в строку
    std::string toString() const;

    // Статический метод валидации
    static bool isValid(int h, int m, int s);

    // Ввод с консоли с валидацией
    void inputFromConsole();
};

#endif
