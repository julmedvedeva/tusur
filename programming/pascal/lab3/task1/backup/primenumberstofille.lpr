program TestPrimeNumbersToTextFile;

var
  f: Text;
  n: integer;
  fileName: string;

function IsPrime(x: integer): boolean;
var
  i: integer;
begin
  if x < 2 then
  begin
    IsPrime := False;
    Exit;
  end;

  IsPrime := True;
  for i := 2 to Trunc(Sqrt(x)) do
  begin
    if x mod i = 0 then
    begin
      IsPrime := False;
      Exit;
    end;
  end;
end;

procedure prim(var f: Text; n: integer);
var
  i: integer;
begin
  rewrite(f);  { открытие файла на запись }
  for i := 2 to n do
  begin
    if IsPrime(i) then
    begin
      writeln(f, i);  { запись простого числа в файл }
    end;
  end;
  close(f);  { закрытие файла }
end;

procedure PrintFile(var f: Text);
var
  x: integer;
begin
  reset(f);  { открытие файла на чтение }
  while not eof(f) do
  begin
    readln(f, x);
    writeln(x);  { вывод числа на экран }
  end;
  close(f);  { закрытие файла }
end;

