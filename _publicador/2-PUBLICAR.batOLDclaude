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
echo   Ao final podem aparecer mensagens com
echo   "Deletion of directory failed".
echo   Sao INOFENSIVAS - seu texto ja estara
echo   publicado com sucesso antes delas.
echo.
echo   Se isso acontecer, tecle Ctrl+C para sair.
echo   Em seguida, ENTER novamente.
echo   Ainda surgira um pedido de confirmacao:
echo   tecle S para autorizar e encerrar o processo.
echo.
echo ================================================
echo.
pause
echo.
set SITE_DIR=%~dp0..
node "%~dp0publicar.js" "%SITE_DIR%"
echo.
pause
