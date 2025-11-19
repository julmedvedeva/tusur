unit UppercaseVowels;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, unit1;

function ExtractAndSortUppercaseVowels(inputStr: string): string;

implementation

function SortString(s: string): string;
var
  i, j: Integer;
  temp: char;
begin
  for i := 1 to Length(s) - 1 do
    for j := i + 1 to Length(s) do
      if s[i] > s[j] then
      begin
        temp := s[i];
        s[i] := s[j];
        s[j] := temp;
      end;
  SortString := s;
end;

function ExtractAndSortUppercaseVowels(inputStr: string): string;
var
  vowelsSet: set of char;
  resultStr: string;
  i: Integer;
begin
  vowelsSet := ['A', 'E', 'I', 'O', 'U'];
  resultStr := '';
  for i := 1 to Length(inputStr) do
  begin
    if (inputStr[i] in vowelsSet) and (Pos(inputStr[i], resultStr) = 0) then
      resultStr := resultStr + inputStr[i];
  end;
  ExtractAndSortUppercaseVowels := SortString(resultStr);
end;

end.

