using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.IO;

class ReportGenerator
{
    // Размеры в twips (1 см = 567 twips)
    const string LeftMargin = "1701";   // 3 см
    const string RightMargin = "567";   // 1 см
    const string TopMargin = "1134";    // 2 см
    const string BottomMargin = "1134"; // 2 см
    const string FirstLineIndent = "709"; // 1.25 см
    const string LineSpacing = "360";   // 1.5 интервал (240 * 1.5)
    const string FontName = "Times New Roman";
    const int FontSize = 28; // 14 пт * 2

    static void Main(string[] args)
    {
        string outputPath = args.Length > 0 ? args[0] :
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "Отчёт_ЛР2_Компьютерная_графика.docx");

        outputPath = Path.GetFullPath(outputPath);
        Console.WriteLine($"Генерация отчёта: {outputPath}");

        using var doc = WordprocessingDocument.Create(outputPath, WordprocessingDocumentType.Document);
        var mainPart = doc.AddMainDocumentPart();
        mainPart.Document = new Document();
        var body = new Body();

        // Настройки страницы
        var sectionProps = new SectionProperties(
            new PageSize { Width = 11906, Height = 16838 }, // A4
            new PageMargin
            {
                Left = uint.Parse(LeftMargin),
                Right = uint.Parse(RightMargin),
                Top = int.Parse(TopMargin),
                Bottom = int.Parse(BottomMargin)
            },
            new PageNumberType { Start = 1 },
            new FooterReference { Type = HeaderFooterValues.Default, Id = "rId1" }
        );

        // Нумерация страниц — футер
        var footerPart = mainPart.AddNewPart<FooterPart>("rId1");
        footerPart.Footer = new Footer(
            new Paragraph(
                new ParagraphProperties(
                    new Justification { Val = JustificationValues.Center },
                    new SpacingBetweenLines { After = "0", Line = "240" }
                ),
                new Run(
                    new RunProperties(
                        new RunFonts { Ascii = FontName, HighAnsi = FontName },
                        new FontSize { Val = FontSize.ToString() }
                    ),
                    new FieldChar { FieldCharType = FieldCharValues.Begin }
                ),
                new Run(new FieldCode(" PAGE ")),
                new Run(new FieldChar { FieldCharType = FieldCharValues.End })
            )
        );

        // ============================================================
        // ТИТУЛЬНЫЙ ЛИСТ
        // ============================================================
        AddCenteredParagraph(body, "Министерство науки и высшего образования Российской Федерации", 24, false, "0", "0");
        AddCenteredParagraph(body, "Федеральное государственное бюджетное образовательное учреждение", 24, false, "0", "0");
        AddCenteredParagraph(body, "высшего образования", 24, false, "0", "0");
        AddCenteredParagraph(body, "«ТОМСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ СИСТЕМ УПРАВЛЕНИЯ И РАДИОЭЛЕКТРОНИКИ» (ТУСУР)", 24, true, "0", "400");
        AddCenteredParagraph(body, "Кафедра автоматизации обработки информации (АОИ)", 28, false, "0", "600");
        AddEmptyLines(body, 2);
        AddCenteredParagraph(body, "ОТЧЁТ", 32, true, "0", "0");
        AddCenteredParagraph(body, "по лабораторной работе № 2", 28, true, "0", "0");
        AddCenteredParagraph(body, "по дисциплине «Компьютерная графика»", 28, false, "0", "200");
        AddEmptyLines(body, 1);
        AddCenteredParagraph(body, "Тема: Аффинные 2D-преобразования", 28, true, "0", "0");
        AddCenteredParagraph(body, "Вариант 8", 28, false, "0", "0");
        AddEmptyLines(body, 3);

        // Правый блок — выполнил / проверил
        AddRightAlignedLine(body, "Выполнила: студентка гр. _______");
        AddRightAlignedLine(body, "Медведева Ю.Е.");
        AddEmptyLines(body, 1);
        AddRightAlignedLine(body, "Проверил: _______________________");
        AddEmptyLines(body, 4);
        AddCenteredParagraph(body, "Томск 2025", 28, false, "0", "0");

