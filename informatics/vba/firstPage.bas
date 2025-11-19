Public Sub FormingTitlePage()
    Dim btn As Button

    ' Выбираем первый рабочий лист
    Worksheets(1).Select

    With Application
        ' Не видна строка состояния
        .DisplayStatusBar = False
        ' Не видна строка формул
        .DisplayFormulaBar = False
    End With

    With ActiveWindow
        ' Не видны линии сетки ячеек
        .DisplayGridlines = False
        ' Не показываются заголовки строк и столбцов
        .DisplayHeadings = False
        ' Не отображается горизонтальная полоса прокрутки
        .DisplayHorizontalScrollBar = False
        ' Не отображается вертикальная полоса прокрутки
        .DisplayVerticalScrollBar = False
        ' Видны ярлычки рабочих листов
        .DisplayWorkbookTabs = True
    End With

    ' Очищаем содержимое ячеек
    Cells.Clear

    ' В цикле очищаем лист от всех объектов
    For Each i In ActiveSheet.Shapes
        i.Delete
    Next i


    Dim leftPos As Double
    Dim topPos As Double
    Dim width As Double
    Dim height As Double
    ' Читаем значения из ячеек для координат и размеров
    leftPos = Cells(36, 1).Value ' Координата X (A1)
    topPos = Cells(38, 1).Value  ' Координата Y (A2)
     ' Определяем диапазон ячеек
    Dim startCell As Range
    Dim endCell As Range
    Set startCell = Cells(36, 7) ' R36C7 (G36 в A1)
    Set endCell = Cells(36, 13) ' R36C13 (M36 в A1)

' Вычисляем координаты и размеры кнопки
    leftPos = startCell.Left
    topPos = startCell.Top
    width = endCell.Left + endCell.Width - leftPos
    height = startCell.Height

    ' Добавляем кнопку на активный лист
    Set btn = ActiveSheet.Buttons.Add(leftPos, topPos, width, height)
    btn.Caption = "Перейти к содержанию"
    ' По нажатию на кнопку вызывается макрос «Reset»
    btn.OnAction = "GoToSheet2"
    With Range(Cells(5, 7), Cells(5, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "Министерство науки и высшего образования Российской Федерации"
    End With
    With Range(Cells(6, 7), Cells(6, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "Федеральное государственное бюджетное образовательное"
    End With
    With Range(Cells(7, 7), Cells(7, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "учреждение высшего образования"
    End With
    With Range(Cells(8, 7), Cells(8, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "ТОМСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ СИСТЕМ"
    End With
    With Range(Cells(9, 7), Cells(9, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "УПРАВЛЕНИЯ И РАДИОЭЛЕКТРОНИКИ (ТУСУР)"
    End With
    With Range(Cells(12, 7), Cells(12, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "Автоматизированных систем управления"
    End With
    With Range(Cells(13, 7), Cells(13, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "(АСУ) "
    End With
    With Range(Cells(17, 7), Cells(17, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "EXCEL"
    End With
    With Range(Cells(21, 7), Cells(21, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "Информатика"
    End With
    With Range(Cells(22, 7), Cells(22, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "Лабораторная работа №1 "
    End With
    With Range(Cells(26, 7), Cells(26, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "Выполнила:"
    End With
    With Range(Cells(27, 7), Cells(27, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "Студентка грз-433П8-5"
    End With
    With Range(Cells(28, 7), Cells(28, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "Медведева Ю.Е."
    End With
    With Range(Cells(29, 7), Cells(29, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "«21» августа 2024 г."
    End With
    With Range(Cells(31, 7), Cells(31, 13))
        'Объединяем несколько ячеек по горизонтали
        .Merge
        ' Присваиваем диапазону значение с переводом строки
        .Value = "Томск 2024"
    End With
    Call ChangeFont
    Call CenterTextInRange
    Call RightTextInRange



    ' Цвет шрифта и фона для всех ячеек
    With Cells
        ' Цвет шрифта
        .Font.ColorIndex = 1
        ' Цвет заливки
        .Interior.ColorIndex = 2
    End With

    ' Автоматически подстраиваем ширину всех столбцов
    Columns.AutoFit

    ' Выводим на экран подтверждающее сообщение
    MsgBox "Действие закончено"
End Sub

Sub ChangeFont()
Dim rng As Range

    ' Определяем диапазон ячеек
    Set rng = Range(Cells(5, 7), Cells(31, 7)) ' R5C7:R10C7 (G5:G10 в стиле A1)

          With rng.Font
            ' Размер шрифта
            .Size = 16
            ' Полужирное начертание
            .Bold = True
        End With
End Sub

Sub CenterTextInRange()
    Dim rng As Range

    ' Определяем диапазон ячеек
    Set rng = Range(Cells(5, 7), Cells(22, 7))

    ' Применяем выравнивание по центру для каждой ячейки в диапазоне
    With rng
        .HorizontalAlignment = xlCenter
        .VerticalAlignment = xlCenter
    End With
    With Cells(31, 7)
        .HorizontalAlignment = xlCenter
        .VerticalAlignment = xlCenter
    End With
End Sub

Sub RightTextInRange()
    Dim rng As Range

    ' Определяем диапазон ячеек
    Set rng = Range(Cells(26, 7), Cells(29, 13))

    ' Применяем выравнивание по правому краю для каждой ячейки в диапазоне
    With rng
        .HorizontalAlignment = xlRight
        .VerticalAlignment = xlCenter ' Можно оставить по центру, или изменить на xlTop/xlBottom
    End With
End Sub
Sub GoToSheet2()
    Worksheets(2).Select
End Sub
