Public Sub НастроитьРазмерТекста ()
  'Выбираем первый рабочий лист
  Worksheets(6).Select
  'Настраиваем размер шрифта
  Worksheets(6).Cells(1, 2).Font.Size = 12
  'Обращаемся к столбцу B
  With Cells(1, 2)
    'Устанавливаем ширину столбца
    .ColumnWidth = 20
    'Автоматически настраиваем размер шрифта текста под размер
    ячейки
    .ShrinkToFit = True
    'Присваиваем диапазону значение
    .Value = "aaaaaaaaaaaaaaaaaaaa"
    MsgBox "Сообщение из 20 букв"
    'Присваиваем диапазону значение
    .Value = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    MsgBox "Сообщение из 30 букв"
    'Присваиваем диапазону значение
    .Value = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    MsgBox "Сообщение из 40 букв"
    'Присваиваем диапазону значение
    .Value = "aaaaaaaaaa"
    MsgBox "Сообщение из 10 букв"
    'Выводим на экран подтверждающее сообщение
    MsgBox "Вывод текста окончен"
  End With
  'Выводим на экран подтверждающее сообщение
  MsgBox "Действие закончено"
  'Вызываем функцию очистки листа
  AllClear
End Sub
