program CardioidePNG;

uses
  Math, Classes, SysUtils;

const
  a = 100; // Значение параметра "a" (можно изменить по желанию)

procedure DrawCardioidPNG;
var
  Image: TFPMemoryImage;
  x, y, t: Double;
  i: Integer;
begin
  Image := TFPMemoryImage.Create(800, 600);
  try
    Image.SetSize(800, 600);
    Image.Fill(0); // Заливка изображения черным цветом

    // Рисование кардиоиды для значений параметра t от 0 до 2π
    for i := 0 to 628 do  // 628 = 2π в радианах, умноженное на 100 для более плавного рисунка
    begin
      // Параметрические уравнения кардиоиды
      t := i / 100;
      x := a * cos(t) * (1 + cos(t));
      y := a * sin(t) * (1 + cos(t));

      // Отрисовка точки (x, y)
      Image.Canvas.Pixels[Round(x) + 400, Round(y) + 300] := colWhite; // Перенос в центр изображения и рисование точки
    end;

    // Сохранение изображения в файл
    Image.SaveToFile('cardioid.png');
  finally
    Image.Free;
  end;
end;

begin
  DrawCardioidPNG;
end.

