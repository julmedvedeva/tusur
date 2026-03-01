#include "car.h"
#include "utils.h"

// === Реализация класса Car ===

// Используем пространство имен std, чтобы не писать везде 'std::'
using namespace std;

// Макрос, определяющий максимальный размер строки для хранения названия бренда
#define BRAND_BUF_SIZE 255

// Конструктор по умолчанию
Car::Car() : power_(0), price_(0) {
    cout << "Вызван конструктор по умолчанию Car" << endl;
    brand_ = new char[BRAND_BUF_SIZE]; // выделение динамической памяти для строки бренда
    strcpy(brand_, "unknown"); // копируем "unknown" в выделенную память
}

// Параметризованный конструктор класса Car.
Car::Car(const char* brand, int power, float price)
    : power_(power), price_(price) {
    cout << "Вызван конструктор с параметрами Car" << endl;
    this->brand_ = new char[BRAND_BUF_SIZE]; // выделение динамической памяти для строки бренда
    // копируем переданную строку в выделенную память
    // третий параметр (BRAND_BUF_SIZE) ограничивает количесвто копируемых символов,
    // на тот случай, если передаваемая строка окажется слишком большой для переменной
    strncpy(this->brand_, brand, BRAND_BUF_SIZE);
}

// Копирующий конструктор
Car::Car(const Car& other)
    : power_(other.power_), price_(other.price_) {
    cout << "Вызван конструктор копирования Car" << endl;
    this->brand_ = new char[BRAND_BUF_SIZE]; // выделяем память под строку
    strncpy(this->brand_, other.brand_, BRAND_BUF_SIZE); // копируем бренд
}

// Оператор присваивания
Car& Car::operator=(const Car& other) {
    cout << "Вызван оператор присваивания Car" << endl;
    if (this != &other) { // Проверка на самоприсваивание
        delete[] brand_; // Освобождаем старую память
        power_ = other.power_; // Копируем мощность
        price_ = other.price_; // Копируем цену
        brand_ = new char[BRAND_BUF_SIZE]; // Выделяем новую память под бренд
        strncpy(brand_, other.brand_, BRAND_BUF_SIZE); // Копируем бренд
    }
    // Возвращаем ссылку на текущий объект (*this),
    // что позволяет цепочку присваиваний вида: `car1 = car2 = car3;`
    return *this;
}

// Деструктор класса
Car::~Car() {
    cout << "Вызван деструктор Car" << endl;
    delete[] brand_; // не забываем освободить выделенную в конструкторе память
}

// Метод установки марки автомобиля
bool Car::SetBrand(const char* brand) {
    // проверка входящего значения на валидность.
    if (brand == nullptr || strlen(brand) == 0) {
        cout << "Ошибка: марка не может быть пустой." << endl;
        return false;
    }
    // копируем переданную строку в выделенную память
    strncpy(brand_, brand, BRAND_BUF_SIZE);
    return true;
}

// Метод установки мощности автомобиля
bool Car::SetPower(int power) {
    if (power < 0) {
        cout << "Ошибка: мощность не может быть отрицательной." << endl;
        return false;
    }
    power_ = power; 
    return true;
}

// Метод установки цены автомобиля.
bool Car::SetPrice(float price) {
    if (price < 0) {
        cout << "Ошибка: цена не может быть отрицательной." << endl;
        return false;
    }
    price_ = price;
    return true;
}

// Метод ввода данных с клавиатуры с проверкой вводимых значений
void Car::Input() {
    string brand;
    // запрашиваем ввод бренда с клавиатуры
    // в цикле, пока не будет введено валидное значение
    while (true) {
        cout << "Введите марку машины: ";
        cin >> brand;
        // используем уже реализованный сеттер для установки бренда
        if (SetBrand(brand.c_str()))
            break; // выходим из цикла при успешной установке введённого значения
    }

    int num;
    // запрашиваем ввод мощности с клавиатуры
    // в цикле, пока не будет введено валидное значение
    while (true) {
        cout << "Введите мощность машины (л. с.): ";
        cin >> num;
        // обработка ошибок ввода чисел
        if (cin.fail()) {
            // сбрасываем флаги ошибок ввода (могут мешать последующему вводу)
            cin.clear();
            // игнорируем оставшиеся символы до конца строки
            // например, если было введено "очень мощная!",
            // то оператор >> извлечёт только "очень" (не число), 
            // а " мощная!" останется в буфере ввода и будет мешать следующим операциям
            cin.ignore(numeric_limits<streamsize>::max(), L'\n');
            cout << "Ошибка: введите число." << endl;
            // продолжаем цикл для повторного ввода
            continue;
        }
        // используем сеттер для установки мощности
        if (SetPower(num))
            break; // выходим из цикла при успешной установке значения
    }

    float price;
    // запрашиваем ввод цены с клавиатуры
    // в цикле, пока не будет введено валидное значение
    while (true) {
        cout << "Введите цену машины (руб.): ";
        cin >> price;
        // обработка ошибок ввода чисел
        if (cin.fail()) {
            // обрабатываем ошибку ввода
            HANDLE_INPUT_ERROR("введите число");
            // продолжаем цикл для повторного ввода
            continue;
        }
        // используем сеттер для установки цены
        if (SetPrice(price))
            break; // выходим из цикла при успешной установке значения
    }
}

// Реализация виртуальной функции вывода информации
void Car::Print() const {
    this->Print(std::cout); // this здесь не обязатлен,
                            // но повышает читаемость
}

void Car::Print(std::ostream& os) const
{
    os << "Марка: " << brand_ << endl;
    os << "Мощность (л. с.): " << power_ << endl;
    os << "Цена (руб.): " << price_ << endl;
}

// Определение бинарного оператора +
float operator+(Car& c1, Car& c2) {
    return (c1.price_ + c2.price_);
}

std::ostream& operator<<(std::ostream& os, const Car& car)
{
    car.Print(os); // печатаем маину в поток вывода

    // возвращаем поток,
    // чтобы в месте вызова можно было продолжить с ним работу
    return os;
}
