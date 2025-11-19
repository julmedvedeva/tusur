Public Sub УстановитьГоризонтальноеВыравнивание()
  'Выбираем рабочий лист
  Worksheets(6).Select
  'Вызываем процедуру очистки листа
  AllClear
  'Обращаемся к ячейке B1
  With Cells(1, 2)
    'Задаем выделенному диапазону значение
    .Value = "Кашу маслом не испортишь"
    'Используем выравнивание xlGeneral
    .HorizontalAlignment = xlGeneral
    MsgBox "Используется выравнивание xlGeneral"
    'Устанавливаем ширину столбца
    .ColumnWidth = 50
    MsgBox "Установлена ширина столбца=50"
    'Используем выравнивание xlCenter
    .HorizontalAlignment = xlCenter
    MsgBox "Используется выравнивание xlCenter"
    'Используем выравнивание xlRight
    .HorizontalAlignment = xlRight
    MsgBox "Используется выравнивание xlRight"
    'Используем выравнивание xlLeft
    .HorizontalAlignment = xlLeft
    MsgBox "Используется выравнивание xlLeft"
    'Устанавливаем стандартную ширину столбца
    .UseStandardWidth = True
    'Используем выравнивание xlJustify
    .HorizontalAlignment = xlJustify
    MsgBox "Используется выравнивание xlJustify"
    'Используем выравнивание xlCenterAcrossSelection
    Cells(1, 2).HorizontalAlignment = xlCenterAcrossSelection
    MsgBox "Используется выравнивание xlCenterAcrossSelection"
    'Устанавливаем ширину столбца
    .ColumnWidth = 100
    MsgBox "Установлена ширина столбца=100"
    'Используем выравнивание xlFill
    .HorizontalAlignment = xlFill
    MsgBox "Выравнивание xlFill"
  End With
  MsgBox "Действие закончено"
  'Вызываем процедуру очистки листа
  AllClear
  ReturnToTableOfContents
End Sub
