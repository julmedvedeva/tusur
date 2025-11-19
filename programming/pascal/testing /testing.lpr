program testing;

{$mode objfpc}{$H+}

uses
  SysUtils;

var
  inputString: string;
  currentSubstring, maxSubstring: string;
  i: integer;

begin
  // Ввод строки
  writeln('Введите строку:');
  readln(inputString);
  writeln('Length: ', Length(inputString), inputString);

  // Инициализация переменных
  currentSubstring := '';
  maxSubstring := '';

  // Цикл обработки строки
  for i := 1 to length(inputString) do

  begin
    // Если текущий символ не является латинской буквой, добавляем его к текущей подстроке
    if not (inputString[i] in ['A'..'Z', 'a'..'z']) then
    begin
      currentSubstring := currentSubstring + inputString[i];
    end
    else
    begin
      // Если текущая подстрока длиннее максимальной, обновляем максимальную подстроку
      if Length(currentSubstring) > Length(maxSubstring) then
        maxSubstring := currentSubstring;

      // Обнуляем текущую подстроку
      currentSubstring := '';
    end;
  end;

  // Проверка последней подстроки после завершения цикла
  if Length(currentSubstring) > Length(maxSubstring) then
    maxSubstring := currentSubstring;

  // Вывод результата
  writeln('Максимальная подстрока без латинских букв: ', maxSubstring);
  writeln('Длина максимальной подстроки: ', Length(UTF8ToAnsi(maxSubstring)));

end.

