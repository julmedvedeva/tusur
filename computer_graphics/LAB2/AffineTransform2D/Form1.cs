using System;
using System.Drawing;
using System.Windows.Forms;

namespace AffineTransform2D
{
    public partial class Form1 : Form
    {
        // Точки фигуры ABCD (вариант 8) в однородных координатах
        private readonly float[,] figure = {
            { -2,  2, 1 },  // A
            {  2,  2, 1 },  // B
            {  1, -3, 1 },  // C
            { -1, -3, 1 }   // D
        };

        private float[,] transformed = null;

        public Form1()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Умножение двух матриц
        /// </summary>
        private float[,] MultiplyMatrix(float[,] a, float[,] b)
        {
            int rowsA = a.GetLength(0);
            int colsB = b.GetLength(1);
            int common = a.GetLength(1);
            float[,] result = new float[rowsA, colsB];

            for (int i = 0; i < rowsA; i++)
                for (int j = 0; j < colsB; j++)
                    for (int k = 0; k < common; k++)
                        result[i, j] += a[i, k] * b[k, j];

            return result;
        }

        /// <summary>
        /// Рисование четырёхугольника по матрице точек (4x3)
        /// </summary>
        private void DrawFigure(Graphics g, float[,] pts, Pen pen, float cx, float cy, float scale)
        {
            PointF[] points = new PointF[4];
            for (int i = 0; i < 4; i++)
            {
                points[i] = new PointF(
                    cx + pts[i, 0] * scale,
                    cy - pts[i, 1] * scale  // ось Y экрана направлена вниз
                );
            }

            for (int i = 0; i < 4; i++)
            {
                int next = (i + 1) % 4;
                g.DrawLine(pen, points[i], points[next]);
            }
        }

        /// <summary>
        /// Рисование осей координат с разметкой
        /// </summary>
        private void DrawAxes(Graphics g, float cx, float cy, float scale)
        {
            int w = ClientSize.Width;
            int h = ClientSize.Height;

            using (Pen axisPen = new Pen(Color.LightGray, 1))
            {
                g.DrawLine(axisPen, 0, cy, w, cy);  // ось X
                g.DrawLine(axisPen, cx, 0, cx, h);   // ось Y
            }

            // Стрелки осей
            using (Pen arrowPen = new Pen(Color.Gray, 1))
            {
                // X
                g.DrawLine(arrowPen, w - 10, cy - 4, w, cy);
                g.DrawLine(arrowPen, w - 10, cy + 4, w, cy);
                // Y
                g.DrawLine(arrowPen, cx - 4, 10, cx, 0);
                g.DrawLine(arrowPen, cx + 4, 10, cx, 0);
            }

            // Подписи осей
            using (Font f = new Font("Segoe UI", 9))
            using (Brush br = new SolidBrush(Color.Gray))
            {
                g.DrawString("X", f, br, w - 18, cy + 5);
                g.DrawString("Y", f, br, cx + 5, 2);
            }

            // Деления на осях
            using (Pen tickPen = new Pen(Color.LightGray, 1) { DashStyle = System.Drawing.Drawing2D.DashStyle.Dot })
            using (Font f = new Font("Segoe UI", 7))
            using (Brush br = new SolidBrush(Color.DarkGray))
            {
                int maxUnits = (int)(Math.Max(w, h) / scale) + 1;
                for (int i = -maxUnits; i <= maxUnits; i++)
                {
                    if (i == 0) continue;
                    float px = cx + i * scale;
                    float py = cy - i * scale;

                    // Деления по X
                    if (px > 0 && px < w)
                    {
                        g.DrawLine(tickPen, px, 0, px, h);
                        g.DrawString(i.ToString(), f, br, px - 5, cy + 3);
                    }

                    // Деления по Y
                    if (py > 0 && py < h)
                    {
                        g.DrawLine(tickPen, 0, py, w, py);
                        g.DrawString(i.ToString(), f, br, cx + 3, py - 6);
                    }
                }
            }
        }

        /// <summary>
        /// Подписи вершин фигуры
        /// </summary>
        private void DrawLabels(Graphics g, float[,] pts, string[] names, Color color, float cx, float cy, float scale)
        {
            using (Font f = new Font("Segoe UI", 9, FontStyle.Bold))
            using (Brush br = new SolidBrush(color))
            {
                for (int i = 0; i < pts.GetLength(0); i++)
                {
                    float sx = cx + pts[i, 0] * scale;
                    float sy = cy - pts[i, 1] * scale;
                    string label = string.Format("{0}({1:F2}; {2:F2})", names[i], pts[i, 0], pts[i, 1]);
                    g.DrawString(label, f, br, sx + 5, sy - 18);
                }
            }
        }

        private void btnExecute_Click(object sender, EventArgs e)
        {
            float alpha = (float)(Math.PI / 2);

            // Матрица масштабирования D (alpha по обеим осям)
            float[,] D = {
                { alpha, 0, 0 },
                { 0, alpha, 0 },
                { 0, 0, 1 }
            };

            // Матрица отражения относительно OX
            float[,] M = {
                { 1,  0, 0 },
                { 0, -1, 0 },
                { 0,  0, 1 }
            };

            // Итоговая матрица преобразования T = D × M
            float[,] T = MultiplyMatrix(D, M);

            // Применить преобразование к фигуре: result = figure × T
            transformed = MultiplyMatrix(figure, T);

            // Вывести координаты в метки
            string[] names = { "A", "B", "C", "D" };
            string origText = "Исходные: ";
            string transText = "Результат: ";
            for (int i = 0; i < 4; i++)
            {
                origText += string.Format("{0}({1}; {2}) ", names[i], figure[i, 0], figure[i, 1]);
                transText += string.Format("{0}'({1:F2}; {2:F2}) ", names[i], transformed[i, 0], transformed[i, 1]);
            }
            lblOriginal.Text = origText;
            lblTransformed.Text = transText;

            Invalidate(); // перерисовать форму
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);

            if (transformed == null)
                return;

            Graphics g = e.Graphics;
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;

            float cx = ClientSize.Width / 2f;
            float cy = ClientSize.Height / 2f;
            float scale = 40f; // пикселей на единицу координат

            // Оси координат
            DrawAxes(g, cx, cy, scale);

            string[] names = { "A", "B", "C", "D" };

            // Исходная фигура (синим)
            using (Pen bluePen = new Pen(Color.Blue, 2))
            {
                DrawFigure(g, figure, bluePen, cx, cy, scale);
            }
            DrawLabels(g, figure, names, Color.Blue, cx, cy, scale);

            // Преобразованная фигура (красным)
            using (Pen redPen = new Pen(Color.Red, 2))
            {
                DrawFigure(g, transformed, redPen, cx, cy, scale);
            }
            string[] namesT = { "A'", "B'", "C'", "D'" };
            DrawLabels(g, transformed, namesT, Color.Red, cx, cy, scale);
        }

        protected override void OnResize(EventArgs e)
        {
            base.OnResize(e);
            Invalidate();
        }
    }
}
