program MaxNonLatinSubstring;

var
  inputString: string;
  currentSubstring, maxSubstring: string;
  i: integer;

begin
  // Ввод строки
  writeln('Введите строку:');
  readln(inputString);

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
      if length(currentSubstring) > length(maxSubstring) then
        maxSubstring := currentSubstring;

      // Обнуляем текущую подстроку
      currentSubstring := '';
    end;
  end;

  // Проверяем последнюю подстроку после завершения цикла
  if length(currentSubstring) > length(maxSubstring) then
  begin
    maxSubstring := currentSubstring;
    writeln('В условии длины подстрок ', currentSubstring, maxSubstring);
    end;

  // Вывод результата
  writeln('Максимальная подстрока без латинских букв: ', maxSubstring);
  writeln('Длина максимальной подстроки: ', length(maxSubstring));
end.
