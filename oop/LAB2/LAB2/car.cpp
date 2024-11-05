    #include <iostream>
    #include <string>
    #include <cstring>
    #include "car.h"

    using namespace std;
    // ���������� �����������
    Car::Car(const Car& other)
        : number_(other.number_), price_(other.price_) {
        brand_ = new char[strlen(other.brand_) + 1]; // �������� ������ ��� ������
        strcpy(brand_, other.brand_); // �������� �����
    }

    // ����������� �� ���������
    Car::Car() : number_(0), price_(0) {
        brand_ = new char[8]; // �������� ������ ��� ������
        strcpy(brand_, "unknown"); // �������� ������ �� ���������
    }

    // ����������� � �����������
    Car::Car(const char* brand, int number, float price)
        : number_(number), price_(price) {
        brand_ = new char[strlen(brand) + 1]; // �������� ������ ��� ������
        strcpy(brand_, brand); // �������� ���������� ������
    }

    // �������� ���������� ���� � double
    Car::operator double() const {
        return this->price_;
    }

    // �������� ������������
    Car& Car::operator=(const Car& other) {
        if (this != &other) { // �������� �� ����������������
            delete[] brand_; // ����������� ������ ������
            number_ = other.number_; // �������� �����
            price_ = other.price_; // �������� ����
            brand_ = new char[strlen(other.brand_) + 1]; // �������� ����� ������ ��� ������
            strcpy(brand_, other.brand_); // �������� �����
        }
        return *this; // ���������� ������� ������
    }

    // ����������
    Car::~Car() {
        delete[] brand_; // ����������� ������
    }

    // ����� ������ ���������� � ������
    void Car::Print() { // �������� const
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
        cout << "������� ����� ������: ";
        cin >> brand_;
        cout << "������� ����� ������: ";
        cin >> number_;
        cout << "������� ���� ������: ";
        cin >> price_;
    }

    // ����������� ��������� ���������
    double operator + (Car& c1, Car& c2) {
        return (c1.price_ + c2.price_);
    }
