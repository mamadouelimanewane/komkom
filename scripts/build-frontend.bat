@echo off
setlocal
set "PATH=C:\Users\DIA\AppData\Local\Programs\nodejs\node-v20.18.0-win-x64;%PATH%"
cd /d "C:\gravity\koom-koom-voice\frontend"
echo [KOOM-KOOM] Verification du build Vite...
call npm run build
echo [KOOM-KOOM] Build termine avec code: %ERRORLEVEL%
exit /b %ERRORLEVEL%
