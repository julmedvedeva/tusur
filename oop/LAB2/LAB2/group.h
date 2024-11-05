#pragma once
#include "car.h"

class Group
{
private: 
	int size;
	Car* cars;
public:
	Group(int size);
	~Group();
	void Print();
	int Size();	
	void PutCar(int i, const Car& car);
	Car& GetCar(int i);
	double Price();
	double Price(int limit);
	Car& operator[](int i);
};

