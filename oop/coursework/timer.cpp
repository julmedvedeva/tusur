#include "timer.h"
#include <iomanip>
#include <sstream>
#include <cmath>
using namespace std;

// Конструктор по умолчанию
Time::Time() : hours(0), minutes(0), seconds(0) {
    cout << "Вызван конструктор по умолчанию" << endl;
}

// Конструктор с параметрами
Time::Time(int h, int m, int s) : hours(h), minutes(m), seconds(s) {
    cout << "Вызван конструктор с параметрами (" << h << ", " << m << ", " << s << ")" << endl;
    normalize();
}

// Конструктор из общего числа секунд
Time::Time(int totalSeconds) {
    cout << "Вызван конструктор из секунд (" << totalSeconds << ")" << endl;
    fromSeconds(totalSeconds);
}

// Конструктор копирования
Time::Time(const Time& other) : hours(other.hours), minutes(other.minutes), seconds(other.seconds) {
    cout << "Вызван конструктор копирования" << endl;
}

// Деструктор
Time::~Time() {
    cout << "Вызван деструктор для времени " << toString() << endl;
}

// Нормализация времени
void Time::normalize() {
    while (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    while (seconds >= 60) {
        seconds -= 60;
        minutes++;
    }
    while (minutes < 0) {
        minutes += 60;
        hours--;
    }
    while (minutes >= 60) {
        minutes -= 60;
        hours++;
    }
    while (hours < 0) {
        hours += 24;
    }
    while (hours >= 24) {
        hours -= 24;
    }
}

// Геттеры
int Time::getHours() const { return hours; }
int Time::getMinutes() const { return minutes; }
int Time::getSeconds() const { return seconds; }

// Сеттеры
void Time::setTime(int h, int m, int s) {
    hours = h;
    minutes = m;
    seconds = s;
    normalize();
}

void Time::setHours(int h) {
    hours = h;
    normalize();
}

void Time::setMinutes(int m) {
    minutes = m;
    normalize();
}

void Time::setSeconds(int s) {
    seconds = s;
    normalize();
}

int Time::toSeconds() const {
    return hours * 3600 + minutes * 60 + seconds;
}

void Time::fromSeconds(int totalSeconds) {
    while (totalSeconds < 0) {
        totalSeconds += 86400;
    }
    totalSeconds = totalSeconds % 86400;
    hours = totalSeconds / 3600;
    totalSeconds %= 3600;
    minutes = totalSeconds / 60;
    seconds = totalSeconds % 60;
}

void Time::deductSeconds(int sec) {
    int totalSeconds = toSeconds() - sec;
    fromSeconds(totalSeconds);
}

// Вычисление разницы в секундах между двумя моментами
int Time::secondsBetween(const Time& other) const {
    return abs(this->toSeconds() - other.toSeconds());
}

// Перегрузка оператора вычитания
Time Time::operator-(int sec) const {
    int total = toSeconds() - sec;
    return Time(total);
}

// Перегрузка оператора вычитания с присваиванием
Time& Time::operator-=(int sec) {
    int total = toSeconds() - sec;
    fromSeconds(total);
    return *this;
}

// Оператор присваивания
Time& Time::operator=(const Time& other) {
    if (this != &other) {
        hours = other.hours;
        minutes = other.minutes;
        seconds = other.seconds;
    }
    return *this;
}

// Сравнение на равенство
bool Time::operator==(const Time& other) const {
    return hours == other.hours && minutes == other.minutes && seconds == other.seconds;
}

// Сравнение "меньше"
bool Time::operator<(const Time& other) const {
    return toSeconds() < other.toSeconds();
}

// Сравнение "больше"
bool Time::operator>(const Time& other) const {
    return toSeconds() > other.toSeconds();
}

// Перегрузка оператора вывода
ostream& operator<<(ostream& os, const Time& t) {
    os << setfill('0') << setw(2) << t.hours << ":"
       << setfill('0') << setw(2) << t.minutes << ":"
       << setfill('0') << setw(2) << t.seconds;
    return os;
}

// Перегрузка оператора ввода
istream& operator>>(istream& is, Time& t) {
    char sep1, sep2;
    is >> t.hours >> sep1 >> t.minutes >> sep2 >> t.seconds;
    t.normalize();
    return is;
}

string Time::toString() const {
    ostringstream oss;
    oss << setw(2) << setfill('0') << hours << ":"
        << setw(2) << setfill('0') << minutes << ":"
        << setw(2) << setfill('0') << seconds;
    return oss.str();
}

// Статический метод валидации
bool Time::isValid(int h, int m, int s) {
    return h >= 0 && h < 24 && m >= 0 && m < 60 && s >= 0 && s < 60;
}

// Ввод с консоли с валидацией
void Time::inputFromConsole() {
    int h, m, s;
    bool valid = false;

    while (!valid) {
        cout << "Введите часы (0-23): ";
        cin >> h;
        if (cin.fail() || h < 0 || h > 23) {
            cin.clear();
            cin.ignore(10000, '\n');
            cout << "Ошибка: часы должны быть от 0 до 23" << endl;
            continue;
        }

        cout << "Введите минуты (0-59): ";
        cin >> m;
        if (cin.fail() || m < 0 || m > 59) {
            cin.clear();
            cin.ignore(10000, '\n');
            cout << "Ошибка: минуты должны быть от 0 до 59" << endl;
            continue;
        }

        cout << "Введите секунды (0-59): ";
        cin >> s;
        if (cin.fail() || s < 0 || s > 59) {
            cin.clear();
            cin.ignore(10000, '\n');
            cout << "Ошибка: секунды должны быть от 0 до 59" << endl;
            continue;
        }

        valid = true;
        setTime(h, m, s);
    }
}