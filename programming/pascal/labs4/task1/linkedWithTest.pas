program LinkedListExample;

uses
  SysUtils;

// Определение типа узла списка
type
  PNode = ^TNode;
  TNode = record
    Data: Real;   // Данные, хранящиеся в узле (в данном случае вещественное число)
    Next: PNode;  // Указатель на следующий элемент списка
  end;

// Определение типа списка
  TList = record
    Head, Tail: PNode;  // Указатели на голову и хвост списка
  end;

// Процедура инициализации списка
procedure InitializeList(var List: TList);
begin
  List.Head := nil;  // Инициализируем голову списка как nil (пустой список)
  List.Tail := nil;  // Инициализируем хвост списка как nil
end;

// Процедура добавления элемента в конец списка
procedure AddToList(var List: TList; Value: Real);
var
  NewNode: PNode;  // Новый узел списка
begin
  New(NewNode);          // Выделяем память под новый узел
  NewNode^.Data := Value; // Записываем значение в узел
  NewNode^.Next := nil;   // Устанавливаем указатель на следующий элемент как nil

  // Если список пуст, устанавливаем новый узел как голову списка
  if List.Head = nil then
    List.Head := NewNode
  else
    List.Tail^.Next := NewNode; // Иначе добавляем новый узел после текущего хвоста

  List.Tail := NewNode; // Обновляем указатель хвоста списка на новый узел
end;

// Процедура печати элементов списка
procedure PrintList(const List: TList);
var
  Current: PNode; // Текущий узел списка для обхода
begin
  Current := List.Head; // Начинаем с головы списка

  // Пока не достигнем конца списка (Current = nil), печатаем данные узлов
  while Current <> nil do
  begin
    Write(Current^.Data:0:2, ' '); // Выводим данные текущего узла с округлением до 2 знаков после запятой
    Current := Current^.Next;      // Переходим к следующему узлу
  end;
  Writeln; // Переходим на новую строку после печати списка
end;

// Процедура для замены первого и последнего элементов списка
procedure SwapFirstAndLast(var List: TList);
var
  Current, Last, Temp: PNode; // Вспомогательные переменные для обмена элементами
begin
  // Если список пуст или содержит только один элемент, выходим из процедуры
  if (List.Head = nil) or (List.Head = List.Tail) then
    Exit;

  Last := List.Tail;     // Запоминаем указатель на последний элемент списка
  Current := List.Head;  // Указатель на первый элемент списка

  // Находим предпоследний элемент списка
  while Current^.Next <> Last do
    Current := Current^.Next;

  // Сохраняем ссылку на первый элемент
  Temp := List.Head;

  // Меняем местами первый и последний элементы
  List.Head := Last;         // Новая голова списка - последний элемент
  Last^.Next := Temp^.Next;  // Устанавливаем указатель последнего элемента на следующий элемент после первого
  Current^.Next := Temp;     // Устанавливаем указатель предпоследнего элемента на первый элемент
  Temp^.Next := nil;         // Устанавливаем указатель первого элемента на nil

  // Если в списке было всего два элемента, теперь хвост должен указывать на голову
  if Last^.Next = nil then
    List.Tail := Temp;
end;

// Процедура для удаления последнего элемента списка
procedure RemoveLastElement(var List: TList);
var
  Current, Prev: PNode; // Указатели для обхода списка и удаления элемента
begin
  // Если список пуст, выходим из процедуры
  if List.Head = nil then
    Exit;

  Current := List.Head; // Начинаем с головы списка
  Prev := nil;          // Предыдущий элемент

  // Находим последний элемент списка
  while Current^.Next <> nil do
  begin
    Prev := Current;
    Current := Current^.Next;
  end;

  // Удаляем последний элемент
  if Prev = nil then
    List.Head := nil // Если список содержал только один элемент, устанавливаем голову в nil
  else
  begin
    Prev^.Next := nil; // Устанавливаем указатель предыдущего элемента на nil
    List.Tail := Prev; // Обновляем указатель хвоста списка
  end;

  Dispose(Current); // Освобождаем память, занимаемую удаленным элементом
end;

var
  List: TList; // Переменная типа TList для хранения списка
begin
  InitializeList(List); // Инициализируем список

  // Добавляем элементы в список
  AddToList(List, 1.5);
  AddToList(List, 2.7);
  AddToList(List, 3.9);
  AddToList(List, 4.2);

  // Печатаем список до изменений
  Writeln('Исходный список:');
  PrintList(List);

  // Выполняем операции над списком
  SwapFirstAndLast(List); // Меняем местами первый и последний элементы
  Writeln('Список после замены первого и последнего элементов:');
  PrintList(List);

  RemoveLastElement(List); // Удаляем последний элемент
  Writeln('Список после удаления последнего элемента:');
  PrintList(List);
end.
