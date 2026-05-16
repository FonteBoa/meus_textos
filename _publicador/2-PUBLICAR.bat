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

:: 1. Define a raiz do projeto (C:\TEXTOS\site) e gera os HTMLs
set RAIZ_PROJETO=%~dp0..
node "%~dp0publicar.js" "%RAIZ_PROJETO%"

:: 2. Entra na pasta correta onde as alterações foram feitas
cd /d "%RAIZ_PROJETO%"

:: 3. Sincroniza o computador com o site para evitar conflitos de rejeição
git pull origin main

:: 4. Adiciona os novos contos gerados à fila do Git
git add .

:: 5. Salva as alterações localmente em um commit automático
git commit -m "Publicando novos contos de forma automatica"

:: 6. Envia tudo para o servidor do GitHub
echo.
echo Enviando para o servidor do GitHub...
echo.
git push origin main

echo.
pause
