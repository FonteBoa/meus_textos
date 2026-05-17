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

:: 2. Garante que o prompt entra na pasta do projeto
cd /d "%RAIZ_PROJETO%"

echo.
echo ------------------------------------------------
echo   PASSO 1: Sincronizando com o GitHub...
echo ------------------------------------------------
echo.

:: 3. PUXA as novidades do site primeiro (evita o erro 'rejected')
git pull origin main --rebase

echo.
echo ------------------------------------------------
echo   PASSO 2: Gerando novos HTMLs...
echo ------------------------------------------------
echo.

:: 4. Executa o seu script do Node para criar os novos textos
node "%~dp0publicar.js" "%RAIZ_PROJETO%"

echo.
echo ------------------------------------------------
echo   PASSO 3: Enviando atualizacoes...
echo ------------------------------------------------
echo.

:: 5. Adiciona os novos contos e crônicas gerados
git add .

:: 6. Faz o commit com o pacote de novidades
git commit -m "publica: novos textos de forma automatica"

:: 7. Envia os arquivos de forma limpa e segura
git push origin main

echo.
echo ================================================
echo   ✓ Enviado com sucesso para o GitHub Pages!
echo   As alterações estarão no ar em cerca de 1 minuto.
echo ================================================
echo.
pause
