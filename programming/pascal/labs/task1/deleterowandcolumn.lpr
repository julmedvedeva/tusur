program DeleteRowAndColumn;

const
  SIZE = 6; // Размерность массивов

type
  IntArray6x6 = array [1..SIZE, 1..SIZE] of integer;
  IntArray5x5 = array [1..SIZE-1, 1..SIZE-1] of integer;

var
  A: IntArray6x6;
  B: IntArray5x5;
  n, k: 1..SIZE;
  i, j: integer;
  ii, jj: integer;

begin
  { Инициализация массива A }
  writeln('Введите элементы массива A (', SIZE, 'x', SIZE, ') в виде чисел (0 или 1):');
  for i := 1 to SIZE do
    for j := 1 to SIZE do
      readln(A[i, j]); // Чтение значения и переход на новую строку

  { Запрос номера строки и столбца для удаления }
  writeln('Введите номер строки для удаления (1..', SIZE, '):');
  readln(n);
  writeln('Введите номер столбца для удаления (1..', SIZE, '):');
  readln(k);

  { Инициализация индексов для массива B }
  ii := 0;
  for i := 1 to SIZE do
  begin
    if i <> n then
    begin
      inc(ii);
      jj := 0;
      for j := 1 to SIZE do
      begin
        if j <> k then
        begin
          inc(jj);
          B[ii, jj] := A[i, j];
        end;
      end;
    end;
  end;

  { Вывод массива B }
  writeln('Результирующий массив B (', SIZE-1, 'x', SIZE-1, ') в виде чисел (0 или 1):');
  for i := 1 to SIZE-1 do
  begin
    for j := 1 to SIZE-1 do
      write(B[i, j], ' '); // Вывод значения элемента массива B
    writeln;
  end;
end.

