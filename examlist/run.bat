@echo off
set PYTHON=%~dp0venv\Scripts
set APP=%~dp0main.py

if "%1"=="pip" (
    "%PYTHON%\python.exe" -m pip %2 %3 %4 %5 %6 %7 %8 %9
) else (
    "%PYTHON%\python.exe" "%APP%" %*
)