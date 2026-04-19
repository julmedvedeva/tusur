#pragma once
#include "timer.h"

class Group
{
public:
    // Конструкторы
    Group(int size);                        // Конструктор с параметром
    Group(const Group& other);              // Конструктор копирования
    ~Group();                               // Деструктор

    // Операции
    int substractSeconds(int index, int sec);
    void setTimer(int index, const Time& timer);

    // Перегрузка операторов
    Time& operator[](int i);
    const Time& operator[](int i) const;
    Group& operator=(const Group& other);   // Оператор присваивания

    // Геттер для размера
    int getSize() const;

private:
    Time* timers;
    int size;
};