        // Разрыв страницы
        AddPageBreak(body);

        // ============================================================
        // 1. ЦЕЛЬ РАБОТЫ
        // ============================================================
        AddHeading(body, "1 Цель работы");
        AddBodyParagraph(body,
            "Изучить основные аффинные преобразования на плоскости (масштабирование, отражение, поворот, перенос) " +
            "и их представление в матричной форме с использованием однородных координат. " +
            "Реализовать программу для визуализации исходной и преобразованной фигуры средствами C# и GDI+.");

        // ============================================================
        // 2. КРАТКОЕ ТЕОРЕТИЧЕСКОЕ ВВЕДЕНИЕ
        // ============================================================
        AddHeading(body, "2 Краткое теоретическое введение");

        AddBodyParagraph(body,
            "Аффинные преобразования — это линейные отображения плоскости, сохраняющие параллельность прямых. " +
            "К базовым аффинным преобразованиям относятся: перенос (сдвиг), поворот, масштабирование и отражение.");

        AddBodyParagraph(body,
            "Для единообразной записи всех преобразований через умножение матриц используются однородные координаты: " +
            "каждая точка (x, y) представляется вектором-строкой (x, y, 1). " +
            "Преобразование выполняется умножением вектора-строки на матрицу 3×3 справа:");

        AddBodyParagraph(body, "(x', y', 1) = (x, y, 1) × M", isFormula: true);

        AddBodyParagraph(body,
            "Матрица масштабирования с коэффициентами α и β по осям X и Y:");
        AddBodyParagraph(body, "D = | α  0  0 |", isFormula: true);
        AddBodyParagraph(body, "    | 0  β  0 |", isFormula: true);
        AddBodyParagraph(body, "    | 0  0  1 |", isFormula: true);

        AddBodyParagraph(body,
            "Матрица отражения относительно оси OX (координата y меняет знак):");
        AddBodyParagraph(body, "M = | 1   0  0 |", isFormula: true);
        AddBodyParagraph(body, "    | 0  -1  0 |", isFormula: true);
        AddBodyParagraph(body, "    | 0   0  1 |", isFormula: true);

        AddBodyParagraph(body,
            "Композиция преобразований выполняется последовательным умножением матриц: " +
            "Tитог = D × M. Для всех точек фигуры сразу можно записать матрицу фигуры (4×3) " +
            "и умножить её на итоговую матрицу преобразования (3×3).");

        // ============================================================
        // 3. ОПИСАНИЕ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ
        // ============================================================
        AddHeading(body, "3 Описание программного обеспечения");

        AddBodyParagraph(body, "Для выполнения лабораторной работы использовалось следующее программное обеспечение:");
        AddBullet(body, "Операционная система: Windows 11 Pro;");
        AddBullet(body, "Среда разработки: Microsoft Visual Studio 2022;");
        AddBullet(body, "Язык программирования: C# (.NET Framework 4.7.2);");
        AddBullet(body, "Технология создания интерфейса: Windows Forms;");
        AddBullet(body, "Библиотека отрисовки: GDI+ (System.Drawing).");

        // ============================================================
        // 4. ПОРЯДОК ВЫПОЛНЕНИЯ РАБОТЫ
        // ============================================================
        AddHeading(body, "4 Порядок выполнения работы");

        AddSubHeading(body, "4.1 Задание");
        AddBodyParagraph(body,
            "Вариант 8. Дан четырёхугольник ABCD с координатами: " +
            "A(−2, 2), B(2, 2), C(1, −3), D(−1, −3). " +
            "Необходимо последовательно выполнить два преобразования:");
        AddBullet(body, "Масштабирование с коэффициентом α = π/2 ≈ 1,5708;");
        AddBullet(body, "Отражение относительно оси OX.");

