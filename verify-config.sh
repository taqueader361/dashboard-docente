#!/bin/bash

# Script de verificación de configuración - Dashboard Docente
# Ejecuta este script para verificar que todas las configuraciones son correctas

echo "🚀 Verificando configuración del proyecto Dashboard Docente..."
echo "============================================================"

# Verificar que estamos en el directorio correcto
if [ ! -f ".env" ]; then
    echo "❌ Error: No se encuentra el archivo .env"
    echo "   Asegúrate de estar en la raíz del proyecto"
    exit 1
fi

echo "✅ Archivo .env encontrado"

# Verificar variables de entorno
echo ""
echo "🔧 Verificando variables de entorno..."

# Verificar API key de Gemini
GEMINI_KEY=$(grep "VITE_GEMINI_API_KEY" .env | cut -d'=' -f2)
if [ "$GEMINI_KEY" = "tu_api_key_aqui" ] || [ -z "$GEMINI_KEY" ]; then
    echo "❌ VITE_GEMINI_API_KEY: No configurada"
else
    echo "✅ VITE_GEMINI_API_KEY: Configurada"
fi

# Verificar URL de Apps Script
APPS_SCRIPT_URL=$(grep "VITE_APPS_SCRIPT_URL" .env | cut -d'=' -f2)
if [[ $APPS_SCRIPT_URL == *"TU_SCRIPT_ID_AQUI"* ]] || [ -z "$APPS_SCRIPT_URL" ]; then
    echo "❌ VITE_APPS_SCRIPT_URL: No configurada"
else
    echo "✅ VITE_APPS_SCRIPT_URL: Configurada"
fi

# Verificar archivos de configuración
echo ""
echo "📁 Verificando archivos de configuración..."

if [ -f "appsscript.json" ]; then
    echo "✅ appsscript.json: Presente"
else
    echo "❌ appsscript.json: No encontrado"
fi

if [ -f "frontend/src/config.js" ]; then
    echo "✅ frontend/src/config.js: Presente"
else
    echo "❌ frontend/src/config.js: No encontrado"
fi

if [ -f "frontend/src/backend/Code.gs" ]; then
    echo "✅ frontend/src/backend/Code.gs: Presente"
else
    echo "❌ frontend/src/backend/Code.gs: No encontrado"
fi

# Verificar dependencias del frontend
echo ""
echo "📦 Verificando dependencias del frontend..."

cd frontend
if [ -f "package.json" ]; then
    echo "✅ package.json: Presente"

    # Verificar si las dependencias están instaladas
    if [ -d "node_modules" ]; then
        echo "✅ node_modules: Presente"
    else
        echo "❌ node_modules: No encontrado (ejecuta: npm install)"
    fi
else
    echo "❌ package.json: No encontrado"
fi

# Verificar configuración de TypeScript
if [ -f "tsconfig.json" ]; then
    echo "✅ tsconfig.json: Presente"
else
    echo "❌ tsconfig.json: No encontrado"
fi

cd ..

# Verificar configuración de CLASP
echo ""
echo "🔗 Verificando configuración de CLASP..."

if [ -f ".clasp.json" ]; then
    echo "✅ .clasp.json: Presente"

    # Verificar si CLASP está instalado
    if command -v clasp &> /dev/null; then
        echo "✅ CLASP: Instalado"
    else
        echo "❌ CLASP: No instalado (ejecuta: npm install -g @google/clasp)"
    fi
else
    echo "❌ .clasp.json: No encontrado"
fi

echo ""
echo "📋 RESUMEN DE VERIFICACIÓN"
echo "=========================="

# Contar elementos configurados vs no configurados
CONFIGURADOS=$(grep -c "✅" <<< "$(echo "placeholder")")
NO_CONFIGURADOS=$(grep -c "❌" <<< "$(echo "placeholder")")

echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo "1. Si hay elementos marcados con ❌, configúralos según la guía"
echo "2. Una vez configurado todo, ejecuta: ./deploy.sh"
echo "3. Verifica que el despliegue funciona correctamente"

echo ""
echo "📖 RECURSOS DE AYUDA:"
echo "- API_SETUP_GUIDE.md: Guía completa de configuración"
echo "- DEPLOYMENT_GUIDE.md: Guía de despliegue"
echo "- START_DEPLOYMENT.md: Inicio rápido"

echo ""
echo "¡Configuración verificada! 🚀"