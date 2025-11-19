Public Sub AllClear()
  'Обращаемся ко всем ячейкам листа (если надо было бы обратиться
  'к диапазону ячеек, следовало бы написать: Range("A1:F40"))
  With Cells
    'Очищаем содержимое ячеек
    .Clear
    'Восстанавливаем стандартную высоту строк
    .UseStandardHeight = True
    ' Восстанавливаем стандартную ширину столбцов
    .UseStandardWidth = True
    ' Восстанавливаем разъединенные строки
    .UnMerge
  End With
  'В цикле очищаем лист от всех объектов
  For Each i In ActiveSheet.Shapes
    i.Delete
  Next i
End Sub