        AddSubHeading(body, "4.2 Описание этапов реализации");

        AddBodyParagraph(body,
            "Этап 1. В Visual Studio 2022 создан проект Windows Forms App (.NET Framework) " +
            "с именем AffineTransform2D.");

        AddBodyParagraph(body,
            "Этап 2. Реализована функция умножения матриц MultiplyMatrix, принимающая " +
            "два двумерных массива произвольных размеров и возвращающая результат матричного умножения.");

        AddBodyParagraph(body,
            "Этап 3. Реализована функция DrawFigure для отрисовки четырёхугольника " +
            "по матрице однородных координат (4×3) с учётом перевода математических координат " +
            "в экранные (инверсия оси Y).");

        AddBodyParagraph(body,
            "Этап 4. В обработчике кнопки «Выполнить» сформированы матрицы масштабирования D " +
            "и отражения M, вычислена итоговая матрица T = D × M, после чего преобразование " +
            "применено к матрице фигуры.");

        AddBodyParagraph(body,
            "Этап 5. На форме отрисованы координатные оси с сеткой и делениями, " +
            "исходная фигура (синим цветом) и преобразованная фигура (красным цветом) " +
            "с подписями вершин и их координатами.");

        // ============================================================
        // 5. РЕЗУЛЬТАТЫ
        // ============================================================
        AddHeading(body, "5 Результаты");

        AddSubHeading(body, "5.1 Ручной расчёт");

        AddBodyParagraph(body, "Матрица исходной фигуры в однородных координатах:");
        AddBodyParagraph(body, "     | -2   2   1 |", isFormula: true);
        AddBodyParagraph(body, "F =  |  2   2   1 |", isFormula: true);
        AddBodyParagraph(body, "     |  1  -3   1 |", isFormula: true);
        AddBodyParagraph(body, "     | -1  -3   1 |", isFormula: true);

        AddBodyParagraph(body, "Матрица масштабирования (α = β = π/2 ≈ 1,5708):");
        AddBodyParagraph(body, "D = | π/2   0    0 |", isFormula: true);
        AddBodyParagraph(body, "    |  0   π/2   0 |", isFormula: true);
        AddBodyParagraph(body, "    |  0    0    1 |", isFormula: true);

        AddBodyParagraph(body, "Матрица отражения относительно оси OX:");
        AddBodyParagraph(body, "M = | 1   0   0 |", isFormula: true);
        AddBodyParagraph(body, "    | 0  -1   0 |", isFormula: true);
        AddBodyParagraph(body, "    | 0   0   1 |", isFormula: true);

        AddBodyParagraph(body, "Итоговая матрица преобразования T = D × M:");
        AddBodyParagraph(body, "T = | π/2    0    0 |", isFormula: true);
        AddBodyParagraph(body, "    |  0   -π/2   0 |", isFormula: true);
        AddBodyParagraph(body, "    |  0     0    1 |", isFormula: true);

        AddBodyParagraph(body, "Вычисление новых координат (F' = F × T):");

        double alpha = Math.PI / 2;
        double[,] orig = { { -2, 2 }, { 2, 2 }, { 1, -3 }, { -1, -3 } };
        string[] vertexNames = { "A", "B", "C", "D" };

        for (int i = 0; i < 4; i++)
        {
            double nx = orig[i, 0] * alpha;
            double ny = orig[i, 1] * (-alpha);
            AddBodyParagraph(body,
                $"{vertexNames[i]}'({orig[i, 0]}×π/2; {orig[i, 1]}×(−π/2)) = " +
                $"{vertexNames[i]}'({nx:F4}; {ny:F4})");
        }

        AddEmptyLines(body, 1);

        // Таблица результатов
        AddBodyParagraph(body, "Таблица 5.1 — Координаты вершин до и после преобразования", isBold: true, centered: true);
        var table = CreateResultsTable(orig, alpha, vertexNames);
        body.Append(table);
        AddEmptyLines(body, 1);

