@echo off
chcp 65001 >nul
title fonteboa — publicando...

git config --global gc.auto 0

:: A pasta do site é a pasta acima desta (_publicador)
set SITE_DIR=%~dp0..

:: Roda o publicador
node "%~dp0publicar.js" "%SITE_DIR%"

echo.
pause
