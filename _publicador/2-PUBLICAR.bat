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
echo ================================================
echo.
pause

:: 1. Define a pasta e gera os arquivos HTML do site
set SITE_DIR=%~dp0..
node "%~dp0publicar.js" "%SITE_DIR%"

echo.
echo ------------------------------------------------
echo   Preparando arquivos para o GitHub...
echo ------------------------------------------------
echo.

:: 2. Avisa ao Git para incluir todos os novos contos e alterações
git add .

:: 3. Salva as alterações localmente com uma mensagem padrão
git commit -m "Publicando novos contos de forma automatica"

:: 4. Envia os arquivos de verdade para o GitHub
echo.
echo Enviando ao servidor...
git push

echo.
echo Processo concluido! Aguarde de 2 a 5 minutos para o site atualizar.
echo.
pause
