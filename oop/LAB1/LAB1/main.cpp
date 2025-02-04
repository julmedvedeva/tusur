#define NOMINMAX 
#include "main.h"
#include <Windows.h>
#include <cctype> // ��� ������� isalpha
#include <cstring>
#include <iostream>
#include <limits> // ��� numeric_limits
#include <stdlib.h>

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

int main() {
    int numberChoice;
    setlocale(LC_ALL, "Russian");

    // ����������� ��������� ������ � �������������� ������������ �� ���������
    Car car1; // ���������� ����������� �� ���������
    wcout << L"���������� � ������ car1 (�� ���������):" << endl;
    car1.Print();

    // ���������� ������� ��� ��������� ��������
    car1.SetBrand(L"������");
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
    wcout << L"1. ����������� ��������� ������ � ����������� �� ���������" << endl;
    wcout << L"2. ����������� ��������� ������ � ����������� �����������" << endl;
    wcout << L"3. ������������ ��������� ������ � ����������� �� ���������" << endl;
    wcout << L"4. ������������ ��������� ������ � ����������� �����������" << endl;

    cin >> numberChoice;

    if (numberChoice == 1) {
        // ����������� ��������� ������ � ����������� �� ���������
        Car car1; // ���������� ����������� �� ���������
        wcout << L"���������� � ������ car1 (�� ���������):" << endl;
        car1.Print();
    }
    else if (numberChoice == 2) {
        // ����������� ��������� ������ � ����������� �����������
        Car car2(L"������", 2021, 15000.0); // ���������� ����������� � �����������
        wcout << L"���������� � ������ car2 (� �����������):" << endl;
        car2.Print();
    }
    else if (numberChoice == 3) {
        // ������������ ��������� ������ � �������������� ������������ �� ���������
        Car* car3 = new Car(); // ������� ������ � �������������� ������������ �� ���������
        wcout << L"\n������� ���������� � ������ car3:" << endl;
        car3->Input(); // ���� ���������� � ������
        wcout << L"\n���������� � ������ car3:" << endl;
        car3->Print(); // ����� ���������� � ������
        delete car3; // ����������� ������
    }
    else if (numberChoice == 4) {
        // ������������ ��������� ������ � ����������� �����������
        Car* car4 = new Car(L"����", 2020, 20000.0); // ���������� ����������� � �����������
        wcout << L"���������� � ������ car4 (� �����������):" << endl;
        car4->Print();
        delete car4; // ����������� ������
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