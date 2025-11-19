program Firstp;
var
  s: string;
  i, k, m: integer;

begin
  k := 0;
  m := 0;
  writeln('Введите строку:');
  readln(s);
  if length(s) > 0
    then
      begin
        s := s + 'a';
        for i := 1 to length(s) do
          if s[i] in ['a'..'z', 'A'..'Z']
            then
              begin
                if m < k then m := k;
                k := 0
              end
            else inc(k);
        if m > 0
          then writeln('Макс. длина подстроки: ', m)
          else writeln('Вся строка состоит из латинских букв')
      end
    else writeln('Пустая строка!')
end.
