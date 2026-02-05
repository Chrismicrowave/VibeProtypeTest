@echo off
echo ============================================
echo   Dice Game - GitHub Deployment Script
echo ============================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Git is installed. Proceeding...
echo.

REM Get GitHub username
set /p GITHUB_USER="Enter your GitHub username: "
if "%GITHUB_USER%"=="" (
    echo ERROR: Username cannot be empty!
    pause
    exit /b 1
)

REM Get repository name
set /p REPO_NAME="Enter repository name (default: vibetest): "
if "%REPO_NAME%"=="" set REPO_NAME=vibetest

echo.
echo ============================================
echo   Configuration
echo ============================================
echo GitHub Username: %GITHUB_USER%
echo Repository Name: %REPO_NAME%
echo Repository URL: https://github.com/%GITHUB_USER%/%REPO_NAME%
echo.
echo IMPORTANT: Please create this repository on GitHub first!
echo Go to: https://github.com/new
echo Repository name: %REPO_NAME%
echo Make it PUBLIC (for GitHub Pages)
echo Do NOT initialize with README
echo.
set /p CONFIRM="Have you created the repository? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo.
    echo Please create the repository first, then run this script again.
    pause
    exit /b 0
)

echo.
echo ============================================
echo   Initializing Git Repository
echo ============================================

REM Initialize git if not already done
if not exist ".git" (
    echo Initializing new git repository...
    git init
    echo.
)

REM Add all files
echo Adding files...
git add .
echo.

REM Commit
echo Creating commit...
git commit -m "Initial commit: Dice Board Game with v1 and v2 versions"
echo.

REM Rename branch to main
echo Renaming branch to main...
git branch -M main
echo.

REM Add remote
echo Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
echo.

REM Push to GitHub
echo ============================================
echo   Pushing to GitHub
echo ============================================
echo.
echo You may be asked to authenticate...
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo ============================================
    echo   ERROR: Push failed!
    echo ============================================
    echo.
    echo Common issues:
    echo 1. Repository doesn't exist - create it at: https://github.com/new
    echo 2. Authentication failed - you may need to set up a Personal Access Token
    echo    Go to: https://github.com/settings/tokens
    echo    Generate new token (classic) with 'repo' scope
    echo    Use the token as your password when pushing
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   SUCCESS! Repository pushed to GitHub
echo ============================================
echo.
echo Repository URL: https://github.com/%GITHUB_USER%/%REPO_NAME%
echo.
echo ============================================
echo   Enabling GitHub Pages
echo ============================================
echo.
echo To enable GitHub Pages (host your game):
echo 1. Go to: https://github.com/%GITHUB_USER%/%REPO_NAME%/settings/pages
echo 2. Under "Source", select "main" branch
echo 3. Click "Save"
echo 4. Wait 1-2 minutes
echo 5. Your game will be live at:
echo    - V1: https://%GITHUB_USER%.github.io/%REPO_NAME%/v1/
echo    - V2: https://%GITHUB_USER%.github.io/%REPO_NAME%/v2/
echo.
echo Opening GitHub Pages settings...
start https://github.com/%GITHUB_USER%/%REPO_NAME%/settings/pages
echo.
pause
