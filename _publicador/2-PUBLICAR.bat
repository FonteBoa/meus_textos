@echo off
title fonteboa publicando...

:: Configurações de otimização do Git
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

:: 1. Define a raiz do projeto (C:\TEXTOS\site)
set RAIZ_PROJETO=%~dp0..

:: 2. Executa o publicar.js passando a pasta certa para ele trabalhar
node "%~dp0publicar.js" "%RAIZ_PROJETO%"

echo.
echo ------------------------------------------------
echo   Preparando arquivos para o GitHub...
echo ------------------------------------------------
echo.

:: 3. Move o terminal para a raiz do repositório onde estão os arquivos modificados
cd /d "%RAIZ_PROJETO%"

:: 4. Adiciona todas as modificações e novos contos
git add .

:: 5. Faz o commit automático
git commit -m "Publicando novos contos de forma automatica"

:: 6. Envia as atualizações para o GitHub
echo.
echo Enviando para o servidor do GitHub...
echo.
git push origin main

echo.
echo ================================================
echo   PROCESSO CONCLUIDO COM SUCESSO!
echo   Verifique agora a aba Actions no GitHub.
echo ================================================
echo.
pause
