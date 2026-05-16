@echo off
chcp 65001 >nul
title fonteboa - limpeza e correcao

cd /d C:\TEXTOS\SITE
node "%~dp07-LIMPAR-E-CORRIGIR.js" "C:\TEXTOS\SITE"

echo.
pause
