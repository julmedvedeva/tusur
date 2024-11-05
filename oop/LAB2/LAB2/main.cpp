#include <iostream>
#include <string>
#include <cstring>
#include <random>
#include "car.h"
#include "group.h"
using namespace std;
int main() {
    
    // ��������� ��������� ��� Windows
    #ifdef _WIN32
        system("chcp 1251 > nul"); 
    #endif
    char brands[3][20] = { "����", "���", "�����" };
    Group group(3);
    int length =  group.Size();

    // ������� ��������� ��������� �����
    // �������� ��������� ����� �� ����������� ����������
    std::random_device rd;
    // �������������� ��������� ��������� ����� � �������������� rd() ��� ���������� ��������
    std::mt19937 gen(rd());
    // ���������� �������� ��������� ����� � ��������� ������
    // ���������� ��������� ����� �� 1.0 �� 100.0
    std::uniform_real_distribution<float> distrib(1.0, 100.0); 


    for(int i{0}; i< length && i < 3; i++)
    {
        Car car(brands[i], i + 1910, distrib(gen));
        group.PutCar(i, car);
    }

    group.Print();
    double price = group.GetCar(1);
    std::cout << "���� ����������: " << price << std::endl;
    Car car = group.GetCar(1);
    std::cout << "���������� ����� .GetCar: " << car << std::endl;
    Car car2 = group[1];
    std::cout << "���������� ����� group[1]: " << car2 << std::endl;

    double sum = group[0] + group[2];
    std::cout << "����� ���� ��� group[0] � group[2]: " << sum << std::endl;


    //// ��������� �������� ����� ����� ���������
    //cout << "������� Enter, ����� �����...";
    //cin.ignore(); // ���������� ������ ����� ������, ���� �� ������� � ������
    //cin.get(); // ���� ����� ������������

    return 0;


}

