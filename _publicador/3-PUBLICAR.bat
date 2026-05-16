@echo off
title fonteboa publicando...
git config --global gc.auto 0
set SITE_DIR=%~dp0..
node "%~dp0publicar.js" "%SITE_DIR%"
echo.
pause
