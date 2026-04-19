namespace AffineTransform2D
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.btnExecute = new System.Windows.Forms.Button();
            this.lblOriginal = new System.Windows.Forms.Label();
            this.lblTransformed = new System.Windows.Forms.Label();
            this.SuspendLayout();
            //
            // btnExecute
            //
            this.btnExecute.Font = new System.Drawing.Font("Segoe UI", 10F);
            this.btnExecute.Location = new System.Drawing.Point(12, 12);
            this.btnExecute.Name = "btnExecute";
            this.btnExecute.Size = new System.Drawing.Size(130, 35);
            this.btnExecute.TabIndex = 0;
            this.btnExecute.Text = "Выполнить";
            this.btnExecute.UseVisualStyleBackColor = true;
            this.btnExecute.Click += new System.EventHandler(this.btnExecute_Click);
            //
            // lblOriginal
            //
            this.lblOriginal.AutoSize = true;
            this.lblOriginal.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.lblOriginal.Location = new System.Drawing.Point(160, 12);
            this.lblOriginal.Name = "lblOriginal";
            this.lblOriginal.Size = new System.Drawing.Size(0, 15);
            this.lblOriginal.TabIndex = 1;
            //
            // lblTransformed
            //
            this.lblTransformed.AutoSize = true;
            this.lblTransformed.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.lblTransformed.Location = new System.Drawing.Point(160, 32);
            this.lblTransformed.Name = "lblTransformed";
            this.lblTransformed.Size = new System.Drawing.Size(0, 15);
            this.lblTransformed.TabIndex = 2;
            //
            // Form1
            //
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(800, 600);
            this.Controls.Add(this.lblTransformed);
            this.Controls.Add(this.lblOriginal);
            this.Controls.Add(this.btnExecute);
            this.DoubleBuffered = true;
            this.Name = "Form1";
            this.Text = "Аффинные 2D-преобразования — Вариант 8";
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private System.Windows.Forms.Button btnExecute;
        private System.Windows.Forms.Label lblOriginal;
        private System.Windows.Forms.Label lblTransformed;
    }
}
