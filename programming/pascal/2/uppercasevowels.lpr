program UppercaseVowelsTest;

{$mode objfpc}{$H+}

uses
  SysUtils, UppercaseVowelsProgram, TestUppercaseVowels;

begin
  // Запуск тестов
  WriteLn('Running tests...');
  RunTest('Hello World', '');
  RunTest('AEIOU', 'AEIOU');
  RunTest('Beautiful SUN', 'U');
  RunTest('Oolong Tea Oolong', 'O');
  RunTest('Gymnastics', '');
  RunTest('aAeEiIoOuU', 'AEIOU');
  RunTest('BCDFG', '');
  RunTest('', '');
  RunTest('1234567890!@#$%^&*()', '');

  WriteLn('Tests completed.');
  //ReadLn;  // Для удержания окна консоли открытым
end.

