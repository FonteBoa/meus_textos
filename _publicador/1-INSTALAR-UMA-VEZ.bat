@echo off
chcp 65001 >nul
title fonteboa — instalação inicial

echo.
echo ╔══════════════════════════════════════════╗
echo ║   fonteboa — instalação inicial          ║
echo ║   Rode este arquivo apenas uma vez.      ║
echo ╚══════════════════════════════════════════╝
echo.

:: ── 1. Verifica winget ───────────────────────────────────────────
winget --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Este computador não tem o winget.
    echo Atualize o Windows para a versão 10 1809 ou superior,
    echo ou instale o Git manualmente em: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

:: ── 2. Instala Git ───────────────────────────────────────────────
echo [1/3] Verificando Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo       Git não encontrado. Instalando...
    winget install --id Git.Git -e --source winget --silent
    echo       Git instalado.
) else (
    echo       Git já instalado. OK.
)

:: ── 3. Instala Node.js ───────────────────────────────────────────
echo [2/3] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo       Node.js não encontrado. Instalando...
    winget install --id OpenJS.NodeJS.LTS -e --source winget --silent
    echo       Node.js instalado.
) else (
    echo       Node.js já instalado. OK.
)

:: ── 4. Configura Git (nome e email para os commits) ─────────────
echo [3/3] Configurando Git...
echo.
echo  Digite seu nome (aparecerá nos commits do GitHub):
set /p NOME_GIT=  Nome: 
echo  Digite seu email do GitHub:
set /p EMAIL_GIT=  Email: 

call refreshenv >nul 2>&1
git config --global user.name "%NOME_GIT%"
git config --global user.email "%EMAIL_GIT%"
git config --global core.autocrlf false

echo.
echo ══════════════════════════════════════════════
echo  Instalação concluída!
echo.
echo  Próximo passo: abra o arquivo
echo  LEIA-ME-CONFIGURACAO.txt para conectar
echo  a pasta do site ao seu repositório GitHub.
echo ══════════════════════════════════════════════
echo.
pause
