@echo off
chcp 65001 >nul
title fonteboa - adicionando formulario de comentarios

cd /d C:\TEXTOS\SITE
node "%~dp08-ADICIONAR-COMENTARIOS.js" "C:\TEXTOS\SITE"

echo.
pause
