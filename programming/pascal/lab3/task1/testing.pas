procedure TestIsPrime;
begin
  writeln('Running IsPrime tests...');
  assert(IsPrime(0) = False);
  assert(IsPrime(1) = False);
  assert(IsPrime(2) = True);
  assert(IsPrime(3) = True);
  assert(IsPrime(4) = False);
  assert(IsPrime(5) = True);
  assert(IsPrime(6) = False);
  assert(IsPrime(7) = True);
  assert(IsPrime(8) = False);
  assert(IsPrime(9) = False);
  assert(IsPrime(10) = False);
  assert(IsPrime(11) = True);
  writeln('All IsPrime tests passed.');
end;

procedure TestCase1;
var
  f: Text;
  fileName: string;
begin
  fileName := 'test1.txt';
  assign(f, fileName);
  prim(f, 10);
  writeln('Содержимое файла для n = 10:');
  PrintFile(f);
end;

procedure TestCase2;
var
  f: Text;
  fileName: string;
begin
  fileName := 'test2.txt';
  assign(f, fileName);
  prim(f, 20);
  writeln('Содержимое файла для n = 20:');
  PrintFile(f);
end;

procedure TestCase3;
var
  f: Text;
  fileName: string;
begin
  fileName := 'test3.txt';
  assign(f, fileName);
  prim(f, 1);
  writeln('Содержимое файла для n = 1:');
  PrintFile(f);
end;

procedure RunTests;
begin
  TestIsPrime;
  TestCase1;
  TestCase2;
  TestCase3;
  writeln('All prim and PrintFile tests completed.');
end;
