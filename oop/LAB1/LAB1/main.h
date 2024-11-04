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
	// ����������� ������ �� ���������
	// (����� ��� �������� ������� ������ ��� ����������)
	Car();
	// ���������� ������������ ������ � ����������� (������� � �������)
	// ��� �������� ������� ������ � ����� ������������� 
	// ����� ��������� ��� ��������� ��� �������� ������ ��������
	Car(const char* brand_, int number_, float price_);
	// ���������� ������ ������ � ������������ ������������ ���
	virtual void Print();
	// ���������� ������ �����
	void Input();
	virtual ~Car(); // ����������

};


// ���������� ������ ACar, ������������ �� ������ Car
class ACar : public Car
{
private:
	std::string mainInfo_;
public:
    ACar(const char* brand_, const std::string& mainInfo_, int number_, float price_);
    void Print() override;  // �������������� ����� Print
};


// ���������� ������ CCar, ������������ �� ������ Car
class CCar : public Car {
public:
	CCar(const char* brand_, int number_, float price_);
	void Print() override;  // �������������� ����� Print
};

