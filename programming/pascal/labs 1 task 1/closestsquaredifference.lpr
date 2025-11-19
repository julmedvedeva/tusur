program closestsquaredifference;

{$mode objfpc}{$H+}

uses
  {$IFDEF UNIX}
  cthreads,
  {$ENDIF}
  Classes, SysUtils;

var
  n, i, closestIndex1, closestIndex2: integer; // n - количество чисел, i - счетчик цикла, closestIndex1 и closestIndex2 - индексы чисел, ближайших к квадрату целого числа
  closestValue, diff, currentNumber: real; // closestValue - текущее минимальное значение разности, diff - разность для текущего числа, currentNumber - число, вводимое пользователем

// Функция f вычисляет минимальную абсолютную разность между числом k и ближайшим к нему квадратом целого числа
function f(k: real): real;
var
  lowerSquare, upperSquare, root: real; // lowerSquare - квадрат целого числа, меньшего корня из k, upperSquare - квадрат целого числа, большего корня из k, root - корень из k
begin
  root := sqrt(k); // Вычисляем корень квадратный числа k
  lowerSquare := trunc(root) * trunc(root); // Квадрат наибольшего целого числа, которое не превосходит корень квадратный из k
  upperSquare := (trunc(root) + 1) * (trunc(root) + 1); // Квадрат наименьшего целого числа, которое превосходит корень квадратный из k
  // Возвращаем минимальную абсолютную разность между k и ближайшим к нему квадратом целого числа
  if abs(k - lowerSquare) < abs(k - upperSquare) then
    f := abs(k - lowerSquare)
  else
    f := abs(k - upperSquare);
end;

begin
  writeln('Input the number of elements:'); // Просим пользователя ввести количество чисел
  readln(n); // Читаем количество чисел

  if n <= 0 then // Проверяем, что количество чисел положительное
  begin
    writeln('Number of elements must be positive.'); // Выводим сообщение об ошибке, если n <= 0
    exit; // Завершаем выполнение программы
  end;

  closestIndex1 := 1; // Инициализируем первый индекс ближайшего числа как 1
  closestIndex2 := -1; // Инициализируем второй индекс ближайшего числа как -1 (неопределенный)

  writeln('Input number 1:'); // Просим пользователя ввести первое число
  readln(currentNumber); // Читаем первое число
  closestValue := f(currentNumber); // Вычисляем минимальную разность для первого числа

  for i := 2 to n do // Цикл для ввода и обработки оставшихся чисел
  begin
    writeln('Input number ', i, ':'); // Просим пользователя ввести следующее число
    readln(currentNumber); // Читаем следующее число
    diff := f(currentNumber); // Вычисляем минимальную разность для текущего числа
    if diff < closestValue then // Проверяем, если текущая разность меньше сохраненного минимального значения
    begin
      closestIndex2 := closestIndex1; // Переносим предыдущий ближайший индекс во второй
      closestIndex1 := i; // Обновляем первый индекс ближайшего числа
      closestValue := diff; // Обновляем минимальное значение разности
    end
    else if diff = closestValue then // Проверяем, если текущая разность равна минимальной
    begin
      closestIndex2 := i; // Присваиваем второй индекс
    end;
  end;

  if closestIndex2 <> -1 then // Если второй индекс определен
    writeln('The indices of the numbers closest to a square are: ', closestIndex1, ' and ', closestIndex2)
  else
    writeln('The index of the number closest to a square is: ', closestIndex1); // Выводим индекс числа, ближайшего к квадрату целого числа
end.

