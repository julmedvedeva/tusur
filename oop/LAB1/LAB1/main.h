// main.h
#pragma once
#pragma warning(disable : 4996)
#include <cstring>
#include <iostream>
#include <string>

class Car {
private:
    std::wstring brand_; // ���������� std::wstring ������ wchar_t*
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

class ACar : public Car {
private:
    std::string mainInfo_;

public:
    ACar(); // ����������� �� ���������
    ACar(const wchar_t* brand, const std::string& mainInfo, int number, float price);
    virtual ~ACar(); // ����������
    void Print() const override; // �������������� ����� Print
};

class CCar : public Car {
public:
    CCar(); // ����������� �� ���������
    CCar(const wchar_t* brand, int number, float price);
    virtual ~CCar(); // ����������
    void Print() const override; // �������������� ����� Print
};