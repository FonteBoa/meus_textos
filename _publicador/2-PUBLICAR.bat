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
echo   PASSO 1: Preparando arquivos locais...
echo ------------------------------------------------
echo.

:: 3. Organiza os arquivos que já estão modificados na máquina para o Git não reclamar
git add .

echo.
echo ------------------------------------------------
echo   PASSO 2: Sincronizando com o GitHub...
echo ------------------------------------------------
echo.

:: 4. Agora sim, puxa atualizações do site de forma totalmente segura
git pull origin main --rebase

echo.
echo ------------------------------------------------
echo   PASSO 3: Gerando novos HTMLs...
echo ------------------------------------------------
echo.

:: 5. Executa o seu script do Node para criar os novos textos
node "%~dp0publicar.js" "%RAIZ_PROJETO%"

echo.
echo ------------------------------------------------
echo   PASSO 4: Enviando atualizacoes...
echo ------------------------------------------------
echo.

:: 6. Inclui os novos contos e índices gerados pelo Node
git add .

:: 7. Faz o commit com todas as novidades juntas
git commit -m "publica: novos textos de forma automatica"

:: 8. Envia os arquivos de forma limpa e direta
echo.
echo Enviando atualizacoes para o servidor...
echo.
git push origin main

echo.
echo ================================================
echo   ✓ Enviado com sucesso para o GitHub Pages!
echo   As alterações estarão no ar em cerca de 1 minuto.
echo ================================================
echo.
pause
