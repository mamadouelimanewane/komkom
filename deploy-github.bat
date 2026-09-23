@echo off
title Deploiement GitHub - Koom-Koom Voice
color 0A
setlocal

echo ====================================================================
echo         ENVOI DU PROJET SUR GITHUB (mamadouelimanewane/komkom)
echo ====================================================================
echo.

cd /d "%~dp0"

echo Configuration de la branche main...
git branch -M main

echo Tentative de push vers https://github.com/mamadouelimanewane/komkom.git...
echo (Une fenetre de connexion GitHub va apparaitre sur votre ecran)
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================================
    echo [SUCCES] Projet deploye avec succes sur GitHub !
    echo https://github.com/mamadouelimanewane/komkom
    echo ====================================================================
) else (
    echo.
    echo [ATTENTION] Le push a echoue ou a ete annule.
    echo Si necessaire, verifiez que le depot existe bien sur GitHub :
    echo https://github.com/mamadouelimanewane/komkom
)

echo.
echo Appuyez sur une touche pour fermer...
pause >nul
