program CardioideCoordinates;

uses
  Math, SysUtils;

const
  a = 100; // Значение параметра "a" (можно изменить по желанию)
  NumPoints = 1000; // Количество точек для отрисовки кардиоиды

procedure GenerateCardioidCoordinates(const FileName: string);
var
  OutputFile: TextFile;
  x, y, t: Double;
  i: Integer;
begin
  AssignFile(OutputFile, FileName);
  Rewrite(OutputFile);

  // Генерация координат кардиоиды для значений параметра t от 0 до 2π
  for i := 0 to NumPoints - 1 do
  begin
    // Параметрические уравнения кардиоиды
    t := 2 * Pi * i / NumPoints;
    x := a * cos(t) * (1 + cos(t));
    y := a * sin(t) * (1 + cos(t));

    // Запись координат в файл
    writeln(OutputFile, Format('%.6f, %.6f', [x, y]));
  end;

  CloseFile(OutputFile);
end;

begin
  GenerateCardioidCoordinates('cardioid_coordinates.csv');
end.

