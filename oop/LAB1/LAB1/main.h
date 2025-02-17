#pragma once
#pragma warning(disable : 4996)
#include <cstring>
#include <iostream>
#include <string>

class Car {
private:
    std::wstring brand_; // ���������� std::wstring
    int number_;
    float price_;

public:
    Car(); // ����������� �� ���������
    Car(const wchar_t* brand, int number, float price); // ����������� � �����������
    virtual ~Car(); // ����������

    virtual void Print() const; // ����� ������ ����������
    void Input(); // ����� ����� ����������

    // ������ ������� (������� � �������)
    const wchar_t* GetBrand() const { return brand_.c_str(); }
    int GetNumber() const { return number_; }
    float GetPrice() const { return price_; }
    void SetBrand(const wchar_t* brand);
    void SetNumber(int number);
    void SetPrice(float price);
};

class AdditionalCar : public Car {
private:
    const wchar_t* mainInfo_;

public:
    AdditionalCar(); // ����������� �� ���������
    AdditionalCar(const wchar_t* brand, const wchar_t* mainInfo, int number, float price);
    virtual ~AdditionalCar(); // ����������
    void Print() const override; // �������������� ����� Print
};

