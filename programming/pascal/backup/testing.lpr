program testing;

{$mode objfpc}{$H+}

uses
  SysUtils;

var
  inputString: string;
  len: integer;

begin
  // Запрашиваем у пользователя ввод строки
  writeln('Введите строку:');

  // Читаем строку с клавиатуры
  readln(inputString);

  // Определяем длину строки с учетом Unicode-символов
  len := Length(UTF8ToAnsi(inputString));
  // Выводим введенную строку
  writeln('Вы ввели: ', inputString);

  // Выводим длину введенной строки
  writeln('Длина введенной строки: ', len);
end.
