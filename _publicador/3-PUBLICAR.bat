@echo off
title fonteboa publicando...
git config --global gc.auto 0
git config --global gc.autopacklimit 0
git config --global gc.pruneExpire never
set SITE_DIR=%~dp0..
node "%~dp0publicar.js" "%SITE_DIR%"
echo.
echo Se aparecerem perguntas acima, tecle Ctrl+C para sair.
echo O texto ja foi publicado com sucesso.
echo.
pause
