#!/bin/bash

set -e
echo "============================================"
echo " BUILD FULL PROJECT: ANGULAR + SPRINGBOOT"
echo "============================================"

FRONTEND_DIR="/mnt/d/Muhammad-Fauzan/Deeeeeeeeeeeeeeeeeev/school-library/school-library-frontend"
BACKEND_DIR="/mnt/d/Muhammad-Fauzan/Deeeeeeeeeeeeeeeeeev/school-library/school.library.backend"
STATIC_DIR="$BACKEND_DIR/src/main/resources/static"

echo
echo "[1/4] Cleaning old build..."
rm -rf "$STATIC_DIR"
mkdir -p "$STATIC_DIR"

echo
echo "[2/4] Building Angular project..."
cd "$FRONTEND_DIR"
npm install
ng build --configuration production

echo
echo "[3/4] Copying Angular dist to Spring Boot static folder..."
cp -r "$FRONTEND_DIR/dist/school-library-frontend/browser/"* "$STATIC_DIR/"

echo
echo "[4/4] Building Spring Boot project..."
cd "$BACKEND_DIR"
mvn clean package -DskipTests

echo
echo " Build completed successfully!"
echo "JAR file generated at:"
ls -1 "$BACKEND_DIR/target/"*.jar
