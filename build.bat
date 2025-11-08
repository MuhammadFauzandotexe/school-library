@echo off
echo ===============================
echo 🚀 Build Automation Started
echo ===============================

REM --- Set path dasar ---
set BASE_DIR=%~dp0
set FRONTEND_DIR=%BASE_DIR%school-library-frontend
set BACKEND_DIR=%BASE_DIR%school.library.backend

echo.
echo ===============================
echo 🧱 Step 1: Build Angular
echo ===============================
cd /d "%FRONTEND_DIR%"
call npm install
call npm run build -- --configuration production

if %errorlevel% neq 0 (
    echo ❌ Angular build failed!
    exit /b %errorlevel%
)

echo.
echo ===============================
echo 📂 Step 2: Copy Angular dist to Spring Boot static folder
echo ===============================
if exist "%BACKEND_DIR%\src\main\resources\static" rd /s /q "%BACKEND_DIR%\src\main\resources\static"
mkdir "%BACKEND_DIR%\src\main\resources\static"

xcopy /s /e /y "%FRONTEND_DIR%\dist\school-library-frontend\browser\*" "%BACKEND_DIR%\src\main\resources\static\"

echo.
echo ===============================
echo ☕ Step 3: Build Spring Boot JAR
echo ===============================
cd /d "%BACKEND_DIR%"
call mvn clean package -DskipTests

if %errorlevel% neq 0 (
    echo ❌ Spring Boot build failed!
    exit /b %errorlevel%
)

echo.
echo ===============================
echo 📦 Step 4: Copy JAR to root folder
echo ===============================
for /f "delims=" %%f in ('dir /b /s "%BACKEND_DIR%\target\*.jar"') do (
    copy "%%f" "%BASE_DIR%"
)

echo.
echo ===============================
echo ✅ Build Finished Successfully!
echo JAR copied to: %BASE_DIR%
echo ===============================
pause

java -jar .\school.library.backend-0.0.1-SNAPSHOT.jar