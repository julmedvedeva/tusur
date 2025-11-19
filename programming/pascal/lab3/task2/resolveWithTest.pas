program CountPunctuation;

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

procedure TestSignFunction(inputStr: string; expectedCount: integer);
var
  actualCount: integer;
begin
  actualCount := sign(inputStr);
  WriteLn('Строка: "', inputStr, '"');
  WriteLn('Ожидаемое количество знаков препинания: ', expectedCount);
  WriteLn('Фактическое количество знаков препинания: ', actualCount);
  if actualCount = expectedCount then
    WriteLn('Тест пройден.')
  else
    WriteLn('Тест не пройден.');
  WriteLn('--------------------------------------------');
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

  // Тестовые случаи
  WriteLn('Тестовые случаи:');
  WriteLn('--------------------------------------------');
  TestSignFunction('', 0); // Тестовый случай 1: Пустая строка
  TestSignFunction('. , ; : .,', 6); // Тестовый случай 2: Все знаки препинания
  TestSignFunction('Это тестовая строка', 0); // Тестовый случай 3: Строка без знаков препинания
  TestSignFunction(',,.,;::;;', 8); // Тестовый случай 4: Строка с повторяющимися знаками препинания
  TestSignFunction('Привет, мир! Как дела?', 5); // Тестовый случай 5: Строка с буквами и знаками препинания
  TestSignFunction(':Привет, мир! Как дела?;', 5); // Тестовый случай 6: Строка с знаками препинания в начале и конце

end.
