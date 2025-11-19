program ClosestSquare;

var
  n, i, closestIndex: integer; // n - количество чисел, i - счетчик цикла, closestIndex - индекс числа, ближайшего к квадрату целого числа
  x, closestValue, diff, currentNumber: real; // x - текущее число, closestValue - текущее минимальное значение разности, diff - разность для текущего числа, currentNumber - число, вводимое пользователем

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

  closestIndex := 1; // Инициализируем индекс ближайшего числа как 1
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
      closestValue := diff; // Обновляем минимальное значение разности
      closestIndex := i; // Обновляем индекс ближайшего числа
    end;
  end;

  writeln('The index of the number closest to a square is: ', closestIndex); // Выводим индекс числа, ближайшего к квадрату целого числа
end.

