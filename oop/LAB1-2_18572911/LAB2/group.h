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
	void Print() const; // метод константный, т.к. не изменяет объект
	int Size() const;
	void PutCar(int i, const Car& car);
	Car& GetCar(int i);
	float Price() const;
	float Price(int limit) const;
	Car& operator[](int i);
};
