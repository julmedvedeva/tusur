#include <iostream>
#include <string>
#include <cstring>
#include "group.h"
#include "car.h"

using namespace std;

Group::Group(int size) : size(size) {
	cars = new Car[size];
}

Group::~Group()
{
	// ����������� ������ ��� ������� ����������
	delete[] cars; 
}

void Group::Print()
{
	for (int i = 0; i < size; i++)
	{
		cars[i].Print();
	}
}

int Group::Size()
{
	return size;
}

void Group::PutCar(int i, const Car& car)
{
	cars[i] = car;
}

Car& Group::GetCar(int i)
{
	return cars[i];
}

// ������� ���� ���� �����
double Group::Price() {
    if (size == 0) return 0.0; // �������� �� ������ ������

    double total = 0.0;
    for (int i = 0; i < size; ++i) {
        total += static_cast<double>(cars[i]); // ���������� �������� ����������
    }
    return total / size; // ���������� ������� ����
}

// ������� ���� ����� � ����� <= limit
double Group::Price(int limit) {
    if (size == 0) return 0.0; // �������� �� ������ ������

    double total = 0.0;
    int count = 0;

    for (int i = 0; i < size; ++i) {
        double price = static_cast<double>(cars[i]); // ���������� �������� ����������
        if (price <= limit) {
            total += price;
            ++count; // ����������� ������� �����, ���������� �� ��������
        }
    
    }

    return (count > 0) ? total / count : 0.0; // ���������� ������� ���� ��� 0, ���� ��� ���������� �����
}

Car& Group::operator[](int i) {
    return cars[i];
}