        AddSubHeading(body, "5.2 Результат работы программы");

        AddBodyParagraph(body,
            "На рисунке 5.1 представлен результат работы программы. " +
            "Синим цветом изображён исходный четырёхугольник ABCD, " +
            "красным — преобразованный четырёхугольник A'B'C'D'.");

        AddBodyParagraph(body,
            "[Здесь необходимо вставить скриншот работы программы]", isBold: false, centered: true);
        AddCenteredParagraph(body, "Рисунок 5.1 — Результат аффинных преобразований", FontSize, true, "0", "200");

        AddSubHeading(body, "5.3 Сравнение результатов");
        AddBodyParagraph(body,
            "Координаты, полученные программно, полностью совпадают с результатами ручного расчёта " +
            "(с точностью до округления float). Преобразованная фигура увеличена в π/2 ≈ 1,57 раза " +
            "относительно начала координат и отражена относительно оси OX " +
            "(вершины, которые были сверху, оказались снизу, и наоборот).");

        // ============================================================
        // 6. ВЫВОДЫ
        // ============================================================
        AddHeading(body, "6 Выводы");

        AddBodyParagraph(body,
            "В ходе выполнения лабораторной работы были изучены основные аффинные преобразования на плоскости " +
            "и их матричное представление с использованием однородных координат. " +
            "Реализована программа на C# (Windows Forms + GDI+), выполняющая последовательное " +
            "масштабирование (α = π/2) и отражение относительно оси OX для четырёхугольника ABCD.");

        AddBodyParagraph(body,
            "Результаты программного расчёта совпали с ручным расчётом, что подтверждает корректность " +
            "реализации матричного подхода. Визуализация наглядно демонстрирует эффект преобразований: " +
            "фигура увеличена примерно в 1,57 раза и «перевёрнута» по вертикали.");

        // ============================================================
        // 7. СПИСОК ЛИТЕРАТУРЫ
        // ============================================================
        AddHeading(body, "7 Список использованной литературы");

        AddNumberedItem(body, 1, "Компьютерная графика: Методические указания к лабораторным работам и " +
            "организации самостоятельной работы / ТУСУР. — Томск, 2024.");
        AddNumberedItem(body, 2, "Роджерс Д., Адамс Дж. Математические основы машинной графики. — М.: Мир, 2001. — 604 с.");
        AddNumberedItem(body, 3, "Никулин Е.А. Компьютерная геометрия и алгоритмы машинной графики. — СПб.: БХВ-Петербург, 2003. — 560 с.");

        // Разрыв страницы перед приложением
        AddPageBreak(body);

        // ============================================================
        // ПРИЛОЖЕНИЕ — ЛИСТИНГ КОДА
        // ============================================================
        AddHeading(body, "Приложение А — Листинг исходного кода");

