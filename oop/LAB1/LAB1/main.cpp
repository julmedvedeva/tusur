#include <iostream>
#include <cstring>
#include <cctype> // ��� ������� isalpha
#include <limits> // ��� numeric_limits
#include "main.h"

using namespace std;

// ����������� �� ��������� ��� Car
Car::Car() : number_(0), price_(0) {
    brand_ = new char[8]; // �������� ������ ��� ������
    strcpy(brand_, "unknown"); // �������� ������ �� ���������
}

// ����������� � ����������� ��� Car
Car::Car(const char* brand, int number, float price)
    : number_(number), price_(price) {
    brand_ = new char[strlen(brand) + 1]; // �������� ������ ��� ������
    strcpy(brand_, brand); // �������� ���������� ������
}

// ���������� ��� Car
Car::~Car() {
    delete[] brand_; // ����������� ������
}

// ����� ������ ���������� � ������
void Car::Print() const {
    cout << "������:" << endl;
    cout << "�����: " << (brand_ ? brand_ : "����������") << endl; // �������� �� nullptr
    cout << "�����: " << number_ << endl;
    cout << "����: " << price_ << endl;
}

// ����� ����� ���������� � ������
void Car::Input() {
    // ����������� ������ ������
    if (brand_ != nullptr) {
        delete[] brand_;
    }

    // �������� ������ ��� ����� ������
    brand_ = new char[100];

    // ���� ����� ������ � ����������
    while (true) {
        cout << "������� ����� ������: ";
        cin >> brand_;

        // �������� �� ������� ���� �� ����� ����� � ���������� ������ ����
        bool hasLetter = false;
        bool hasOnlyDigits = true;

        for (size_t i = 0; i < strlen(brand_); ++i) {
            if (isalpha(brand_[i])) {
                hasLetter = true;
            }
            if (isdigit(brand_[i])) {
                // ���� ���� ���� �� ���� �����, �� ��� �� ������ �����
                hasOnlyDigits = false;
            }
        }

        // ������� ��� �������� ����������
        if (hasLetter && !hasOnlyDigits) {
            break; // ���� ���������, ������� �� �����
        }
        else {
            cout << "������: ����� ������ ��������� ���� �� ���� ����� � �� ����� �������� ������ �� ����." << endl;
        }
    }

    // ���� ������ ������ � ����������
    do {
        cout << "������� ����� ������: ";
        cin >> number_;
    } while (cin.fail() || number_ < 0);

    // ���� ���� ������ � ����������
    do {
        cout << "������� ���� ������: ";
        cin >> price_;
    } while (cin.fail() || price_ < 0);

    cin.clear(); // ������� ���� ������
    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // ���������� ���������� ������� � ������
}

// ���������� ������� SetBrand, SetNumber � SetPrice
void Car::SetBrand(const char* brand) {
    if (brand_ != nullptr) {
        delete[] brand_;
    }
    brand_ = new char[strlen(brand) + 1];
    strcpy(brand_, brand);
}

void Car::SetNumber(int number) {
    number_ = number;
}

void Car::SetPrice(float price) {
    price_ = price;
}

// ����������� �� ��������� ��� ACar
ACar::ACar() : Car(), mainInfo_("unknown") {}

// ����������� ��� ACar
ACar::ACar(const char* brand, const string& mainInfo, int number, float price)
    : Car(brand, number, price), mainInfo_(mainInfo) {
}

// ���������� ��� ACar
ACar::~ACar() {}

// ����� ������ ���������� � ������ � ��������������� ������� ��� ������ A
void ACar::Print() const {
    cout << "������ ������ A:" << endl;
    Car::Print(); // ����� ������ Print �������� ������
    cout << "������� ���������� � ������ �����:" << endl;
    cout << mainInfo_ << endl;
}

// ����������� �� ��������� ��� CCar
CCar::CCar() : Car() {}

// ����������� ��� CCar
CCar::CCar(const char* brand, int number, float price)
    : Car(brand, number, price) {
}

// ���������� ��� CCar
CCar::~CCar() {}

// ����� ������ ���������� � ������ � ��������������� ������� ��� ������ C
void CCar::Print() const {
    cout << "������ ������ C:" << endl;
    Car::Print(); // ����� ������ Print �������� ������
}

int main() {
    int numberChoice;

#ifdef _WIN32
    system("chcp 1251 > nul"); // ��������� ��������� ��� Windows
#endif

    // ������� ������ ������ � �������������� ������������ � �����������
    Car car1("����", 1994, 100.0);
    cout << "���������� � ������ car1:" << endl;
    car1.Print();

    // ���������� ������� ��� ��������� ��������
    car1.SetBrand("������");
    car1.SetNumber(2021);
    car1.SetPrice(15000.0);

    cout << "\n����������� ���������� � ������ car1:" << endl;
    car1.Print();

    // ������� ������������ ������ ������
    Car* car2 = new Car("����", 2000, 1000.0);
    cout << "���������� � ������ car2:" << endl;
    car2->Print();
    delete car2;

    cout << "��������, ��� �� ������ ������� (������� �����):" << endl;
    cout << "1. ���������� ������ ������ A" << endl;
    cout << "2. ���������� ������ ������ C" << endl;
    cout << "3. ������ � ���������� ���������� � ������ ��� ������" << endl;

    cin >> numberChoice;

    if (numberChoice == 1) {
        // ������� ������ ������ ������ A
        ACar* carA = new ACar("���� 500",
            "��� ���������, ����� ��������� ���� � ���������� �������� (���� ������� �� 0,8 �� 1,4 �), � �������������, ����������������� ���� ��������������� ��������� ������� � ����������� ������������� ��������.",
            2007, 50000.00);
        cout << "���������� � ������ carA:" << endl;
        carA->Print();
        delete carA; // ����������� ������
    }
    else if (numberChoice == 2) {
        // ������� ������ ������ ������ C
        CCar* carC = new CCar("���� �����", 2003, 20000.5);
        cout << "���������� � ������ carC:" << endl;
        carC->Print();
        delete carC; // ����������� ������
    }
    else if (numberChoice == 3) {
        // ������� ������ ������ � �������������� ������������ �� ���������
        Car car3;
        cout << "\n������� ���������� � ������ car3:" << endl;
        car3.Input(); // ���� ���������� � ������
        cout << "\n���������� � ������ car3:" << endl;
        car3.Print(); // ����� ���������� � ������
    }
    else {
        cout << "������� ����������� �����" << endl;
    }

    // ��������� �������� ����� ����� ���������
    cout << "������� Enter, ����� �����...";
    cin.ignore(); // ���������� ������ ����� ������, ���� �� ������� � ������
    cin.get(); // ���� ����� ������������

    return 0;
}