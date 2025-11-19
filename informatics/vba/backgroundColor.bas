Dim newSheets As Collection

Sub CreateSheetsAtEnd()
    Dim i As Integer
    Dim ws As Worksheet
    Dim lastSheet As Worksheet

    ' Создаем коллекцию для хранения новых листов
    Set newSheets = New Collection

    ' Определяем последний лист
    Set lastSheet = Worksheets(Worksheets.Count)

    ' Добавляем 8 новых листов после последнего существующего
    For i = 1 To 8
        Set ws = Worksheets.Add(After:=lastSheet)
        ws.Name = "Лист " & (Worksheets.Count)
        Set lastSheet = ws

        ' Сохраняем новый лист в коллекцию
        newSheets.Add ws
    Next i
End Sub

Sub FillSheetsWithBaseColors()
    Dim i As Integer
    Dim ws As Worksheet
    Dim colors(1 To 8) As Long
    Dim colorNames(1 To 8) As String

    ' Определяем базовые цвета по указанным индексам
    colors(1) = RGB(0, 0, 0)      ' Черный
    colors(2) = RGB(255, 255, 255) ' Белый
    colors(3) = RGB(255, 0, 0)     ' Красный
    colors(4) = RGB(0, 255, 0)     ' Зеленый
    colors(5) = RGB(0, 0, 255)     ' Синий
    colors(6) = RGB(255, 255, 0)   ' Желтый
    colors(7) = RGB(128, 0, 128)   ' Фиолетовый
    colors(8) = RGB(0, 255, 255)   ' Бирюзовый

    ' Определяем имена цветов
    colorNames(1) = "Черный"
    colorNames(2) = "Белый"
    colorNames(3) = "Красный"
    colorNames(4) = "Зеленый"
    colorNames(5) = "Синий"
    colorNames(6) = "Желтый"
    colorNames(7) = "Фиолетовый"
    colorNames(8) = "Бирюзовый"

    ' Проходим по коллекции новых листов
    For i = 1 To newSheets.Count
        Set ws = newSheets(i)
        MsgBox "Следующий лист будет залит цветом: " & colorNames(i), vbInformation
        ws.Cells.Interior.Color = colors(i)
    Next i
End Sub

Sub Main()
    CreateSheetsAtEnd
    FillSheetsWithBaseColors
End Sub
