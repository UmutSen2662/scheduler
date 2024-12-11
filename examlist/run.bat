@echo off
set PYTHON=%~dp0venv\Scripts
set APP=%~dp0main.py

"%PYTHON%\python.exe" "%APP%" %*