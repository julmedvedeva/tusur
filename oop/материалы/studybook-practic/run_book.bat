@echo off
REM --- Переход в папку Installed относительно расположения скрипта ---
cd /d "%~dp0Installed"
echo Go to folder  Installed

REM --- Проверяем, существует ли OOP Book.exe ---
if not exist "OOP Book.exe" (
    echo [Error] file OOP Book.exe dont found in folder Installed
    pause
    exit /b
)

REM --- Запуск программы с файлом book.hbf ---
"OOP Book.exe" book.hbf

REM --- Ждём нажатия клавиши, чтобы увидеть ошибки ---
pause