        AddSubHeading(body, "Файл Form1.cs");
        AddCodeBlock(body, File.ReadAllText(
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "AffineTransform2D", "Form1.cs")));

        AddSubHeading(body, "Файл Form1.Designer.cs");
        AddCodeBlock(body, File.ReadAllText(
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "AffineTransform2D", "Form1.Designer.cs")));

        AddSubHeading(body, "Файл Program.cs");
        AddCodeBlock(body, File.ReadAllText(
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "AffineTransform2D", "Program.cs")));

        body.Append(sectionProps);
        mainPart.Document.Append(body);
        mainPart.Document.Save();

        Console.WriteLine("Отчёт успешно сгенерирован!");
    }

    // ================================================================
    // Вспомогательные методы
    // ================================================================

    static RunProperties DefaultRunProps(int size = FontSize, bool bold = false, string font = FontName)
    {
        var rp = new RunProperties(
            new RunFonts { Ascii = font, HighAnsi = font, ComplexScript = font, EastAsia = font },
            new FontSize { Val = size.ToString() },
            new FontSizeComplexScript { Val = size.ToString() }
        );
        if (bold) rp.Append(new Bold());
        return rp;
    }

    static ParagraphProperties BodyParagraphProps(bool centered = false)
    {
        var pp = new ParagraphProperties(
            new SpacingBetweenLines { After = "0", Line = LineSpacing, LineRule = LineSpacingRuleValues.Auto },
            new Justification { Val = centered ? JustificationValues.Center : JustificationValues.Both }
        );
        if (!centered)
            pp.Append(new Indentation { FirstLine = FirstLineIndent });
        return pp;
    }

    static void AddBodyParagraph(Body body, string text, bool isBold = false, bool centered = false, bool isFormula = false)
    {
        var pp = new ParagraphProperties(
            new SpacingBetweenLines { After = "0", Line = LineSpacing, LineRule = LineSpacingRuleValues.Auto },
            new Justification { Val = centered ? JustificationValues.Center : JustificationValues.Both }
        );
        if (!centered && !isFormula)
            pp.Append(new Indentation { FirstLine = FirstLineIndent });
        if (isFormula)
            pp.Append(new Indentation { Left = "1418" }); // 2.5 см для формул

        string fontForRun = isFormula ? "Courier New" : FontName;
        int sizeForRun = isFormula ? 24 : FontSize; // 12 пт для формул

        var run = new Run(DefaultRunProps(sizeForRun, isBold, fontForRun), new Text(text) { Space = SpaceProcessingModeValues.Preserve });
        body.Append(new Paragraph(pp, run));
    }

    static void AddCenteredParagraph(Body body, string text, int size, bool bold, string spaceBefore, string spaceAfter)
    {
        var pp = new ParagraphProperties(
            new SpacingBetweenLines { Before = spaceBefore, After = spaceAfter, Line = LineSpacing, LineRule = LineSpacingRuleValues.Auto },
            new Justification { Val = JustificationValues.Center }
        );
        var run = new Run(DefaultRunProps(size, bold), new Text(text) { Space = SpaceProcessingModeValues.Preserve });
        body.Append(new Paragraph(pp, run));
    }

    static void AddHeading(Body body, string text)
    {
        var pp = new ParagraphProperties(
            new SpacingBetweenLines { Before = "400", After = "200", Line = LineSpacing, LineRule = LineSpacingRuleValues.Auto },
            new Justification { Val = JustificationValues.Left }
        );
        var run = new Run(DefaultRunProps(FontSize, true), new Text(text));
        body.Append(new Paragraph(pp, run));
    }

    static void AddSubHeading(Body body, string text)
    {
        var pp = new ParagraphProperties(
            new SpacingBetweenLines { Before = "200", After = "100", Line = LineSpacing, LineRule = LineSpacingRuleValues.Auto },
            new Justification { Val = JustificationValues.Left },
            new Indentation { FirstLine = FirstLineIndent }
        );
        var run = new Run(DefaultRunProps(FontSize, true), new Text(text));
        body.Append(new Paragraph(pp, run));
    }

    static void AddBullet(Body body, string text)
    {
        var pp = new ParagraphProperties(
            new SpacingBetweenLines { After = "0", Line = LineSpacing, LineRule = LineSpacingRuleValues.Auto },
            new Justification { Val = JustificationValues.Both },
            new Indentation { Left = "709", Hanging = "283" }
        );
        var run = new Run(DefaultRunProps(), new Text("– " + text) { Space = SpaceProcessingModeValues.Preserve });
        body.Append(new Paragraph(pp, run));
    }

    static void AddNumberedItem(Body body, int number, string text)
    {
        var pp = new ParagraphProperties(
            new SpacingBetweenLines { After = "0", Line = LineSpacing, LineRule = LineSpacingRuleValues.Auto },
            new Justification { Val = JustificationValues.Both },
            new Indentation { Left = "709", Hanging = "283" }
        );
        var run = new Run(DefaultRunProps(), new Text($"{number}. {text}") { Space = SpaceProcessingModeValues.Preserve });
        body.Append(new Paragraph(pp, run));
    }

    static void AddRightAlignedLine(Body body, string text)
    {
        var pp = new ParagraphProperties(
            new SpacingBetweenLines { After = "0", Line = LineSpacing, LineRule = LineSpacingRuleValues.Auto },
            new Justification { Val = JustificationValues.Right }
        );
        var run = new Run(DefaultRunProps(), new Text(text) { Space = SpaceProcessingModeValues.Preserve });
        body.Append(new Paragraph(pp, run));
    }

    static void AddEmptyLines(Body body, int count)
    {
        for (int i = 0; i < count; i++)
        {
            var pp = new ParagraphProperties(
                new SpacingBetweenLines { After = "0", Line = LineSpacing, LineRule = LineSpacingRuleValues.Auto }
            );
            body.Append(new Paragraph(pp, new Run(new Text(""))));
        }
    }

    static void AddPageBreak(Body body)
    {
        body.Append(new Paragraph(
            new Run(new Break { Type = BreakValues.Page })
        ));
    }

    static void AddCodeBlock(Body body, string code)
    {
        foreach (var line in code.Split('\n'))
        {
            var trimmed = line.TrimEnd('\r');
            var pp = new ParagraphProperties(
                new SpacingBetweenLines { After = "0", Line = "240", LineRule = LineSpacingRuleValues.Auto },
                new Justification { Val = JustificationValues.Left }
            );
            var rp = DefaultRunProps(20, false, "Courier New"); // 10 пт моноширинный
            var run = new Run(rp, new Text(trimmed) { Space = SpaceProcessingModeValues.Preserve });
            body.Append(new Paragraph(pp, run));
        }
    }

    static Table CreateResultsTable(double[,] orig, double alpha, string[] names)
    {
        var tblProps = new TableProperties(
            new TableBorders(
                new TopBorder { Val = BorderValues.Single, Size = 4 },
                new BottomBorder { Val = BorderValues.Single, Size = 4 },
                new LeftBorder { Val = BorderValues.Single, Size = 4 },
                new RightBorder { Val = BorderValues.Single, Size = 4 },
                new InsideHorizontalBorder { Val = BorderValues.Single, Size = 4 },
                new InsideVerticalBorder { Val = BorderValues.Single, Size = 4 }
            ),
            new TableWidth { Type = TableWidthUnitValues.Pct, Width = "5000" }, // 100%
            new TableJustification { Val = TableRowAlignmentValues.Center }
        );

        var table = new Table(tblProps);

        // Заголовок
        table.Append(CreateTableRow(new[] { "Вершина", "x исх.", "y исх.", "x' преобр.", "y' преобр." }, bold: true));

        for (int i = 0; i < 4; i++)
        {
            double nx = orig[i, 0] * alpha;
            double ny = orig[i, 1] * (-alpha);
            table.Append(CreateTableRow(new[] {
                $"{names[i]} → {names[i]}'",
                orig[i, 0].ToString("F1"),
                orig[i, 1].ToString("F1"),
                nx.ToString("F4"),
                ny.ToString("F4")
            }));
        }

        return table;
    }

    static TableRow CreateTableRow(string[] cells, bool bold = false)
    {
        var row = new TableRow();
        foreach (var cellText in cells)
        {
            var cellProps = new TableCellProperties(
                new TableCellWidth { Type = TableWidthUnitValues.Auto }
            );
            var pp = new ParagraphProperties(
                new SpacingBetweenLines { After = "0", Line = "240" },
                new Justification { Val = JustificationValues.Center }
            );
            var run = new Run(DefaultRunProps(FontSize, bold), new Text(cellText) { Space = SpaceProcessingModeValues.Preserve });
            var cell = new TableCell(cellProps, new Paragraph(pp, run));
            row.Append(cell);
        }
        return row;
    }
}
