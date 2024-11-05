#pragma once
#pragma warning(disable : 4996)
// ���������� ����������� ������ �� ��������
#include <cstring>
// ���������� ����������� ������ � ������ � �������
#include <iostream>
// ��������� ����� 
class Car
{
	// ��������� ��������� ����� ������ 
private:
    // ��������� �� ������ ��� �������� ������ ����������
    char* brand_;
    // ������������� ���������� ��� �������� ������ ����������
    int number_;
    // ���������� � ��������� ������ ��� �������� ���� ����������
    float price_;
	// ��������� ����� ������, ��������� �����
public:
    Car(); // ����������� �� ���������
    Car(const char* brand, int number, float price); // ����������� � �����������
    Car(const Car& other); // ���������� �����������
    Car& operator=(const Car& other); // �������� ������������
    ~Car(); // ����������
	void Print();
	// ���������� ������ �����
	void Input();
    // ����� ��� ���������� � ����� (��������� this->)
    operator double() const;
    friend double operator+(Car& c1, Car& c2);
};

