@echo off
chcp 65001 >nul
title fonteboa - corrigindo menu

cd /d C:\TEXTOS\SITE
node "%~dp0corrigir-menu.js" "C:\TEXTOS\SITE"

echo.
pause
