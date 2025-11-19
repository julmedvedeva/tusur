Sub Шаблоны_таблицы_диаграммы()
' Шаблоны_таблицы_диаграммы Макрос
' Создание таблицы по шаблону

' Создание первого столбца
' Объединение первых двух ячеек
    Range("A1:A2").MergeCells = True
' Присваивание значения ячейкам
    Range("A1:A2").Value = "Статьи дохода"
    Range("A3").Value = "Налоговые доходы"
    Range("A4").Value = "Налоги на прибыль (доход), прирост капитала"
    Range("A5").Value = "Налоги на товары и услуги, лицензионные сборы"
    Range("A6").Value = "Налоги на совокупный доход"
    Range("A7").Value = "Налоги на имущество"
    Range("A8").Value = "Платежи за пользование природными ресурсами"
    Range("A9").Value = "Прочие налоги, пошлины и сборы"
    Range("A10").Value = "Неналоговые доходы"
    Range("A11").Value = "Доходы от имущества, находящегося в госсобственности"
    Range("A12").Value = "Административные платежи и сборы"
    Range("A13").Value = "Штрафные санкции"
    Range("A14").Value = "Итого доходов"
    Range("B1:C1").MergeCells = True
    Range("B1:C1").Value = "Доход в 2012 г. (отчет)"
    Range("B2").Value = "Сумма, тыс. руб"
    Range("C2").Value = "Удельный вес, %"
    ' Соединяем две ячейки для красоты
    Range("D1:E1").MergeCells = True
    Range("D1:E1").Value = "Доход в 2013 г. (план)"
    Range("D2").Value = "Сумма, тыс. руб"
    Range("E2").Value = "Удельный вес, %"

    Range("F1:G1").MergeCells = True
    Range("F1:G1").Value = "Превышение доходов"
    Range("F2").Value = "Сумма, тыс. руб"
    Range("G2").Value = "В % к 2012 г."

    ' Автоподбор ширины для колонок в таблице
    Columns("A:G").AutoFit

    ' Разблокируем все ячейки на листе
    Cells.Locked = False

    ' Блокируем ячейки, где подсчет идет с помощью макроса Worksheet_Change
    Range("B3").Locked = True
    Range("B10").Locked = True
    Range("B14").Locked = True
    Range("C3:C14").Locked = True
    Range("D3").Locked = True
    Range("D10").Locked = True
    Range("D14").Locked = True
    Range("E3:E14").Locked = True
    Range("F3:G14").Locked = True


    ' Включаем защиту листа
    ActiveSheet.Protect Password:="mypassword", UserInterfaceOnly:=True
    ЗадатьЦветЯчейки


End Sub

Private Sub Worksheet_Change(ByVal Target As Range)
    ' Если изменение произошло в интересующих диапазонах, пересчитываем суммы
    If Not Intersect(Target, Range("B4:B9,B11:B13,D4:D9,D11:D13")) Is Nothing Then
        Call Пересчитать_Суммы
        Call СоздатьГрафик
    End If
End Sub

Sub ЗадатьЦветЯчейки()
    ' Установить цвет заблокированных ячеек в синий
    Range("B3").Interior.Color = RGB(225, 127, 14)
    Range("B10").Interior.Color = RGB(225, 127, 14)
    Range("B14").Interior.Color = RGB(225, 127, 14)
    Range("C3:C14").Interior.Color = RGB(225, 127, 14)
    Range("D3").Interior.Color = RGB(225, 127, 14)
    Range("D10").Interior.Color = RGB(225, 127, 14)
    Range("D14").Interior.Color = RGB(225, 127, 14)
    Range("E3:E14").Interior.Color = RGB(225, 127, 14)
    Range("F3:G14").Interior.Color = RGB(225, 127, 14)
End Sub

