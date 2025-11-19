Public Sub РазъединениеЯчеек ()
  'Выбираем рабочий лист
  Worksheets(6).Select
  'Выделяем диапазон с объединенными ячейками
  Range(Cells(2, 1), Cells(2, 3)).Select
  'Обращаемся к диапазону
  With Selection
    'Разъединяем ячейки
    .UnMerge
    'Используем выравнивание xlCenter
    .HorizontalAlignment = xlCenter
    'Присваиваем диапазону значение
    .Value = "Ячейки разъединены"
    'Выводим на экран подтверждающее сообщение
    MsgBox "Разъединение закончено"
    'Очищаем содержимое ячеек диапазона
    .Clear
  End With
  Cells(1, 1).Select
  'Выводим на экран подтверждающее сообщение
  MsgBox "Действие закончено"
  AllClear
  ReturnToTableOfContents
End Sub
