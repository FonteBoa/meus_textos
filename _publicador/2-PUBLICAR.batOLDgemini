@echo off
title fonteboa publicando...
git config --global gc.auto 0
git config --global gc.autopacklimit 0
git config --global gc.pruneExpire never
echo.
echo ================================================
echo   AVISO IMPORTANTE
echo ================================================
echo.
echo   O publicador ira gerar seus HTMLs e enviar
echo   tudo ao GitHub automaticamente.
echo.
echo   Aguarde ate ver a mensagem:
echo   "Enviado com sucesso para o GitHub Pages!"
echo   antes de fechar esta janela.
echo.
echo ================================================
echo.
pause
echo.
set SITE_DIR=%~dp0..
echo n | node "%~dp0publicar.js" "%SITE_DIR%"
echo.
pause
