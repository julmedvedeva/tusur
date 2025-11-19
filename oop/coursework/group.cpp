#include <iostream>
#include <string>
#include <cstring>
#include "group.h"
#include "timer.h"

using namespace std;

// Конструктор с параметром
Group::Group(int s) : size(s)
{
    cout << "Вызван конструктор Group с размером " << size << endl;
    timers = new Time[size];
}

// Конструктор копирования
Group::Group(const Group& other) : size(other.size)
{
    cout << "Вызван конструктор копирования Group" << endl;
    timers = new Time[size];
    for (int i = 0; i < size; i++) {
        timers[i] = other.timers[i];
    }
}

// Деструктор
Group::~Group()
{
    cout << "Вызван деструктор Group для массива из " << size << " элементов" << endl;
    delete[] timers;
}

void Group::setTimer(int index, const Time& time)
{
    if (index >= 0 && index < size) {
        timers[index] = time;
    }
}

int Group::substractSeconds(int index, int sec)
{
    if (index >= 0 && index < size) {
        timers[index].deductSeconds(sec);
        return timers[index].toSeconds();
    }
    return -1;
}

Time& Group::operator[](int i) {
    return timers[i];
}

const Time& Group::operator[](int i) const {
    return timers[i];
}

// Оператор присваивания
Group& Group::operator=(const Group& other) {
    if (this != &other) {
        delete[] timers;
        size = other.size;
        timers = new Time[size];
        for (int i = 0; i < size; i++) {
            timers[i] = other.timers[i];
        }
    }
    return *this;
}

// Геттер для размера
int Group::getSize() const {
    return size;
}