Public Sub СоединениеЯчеек ()
  'Выбираем первый рабочий лист
  Worksheets(6).Select
  'Определяем диапазон
  Range(Cells(2, 1), Cells(2, 3)).Select
  'Обращаемся к диапазону
  With Selection
    'Задаем ширину столбца «В»
    .ColumnWidth = 20
    'Соединяем ячейки
    .Merge
    'Используем выравнивание xlCenter
    .HorizontalAlignment = xlCenter
    'Присваиваем диапазону значение
    .Value = "Ячейки объединены"
    'Выводим на экран подтверждающее сообщение
    MsgBox "Объединено три ячейки столбца В"
  End With
  'Выводим на экран подтверждающее сообщение
  MsgBox "Действие закончено"
  ReturnToTableOfContents
End Sub
