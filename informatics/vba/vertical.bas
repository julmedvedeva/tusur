Public Sub УстановитьВертикальноеВыравнивание ()
  'Выбираем рабочий лист
  Worksheets(6).Select
  'Обращаемся к столбцу B
  With Cells(1, 2)
    'Ширина столбца
    .ColumnWidth = 20
    'Высота строк в диапазоне
    .RowHeight = 50
    'Присваиваем диапазону значение
    .Value = "Кашу маслом не испортишь"
    'Используем выравнивание xlCenter
    .VerticalAlignment = xlCenter
    'Выводим на экран подтверждающее сообщение
    MsgBox "Используется выравнивание xlCenter"
    'Используем выравнивание xlBottom
    .VerticalAlignment = xlBottom
    'Выводим на экран подтверждающее сообщение
    MsgBox "Используется выравнивание xlBottom"
    'Используем выравнивание xlTop
    .VerticalAlignment = xlTop
    'Выводим на экран подтверждающее сообщение
    MsgBox "Используется выравнивание xlTop"
    'Используем выравнивание xlJustify
    .VerticalAlignment = xlJustify
    'Выводим на экран подтверждающее сообщение
    MsgBox "Используется выравнивание xlJustify"
  End With
  'Выводим на экран подтверждающее сообщение
  MsgBox "Действие закончено"
  'Вызываем функцию очистки листа
  AllClear
  ReturnToTableOfContents
End Sub
