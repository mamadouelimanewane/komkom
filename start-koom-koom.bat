@echo off
title KOOM-KOOM VOICE - Demarrage
setlocal

set "NODE_DIR=C:\Users\DIA\AppData\Local\Programs\nodejs\node-v20.18.0-win-x64"
set "PATH=%NODE_DIR%;%PATH%"

echo =====================================================================
echo           KOOM-KOOM VOICE - MARCHE SANDAGA & UEMOA
echo    Le Kaye Numerique & Recouvrement Vocal WhatsApp / Wave
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/2] Lancement du Serveur Backend (API, NLU, Wave, WhatsApp)...
start "Koom-Koom Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && set "PATH=%NODE_DIR%;%PATH%" && node server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Lancement de l'Application Frontend (Vite React)...
start "Koom-Koom Frontend (Port 3000)" cmd /k "cd /d "%~dp0frontend" && set "PATH=%NODE_DIR%;%PATH%" && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Ouverture de Koom-Koom Voice dans votre navigateur...
start http://localhost:3000

echo.
echo =====================================================================
echo Application operationnelle : http://localhost:3000
echo Backend API : http://localhost:5000/api/dashboard
echo =====================================================================
echo.
