@echo off
echo ============================================
echo   Quick Update to GitHub
echo ============================================
echo.
echo Repository: https://github.com/Chrismicrowave/VibeProtypeTest
echo.

REM Check for changes
git status

echo.
echo ============================================
set /p COMMIT_MSG="Enter commit message (or press Enter for default): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG="Updated game features"

echo.
echo Adding all changes...
git add .

echo.
echo Creating commit...
git commit -m "%COMMIT_MSG%"

echo.
echo Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed! Check your authentication.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   SUCCESS! Changes pushed to GitHub
echo ============================================
echo.
echo Your game will update in 1-2 minutes at:
echo   V1: https://chrismicrowave.github.io/VibeProtypeTest/v1/
echo   V2: https://chrismicrowave.github.io/VibeProtypeTest/v2/
echo.
echo Opening your live game...
start https://chrismicrowave.github.io/VibeProtypeTest/v1/
echo.
pause
