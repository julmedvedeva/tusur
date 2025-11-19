function sign(s: string): integer;
begin
  if Length(s) = 0 then
    sign := 0
  else
  begin
    // Проверяем первый символ строки s
    case s[1] of
      '.', ',', ';', ':': sign := 1 + sign(Copy(s, 2, Length(s)-1));
      else sign := sign(Copy(s, 2, Length(s)-1)); // Рекурсивный вызов для остальной части строки
    end;
  end;
end;

var
  str: string;
  count: integer;
begin
  // Ввод строки с консоли или из другого источника
  Write('Введите строку: ');
  Readln(str);

  // Вызываем функцию sign для подсчета знаков препинания
  count := sign(str);

  // Выводим результат
  WriteLn('Количество знаков препинания в строке: ', count);
end.