Sub Пересчитать_Суммы()
    ' Пересчет сумм после создания таблицы
    Range("B3").Value = WorksheetFunction.Sum(Range("B4:B9"))
    Range("B10").Value = WorksheetFunction.Sum(Range("B11:B13"))
    Range("B14").Value = WorksheetFunction.Sum(Range("B3"), Range("B10"))
    Range("D3").Value = WorksheetFunction.Sum(Range("D4:D9"))
    Range("D10").Value = WorksheetFunction.Sum(Range("D11:D13"))
    Range("D14").Value = WorksheetFunction.Sum(Range("D3"), Range("D10"))


    ' Пересчет удельного веса в C3
    If Range("B14").Value > 0 Then
        ' Расчет удельного для каждой позиции
        Range("C3").Value = (100 * Range("B3").Value) / Range("B14").Value
        Range("C4").Value = (100 * Range("B4").Value) / Range("B14").Value
        Range("C5").Value = (100 * Range("B5").Value) / Range("B14").Value
        Range("C6").Value = (100 * Range("B6").Value) / Range("B14").Value
        Range("C7").Value = (100 * Range("B7").Value) / Range("B14").Value
        Range("C8").Value = (100 * Range("B8").Value) / Range("B14").Value
        Range("C9").Value = (100 * Range("B9").Value) / Range("B14").Value
        Range("C10").Value = (100 * Range("B10").Value) / Range("B14").Value
        Range("C11").Value = (100 * Range("B11").Value) / Range("B14").Value
        Range("C12").Value = (100 * Range("B12").Value) / Range("B14").Value
        Range("C13").Value = (100 * Range("B13").Value) / Range("B14").Value
        Range("C14").Value = (100 * Range("B14").Value) / Range("B14").Value
    Else
        MsgBox "Ошибка: Деление на ноль!"
        ' Присваивание 0 в случае ошибки деления
        Range("C3").Value = 0
        Range("C4").Value = 0
        Range("C5").Value = 0
        Range("C6").Value = 0
        Range("C7").Value = 0
        Range("C8").Value = 0
        Range("C9").Value = 0
        Range("C10").Value = 0
        Range("C11").Value = 0
        Range("C12").Value = 0
        Range("C13").Value = 0
        Range("C14").Value = 0
    End If
        ' Пересчет удельного веса в E3
    If Range("D14").Value > 0 Then
          ' Расчет удельного для каждой позиции
        Range("E3").Value = (100 * Range("D3").Value) / Range("D14").Value
        Range("E4").Value = (100 * Range("D4").Value) / Range("D14").Value
        Range("E5").Value = (100 * Range("D5").Value) / Range("D14").Value
        Range("E6").Value = (100 * Range("D6").Value) / Range("D14").Value
        Range("E7").Value = (100 * Range("D7").Value) / Range("D14").Value
        Range("E8").Value = (100 * Range("D8").Value) / Range("D14").Value
        Range("E9").Value = (100 * Range("D9").Value) / Range("D14").Value
        Range("E10").Value = (100 * Range("D10").Value) / Range("D14").Value
        Range("E11").Value = (100 * Range("D11").Value) / Range("D14").Value
        Range("E12").Value = (100 * Range("D12").Value) / Range("D14").Value
        Range("E13").Value = (100 * Range("D13").Value) / Range("D14").Value
        Range("E14").Value = (100 * Range("D14").Value) / Range("D14").Value
    Else
        MsgBox "Ошибка: Деление на ноль!"
          ' Присваивание 0 в случае ошибки деления
        Range("E3").Value = 0
        Range("E4").Value = 0
        Range("E5").Value = 0
        Range("E6").Value = 0
        Range("E7").Value = 0
        Range("E8").Value = 0
        Range("E9").Value = 0
        Range("E10").Value = 0
        Range("E11").Value = 0
        Range("E12").Value = 0
        Range("E13").Value = 0
        Range("E14").Value = 0
    End If

    ' Расчет превышения доходов в виде суммы и процента
    If Range("C14").Value > 0 And Range("E14").Value > 0 Then
    Range("F3").Value = Range("D3").Value - Range("B3").Value
    Range("F4").Value = Range("D4").Value - Range("B4").Value
    Range("F5").Value = Range("D5").Value - Range("B5").Value
    Range("F6").Value = Range("D6").Value - Range("B6").Value
    Range("F7").Value = Range("D7").Value - Range("B7").Value
    Range("F8").Value = Range("D8").Value - Range("B8").Value
    Range("F9").Value = Range("D9").Value - Range("B9").Value
    Range("F10").Value = Range("D10").Value - Range("B10").Value
    Range("F11").Value = Range("D11").Value - Range("B11").Value
    Range("F12").Value = Range("D12").Value - Range("B12").Value
    Range("F13").Value = Range("D13").Value - Range("B13").Value
    Range("F14").Value = Range("D14").Value - Range("B14").Value

    ' Расчет процентов
    Range("G3").Value = (100 * Range("F3").Value) / Range("F14").Value
    Range("G4").Value = (100 * Range("F4").Value) / Range("F14").Value
    Range("G5").Value = (100 * Range("F5").Value) / Range("F14").Value
    Range("G6").Value = (100 * Range("F6").Value) / Range("F14").Value
    Range("G7").Value = (100 * Range("F7").Value) / Range("F14").Value
    Range("G8").Value = (100 * Range("F8").Value) / Range("F14").Value
    Range("G9").Value = (100 * Range("F9").Value) / Range("F14").Value
    Range("G10").Value = (100 * Range("F10").Value) / Range("F14").Value
    Range("G11").Value = (100 * Range("F11").Value) / Range("F14").Value
    Range("G12").Value = (100 * Range("F12").Value) / Range("F14").Value
    Range("G13").Value = (100 * Range("F13").Value) / Range("F14").Value
    Range("G14").Value = (100 * Range("F14").Value) / Range("F14").Value


    Else
      MsgBox "Ошибка: Деление на ноль!"
      Range("F3").Value = 0
      Range("F4").Value = 0
      Range("F5").Value = 0
      Range("F6").Value = 0
      Range("F7").Value = 0
      Range("F8").Value = 0
      Range("F9").Value = 0
      Range("F10").Value = 0
      Range("F11").Value = 0
      Range("F12").Value = 0
      Range("F13").Value = 0
      Range("F14").Value = 0

      ' Расчет процентов
      Range("G3").Value = 0
      Range("G4").Value = 0
      Range("G5").Value = 0
      Range("G6").Value = 0
      Range("G7").Value = 0
      Range("G8").Value = 0
      Range("G9").Value = 0
      Range("G10").Value = 0
      Range("G11").Value = 0
      Range("G12").Value = 0
      Range("G13").Value = 0
      Range("G14").Value = 0

    End If
