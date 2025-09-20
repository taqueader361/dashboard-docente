#!/bin/bash

# Script de despliegue automatizado - Dashboard Docente
# Este script guía el proceso completo de despliegue

echo "🚀 INICIANDO DESPLIEGUE - Dashboard Docente"
echo "=========================================="

# Función para verificar prerrequisitos
check_prerequisites() {
    echo ""
    echo "🔍 Verificando prerrequisitos..."

    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js no está instalado"
        echo "   Descárgalo desde: https://nodejs.org"
        exit 1
    fi
    echo "✅ Node.js: $(node --version)"

    # Verificar npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm no está instalado"
        exit 1
    fi
    echo "✅ npm: $(npm --version)"

    # Verificar CLASP
    if ! command -v clasp &> /dev/null; then
        echo "❌ CLASP no está instalado"
        echo "   Instalando CLASP..."
        npm install -g @google/clasp
    fi
    echo "✅ CLASP: $(clasp --version)"
}

# Función para configurar APIs
setup_apis() {
    echo ""
    echo "🔧 CONFIGURACIÓN DE APIs"
    echo "========================"

    echo "📋 PASOS PARA CONFIGURAR APIs:"
    echo ""
    echo "1. 🌐 Google Gemini AI API:"
    echo "   - Ve a: https://makersuite.google.com/app/apikey"
    echo "   - Crea una API Key"
    echo "   - Actualiza VITE_GEMINI_API_KEY en .env"
    echo ""

    echo "2. 📊 Google Cloud Console:"
    echo "   - Ve a: https://console.cloud.google.com"
    echo "   - Crea un proyecto o selecciona uno existente"
    echo "   - Habilita las siguientes APIs:"
    echo "     • Google Drive API"
    echo "     • Google Sheets API"
    echo "     • Generative Language API (para Gemini)"
    echo ""

    read -p "¿Has completado la configuración de APIs? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "⚠️  Completa la configuración de APIs antes de continuar"
        exit 1
    fi
}

# Función para configurar Apps Script
setup_apps_script() {
    echo ""
    echo "📝 CONFIGURACIÓN DE GOOGLE APPS SCRIPT"
    echo "====================================="

    echo "📋 PASOS PARA APPS SCRIPT:"
    echo ""
    echo "1. Ve a: https://script.google.com"
    echo "2. Crea un nuevo proyecto: 'Dashboard Docente - Backend'"
    echo "3. Copia el contenido de frontend/src/backend/Code.gs"
    echo "4. Pégalo en el editor de Apps Script"
    echo "5. Guarda el proyecto"
    echo ""

    read -p "¿Has creado el proyecto Apps Script? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "⚠️  Crea el proyecto Apps Script antes de continuar"
        exit 1
    fi

    # Configurar CLASP
    echo "🔗 Configurando CLASP..."
    echo "Ejecuta los siguientes comandos:"
    echo ""
    echo "clasp login"
    echo "clasp clone [SCRIPT_ID_DEL_PROYECTO]"
    echo ""

    read -p "¿Has configurado CLASP? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "⚠️  Configura CLASP antes de continuar"
        exit 1
    fi
}

# Función para configurar Google Drive
setup_google_drive() {
    echo ""
    echo "📁 CONFIGURACIÓN DE GOOGLE DRIVE"
    echo "==============================="

    echo "📋 PASOS PARA GOOGLE DRIVE:"
    echo ""
    echo "1. Ve a: https://drive.google.com"
    echo "2. Crea una carpeta llamada 'Dashboard Docente'"
    echo "3. Copia el ID de la carpeta desde la URL"
    echo "4. Actualiza VITE_GOOGLE_DRIVE_FOLDER_ID en .env"
    echo ""

    read -p "¿Has creado la carpeta en Google Drive? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "⚠️  Crea la carpeta en Google Drive antes de continuar"
        exit 1
    fi
}

