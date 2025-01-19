#pragma once
#pragma warning(disable : 4996)
#include <cstring>
#include <iostream>
#include <string>

class Car {
private:
    char* brand_;
    int number_;
    float price_;

public:
    Car(); // ����������� �� ���������
    Car(const char* brand, int number, float price); // ����������� � �����������
    virtual ~Car(); // ����������

    virtual void Print() const; // ����� ������ ����������
    void Input(); // ����� ����� ����������

    // ������ ������� (������� � �������)
    const char* GetBrand() const { return brand_; }
    int GetNumber() const { return number_; }
    float GetPrice() const { return price_; }
    void SetBrand(const char* brand);
    void SetNumber(int number);
    void SetPrice(float price);
};

class ACar : public Car {
private:
    std::string mainInfo_;

public:
    ACar(); // ����������� �� ���������
    ACar(const char* brand, const std::string& mainInfo, int number, float price);
    virtual ~ACar(); // ����������
    void Print() const override; // �������������� ����� Print
};

class CCar : public Car {
public:
    CCar(); // ����������� �� ���������
    CCar(const char* brand, int number, float price);
    virtual ~CCar(); // ����������
    void Print() const override; // �������������� ����� Print
};