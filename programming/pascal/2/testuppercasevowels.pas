unit TestUppercaseVowels;

{$mode objfpc}{$H+}

interface

uses
  SysUtils, UppercaseVowelsProgram;

procedure RunTest(inputStr: string; expected: string);

implementation

procedure RunTest(inputStr: string; expected: string);
var
  result: string;
begin
  result := ExtractAndSortUppercaseVowels(inputStr);
  if result = expected then
  begin
    WriteLn('Test passed for input: ', inputStr);
    WriteLn(' Expected: ', expected);
    WriteLn(' Result: ', result);
  end
  else
  begin
    WriteLn('Test failed for input: ', inputStr);
    WriteLn(' Expected: ', expected);
    WriteLn( ' but got: ', result);
  end;
end;

end.