End Sub

Sub СоздатьГрафик()
    ' Снимаем защиту с листа
    ActiveSheet.Unprotect Password:="mypassword"

    Dim chartObj As ChartObject
    Dim ws As Worksheet

    ' Обработка ошибок
    On Error GoTo ErrorHandler

    ' Указываем точное имя листа
    Set ws = ThisWorkbook.Sheets("4.2 Шаблоны таблицы и диаграммы")

    ' Указываем диапазон данных для графика
    Dim chartRange As Range
    ' Диапазон данных для анализа
    Set chartRange = ws.Range("B3:B14, D3:D14, F3:F14")

    ' Создаем объект графика
    Set chartObj = ws.ChartObjects.Add(Left:=100, Width:=500, Top:=300, Height:=300)

    ' Настраиваем график
    With chartObj.Chart
        .SetSourceData Source:=chartRange
        .ChartType = xlLine
        .HasTitle = True
        .ChartTitle.Text = "Анализ доходов"

        ' Устанавливаем подписи по оси X из столбца A
        .SeriesCollection(1).XValues = ws.Range("A3:A14")
        .SeriesCollection(1).Name = "Удельный вес в 2012 г., %"
        .SeriesCollection(2).Name = "Удельный вес в 2013 г., %"
        .SeriesCollection(3).Name = "Превышение доходов %"

        ' Названия осей
        .Axes(xlCategory, xlPrimary).HasTitle = True
        .Axes(xlCategory, xlPrimary).AxisTitle.Text = "Статьи дохода"
        .Axes(xlValue, xlPrimary).HasTitle = True
        .Axes(xlValue, xlPrimary).AxisTitle.Text = "Сумма, тыс. руб"

        ' Включаем легенду
        .HasLegend = True
        .Legend.Position = xlLegendPositionBottom
    End With

    ' Включаем защиту листа
    ActiveSheet.Protect Password:="mypassword", UserInterfaceOnly:=True

    Exit Sub

ErrorHandler:
    MsgBox "Ошибка: " & Err.Description
    Resume Next
End Sub
