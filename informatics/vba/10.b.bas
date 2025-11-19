Sub CalculateS()
    Dim a() As Double
    Dim c(1 To 3, 1 To 3) As Double
    Dim m As Integer, n As Integer
    Dim sum_a As Double, sum_a_squared As Double
    Dim sum_c_squared As Double, sum_c As Double
    Dim s As Double
    Dim i As Integer, j As Integer

    ' Assign values to the vector a and matrix c
    m = Cells(22, 2)
    n = Cells(23, 2)

    ' Reading vector a from cells A1 to D1
    ReDim a(1 To m)
    For i = 1 To m
        a(i) = Cells(20, i).Value
    Next i

    ' Reading matrix c from cells A2 to C4
    For i = 1 To n
        For j = 1 To n
            c(i, j) = Cells(19 + i, 5 + j).Value
        Next j
    Next i

    ' Calculating sum of a and sum of a squared
    sum_a = 0
    sum_a_squared = 0
    For i = 1 To m
        sum_a = sum_a + a(i)
        sum_a_squared = sum_a_squared + a(i) ^ 2
    Next i

    ' Calculating sum of c squared and sum of c
    sum_c_squared = 0
    sum_c = 0
    For i = 1 To n
        For j = 1 To n
            sum_c_squared = sum_c_squared + c(i, j) ^ 2
            sum_c = sum_c + c(i, j)
        Next j
    Next i

    ' Calculating s
    s = (1 + sum_a) ^ 2 * (1 + sum_c_squared) - 1 - sum_a_squared + 4 * sum_c

    ' Output the result in cell R24C2
    Cells(24, 2).Value = s
End Sub