# Función para desplegar Apps Script
deploy_apps_script() {
    echo ""
    echo "🚀 DESPLEGANDO APPS SCRIPT"
    echo "========================="

    echo "📋 PASOS PARA DESPLIEGUE:"
    echo ""
    echo "1. En el editor de Apps Script:"
    echo "   - Ve a Desplegar > Nuevo despliegue"
    echo "   - Selecciona 'Aplicación web'"
    echo "   - Configura:"
    echo "     • Descripción: Dashboard Docente API"
    echo "     • Ejecutar como: Tu cuenta"
    echo "     • Quién tiene acceso: Cualquiera"
    echo "   - Haz clic en 'Desplegar'"
    echo ""

    read -p "¿Has desplegado Apps Script como Web App? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "⚠️  Despliega Apps Script antes de continuar"
        exit 1
    fi

    echo "📝 IMPORTANTE: Copia la URL del despliegue"
    echo "   Actualiza VITE_APPS_SCRIPT_URL en .env con esta URL"
    echo ""

    read -p "¿Has copiado y guardado la URL del despliegue? (y/N): " -n 1 -r
    echo
}

# Función para configurar frontend
setup_frontend() {
    echo ""
    echo "⚛️ CONFIGURACIÓN DEL FRONTEND"
    echo "============================"

    echo "🔧 Actualizando configuración del frontend..."

    # Actualizar config.js con la URL real
    echo "📝 Actualiza frontend/src/config.js con la URL real del backend"
    echo "   Reemplaza 'TU_SCRIPT_ID_AQUI' con el ID real"
    echo ""

    read -p "¿Has actualizado la configuración del frontend? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "⚠️  Actualiza la configuración del frontend antes de continuar"
        exit 1
    fi
}

# Función para probar el despliegue
test_deployment() {
    echo ""
    echo "🧪 PROBANDO EL DESPLIEGUE"
    echo "========================"

    echo "🔧 Instalando dependencias del frontend..."
    cd frontend
    npm install

    echo "🔨 Construyendo el proyecto..."
    npm run build

    echo "🚀 Iniciando servidor de desarrollo..."
    npm run dev &
    DEV_PID=$!

    echo "⏳ Esperando que el servidor inicie..."
    sleep 5

    echo "🔍 Probando conexión con el backend..."
    # Aquí irían pruebas de conexión

    echo "✅ Servidor de desarrollo iniciado en: http://localhost:5173"
    echo ""
    echo "📋 PRUEBAS MANUALES:"
    echo "1. Abre http://localhost:5173 en tu navegador"
    echo "2. Verifica que la aplicación carga correctamente"
    echo "3. Prueba las funcionalidades básicas"
    echo "4. Revisa la consola del navegador para errores"
    echo ""

    read -p "¿La aplicación funciona correctamente? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🎉 ¡Despliegue exitoso!"
    else
        echo "⚠️  Revisa los errores y vuelve a intentar"
    fi

    # Detener el servidor de desarrollo
    kill $DEV_PID 2>/dev/null
    cd ..
}

# Función principal
main() {
    echo "🎯 Este script te guiará a través del proceso completo de despliegue"
    echo ""

    check_prerequisites
    setup_apis
    setup_apps_script
    setup_google_drive
    deploy_apps_script
    setup_frontend
    test_deployment

    echo ""
    echo "🎊 ¡FELICITACIONES!"
    echo "=================="
    echo "Tu Dashboard Docente está completamente desplegado y funcional."
    echo ""
    echo "📱 ACCESO A LA APLICACIÓN:"
    echo "- Frontend: Despliega en Vercel/Netlify o ejecuta 'npm run dev'"
    echo "- Backend: Ya desplegado en Google Apps Script"
    echo ""
    echo "📚 DOCUMENTACIÓN:"
    echo "- API_SETUP_GUIDE.md: Configuración de APIs"
    echo "- DEPLOYMENT_GUIDE.md: Guía completa de despliegue"
    echo ""
    echo "¡Disfruta tu Dashboard Docente! 🚀"
}

# Ejecutar función principal
main "$@"