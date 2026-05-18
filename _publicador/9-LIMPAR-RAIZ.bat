@echo off
chcp 65001 >nul
title fonteboa - limpando raiz
echo.
echo Apagando HTMLs de texto da raiz...
echo.
cd /d C:\TEXTOS\SITE
node "%~dp09-LIMPAR-RAIZ.js" "C:\TEXTOS\SITE"
echo.
pause
