#define NOMINMAX 
#include "main.h"
#include <Windows.h>
#include <cctype> // ��� ������� isalpha
#include <cstring>
#include <iostream>


#include <limits> // ��� numeric_limits

using namespace std;

// ����������� �� ��������� ��� Car
Car::Car() : number_(0), price_(0), brand_(L"unknown") {}

// ����������� � ����������� ��� Car
Car::Car(const wchar_t* brand, int number, float price)
    : number_(number), price_(price), brand_(brand) {
}

// ���������� ��� Car
Car::~Car() {}

// ����� ������ ���������� � ������
void Car::Print() const {
    wcout << L"������:" << endl;
    wcout << L"�����: " << (brand_.empty() ? L"����������" : brand_.c_str()) << endl;
    wcout << L"�����: " << number_ << endl;
    wcout << L"����: " << price_ << endl;
}

void Car::Input() {
    // ���� ����� ������ � ����������
    while (true) {
        wcout << L"������� ����� ������: ";
        wstring brand;
        wcin >> brand;

        // �������� �� ������� ���� �� ����� ����� � ���������� ������ ����
        bool hasLetter = false;
        bool hasOnlyDigits = true;

        for (wchar_t ch : brand) {
            if (iswalpha(ch)) {
                hasLetter = true;
            }
            if (!iswdigit(ch)) {
                hasOnlyDigits = false;
            }
        }

        // ������� ��� �������� ����������:
        if (hasLetter) { // ���������, ���� �� ���� �� ���� ����� (�������� ��� ���������)
            brand_ = brand; // ���������� �����
            break; // ���� ���������, ������� �� �����
        }
        else {
            wcout << L"������: ����� ������ ��������� ���� �� ���� ����� � �� ����� �������� ������ �� ����." << endl;
        }
    }

    // ���� ������ ������ � ����������
    while (true) {
        wcout << L"������� ����� ������: ";
        wcin >> number_;
        if (wcin.fail() || number_ < 0) {
            wcin.clear(); // ������� ���� ������
            wcin.ignore(numeric_limits<streamsize>::max(), L'\n'); // ���������� ���������� ������� � ������
            wcout << L"������: ������� ���������� ����� ������." << endl;
        }
        else {
            break; // ���� ���������, ������� �� �����
        }
    }

    // ���� ���� ������ � ����������
    while (true) {
        wcout << L"������� ���� ������: ";
        wcin >> price_;
        if (wcin.fail() || price_ < 0) {
            wcin.clear(); // ������� ���� ������
            wcin.ignore(numeric_limits<streamsize>::max(), L'\n'); // ���������� ���������� ������� � ������
            wcout << L"������: ������� ���������� ���� ������." << endl;
        }
        else {
            break; // ���� ���������, ������� �� �����
        }
    }
}

// ���������� ������� SetBrand, SetNumber � SetPrice
void Car::SetBrand(const wchar_t* brand) {
    brand_ = brand;
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
ACar::ACar(const wchar_t* brand, const std::string& mainInfo, int number, float price)
    : Car(brand, number, price), mainInfo_(mainInfo) {
}

// ���������� ��� ACar
ACar::~ACar() {}

// ����� ������ ���������� � ������ � ��������������� ������� ��� ������ A
void ACar::Print() const {
    wcout << L"������ ������ A:" << endl;
    Car::Print(); // ����� ������ Print �������� ������
    wcout << L"������� ���������� � ������ �����:" << endl;
    wcout << std::wstring(mainInfo_.begin(), mainInfo_.end()) << endl;
}

// ����������� �� ��������� ��� CCar
CCar::CCar() : Car() {}

// ����������� ��� CCar
CCar::CCar(const wchar_t* brand, int number, float price)
    : Car(brand, number, price) {
}

// ���������� ��� CCar
CCar::~CCar() {}

// ����� ������ ���������� � ������ � ��������������� ������� ��� ������ C
void CCar::Print() const {
    wcout << L"������ ������ C:" << endl;
    Car::Print(); // ����� ������ Print �������� ������
}

int main() {
    int numberChoice;
    setlocale(LC_ALL, "Russian");
    // ������� ������ ������ � �������������� ������������ � �����������
    Car car1(L"����", 1994, 100.0); // ���������� �� L"����"
    wcout << L"���������� � ������ car1:" << endl;
    car1.Print();

    // ���������� ������� ��� ��������� ��������
    car1.SetBrand(L"������"); // ����������
    car1.SetNumber(2021);
    car1.SetPrice(15000.0);

    wcout << L"\n����������� ���������� � ������ car1:" << endl;
    car1.Print();

    // ������� ������������ ������ ������
    Car* car2 = new Car(L"����", 2000, 1000.0); // ���������� �� L"����"
    wcout << L"���������� � ������ car2:" << endl;
    car2->Print();
    delete car2;

    wcout << L"��������, ��� �� ������ ������� (������� �����):" << endl;
    wcout << L"1. ���������� ������ ������ A" << endl;
    wcout << L"2. ���������� ������ ������ C" << endl;
    wcout << L"3. ������ � ���������� ���������� � ������ ��� ������" << endl;

    cin >> numberChoice;

    if (numberChoice == 1) {
        // ������� ������ ������ ������ A
        ACar* carA = new ACar(L"���� 500",
            "��� ���������, ����� ��������� ���� � ���������� �������� (���� ������� �� 0,8 �� 1,4 �), � �������������, ����������������� ���� ��������������� ��������� ������� � ����������� ������������� ��������.",
            2007, 50000.00);
        wcout << L"���������� � ������ carA:" << endl;
        carA->Print();
        delete carA; // ����������� ������
    }
    else if (numberChoice == 2) {
        // ������� ������ ������ ������ C
        CCar* carC = new CCar(L"���� �����", 2003, 20000.5);
        wcout << L"���������� � ������ carC:" << endl;
        carC->Print();
        delete carC; // ����������� ������
    }
    else if (numberChoice == 3) {
        // ������� ������ ������ � �������������� ������������ �� ���������
        Car car3;
        wcout << L"\n������� ���������� � ������ car3:" << endl;
        car3.Input(); // ���� ���������� � ������
        wcout << L"\n���������� � ������ car3:" << endl;
        car3.Print(); // ����� ���������� � ������
    }
    else {
        wcout << L"������� ����������� �����" << endl;
    }

    // ��������� �������� ����� ����� ���������
    wcout << L"������� Enter, ����� �����...";
    cin.ignore(); // ���������� ������ ����� ������, ���� �� ������� � ������
    cin.get(); // ���� ����� ������������

    return 0;
}