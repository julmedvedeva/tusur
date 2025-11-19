Public Sub Reset()
  'Выбираем первый рабочий лист
  Worksheets(1).Select
  With Application
    'Показать строку состояния
    .DisplayStatusBar = True
    'Показать строку формул
    .DisplayFormulaBar = True
  End With
  With ActiveWindow
    'Показать заголовки строк и столбцов
    .DisplayHeadings = True
    'Показать горизонтальную полосу прокрутки
    .DisplayHorizontalScrollBar = True
    'Показать вертикальную полосу прокрутки
    .DisplayVerticalScrollBar = True
    'Показать ярлычки рабочих листов
    .DisplayWorkbookTabs = True
  End With
End Sub
