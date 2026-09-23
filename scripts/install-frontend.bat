@echo off
setlocal
set "PATH=C:\Users\DIA\AppData\Local\Programs\nodejs\node-v20.18.0-win-x64;%PATH%"
cd /d "C:\gravity\koom-koom-voice\frontend"
echo [KOOM-KOOM] Installation des dependances Frontend...
call npm install
echo [KOOM-KOOM] Installation terminee avec code: %ERRORLEVEL%
exit /b %ERRORLEVEL%
