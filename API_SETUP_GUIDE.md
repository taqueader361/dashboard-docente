# 🚀 GUÍA DE CONFIGURACIÓN DE APIs - Dashboard Docente

## 📋 APIs Requeridas

### 1. ✅ Google Drive API
**Estado:** ✅ Automáticamente disponible en Apps Script
**Configuración:** No requiere configuración adicional
**Uso:** Gestión de archivos y carpetas

### 2. ✅ Google Sheets API
**Estado:** ✅ Automáticamente disponible en Apps Script
**Configuración:** No requiere configuración adicional
**Uso:** Registro de colaboraciones y datos

### 3. 🔧 Google Gemini AI API
**Estado:** 🔧 Requiere configuración manual
**Configuración:** Necesita API Key y configuración en Apps Script

---

## 🔧 PASOS PARA CONFIGURAR GEMINI AI API

### Paso 1: Obtener API Key de Gemini
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API key generada
5. **Importante:** Guarda esta key en un lugar seguro

### Paso 2: Actualizar Variables de Entorno
1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza `tu_api_key_aqui` con tu API key real:
```env
VITE_GEMINI_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuvw
```

### Paso 3: Configurar Apps Script (Opcional - para funcionalidades avanzadas)
Si deseas usar Gemini directamente desde Apps Script:

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Selecciona tu proyecto (o crea uno nuevo)
3. Ve a "APIs & Services" > "Library"
4. Busca y habilita:
   - "Generative Language API"
   - "Google Drive API"
   - "Google Sheets API"

---

## 🔧 PASOS PARA CONFIGURAR GOOGLE APPS SCRIPT

### Paso 1: Crear Proyecto Apps Script
1. Ve a [script.google.com](https://script.google.com)
2. Haz clic en "Nuevo proyecto"
3. Nombra el proyecto: "Dashboard Docente - Backend"
4. Copia todo el contenido del archivo `frontend/src/backend/Code.gs`
5. Pégalo en el editor de Apps Script

### Paso 2: Configurar Permisos
1. En el editor de Apps Script, ve a "Configuración del proyecto"
2. Asegúrate de que esté seleccionado "Mostrar manifiesto de appsscript.json"
3. El archivo `appsscript.json` ya está configurado con los permisos necesarios

### Paso 3: Probar el Proyecto
1. Haz clic en "Guardar" (ícono de disquete)
2. Haz clic en "Ejecutar" para probar que no hay errores
3. Autoriza los permisos solicitados

### Paso 4: Desplegar como Web App
1. Ve a "Desplegar" > "Nuevo despliegue"
2. Selecciona tipo "Aplicación web"
3. Configura:
   - **Descripción:** "Dashboard Docente API"
   - **Versión:** "1"
   - **Ejecutar como:** Tu cuenta
   - **Quién tiene acceso:** Cualquiera
4. Haz clic en "Desplegar"
5. **Copia la URL del despliegue** - la necesitarás para configurar el frontend

---

## 🔧 PASOS PARA CONFIGURAR GOOGLE DRIVE

### Paso 1: Crear Carpeta del Proyecto
1. Ve a [drive.google.com](https://drive.google.com)
2. Crea una nueva carpeta llamada "Dashboard Docente"
3. Comparte la carpeta (opcional - para compartir con otros docentes)
4. Copia el ID de la carpeta desde la URL:
   ```
   https://drive.google.com/drive/folders/[COPIA_ESTE_ID]
   ```

### Paso 2: Actualizar Configuración
1. Abre el archivo `frontend/src/backend/Code.gs`
2. Busca la línea con `CONFIG.FOLDER_ID`
3. Reemplaza `'YOUR_DRIVE_FOLDER_ID'` con el ID real de tu carpeta

---

## 🔧 PASOS PARA CONFIGURAR GOOGLE SHEETS

### Paso 1: Crear Hoja de Registro
1. Ve a [sheets.google.com](https://sheets.google.com)
2. Crea una nueva hoja llamada "Dashboard_Docente_Registro"
3. Configura las columnas necesarias:
   - Fecha
   - Docente
   - Archivo
   - Tipo de Colaboración
   - Descripción

### Paso 2: Compartir la Hoja
1. Haz clic en "Compartir" en la esquina superior derecha
2. Configura permisos de edición para tu cuenta
3. Copia el ID de la hoja desde la URL

---

## ✅ VERIFICACIÓN DE CONFIGURACIÓN

### Probar APIs desde Apps Script
1. En el editor de Apps Script, ejecuta esta función de prueba:
```javascript
function testAPIs() {
  // Probar Drive API
  const folder = DriveApp.getRootFolder();
  Logger.log('Drive API: OK');

  // Probar Sheets API
  const sheet = SpreadsheetApp.create('Test Sheet');
  Logger.log('Sheets API: OK');

  return 'Todas las APIs funcionan correctamente';
}
```

### Probar Conexión Frontend-Backend
1. Actualiza `frontend/src/config.js` con la URL real del despliegue
2. Ejecuta `npm run dev` en el directorio frontend
3. Verifica que no hay errores en la consola

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "API has not been used"
- Ve a Google Cloud Console
- Asegúrate de que las APIs estén habilitadas
- Espera 5-10 minutos para que los cambios surtan efecto

### Error: "ScriptError: Authorization is required"
- Autoriza los permisos cuando Apps Script lo solicite
- Asegúrate de que tu cuenta tenga permisos para las APIs

### Error: "Invalid API Key"
- Verifica que la API key de Gemini sea correcta
- Asegúrate de que no tenga espacios extra
- Comprueba que la API esté habilitada en tu proyecto

---

## 📞 SOPORTE

Si encuentras problemas:
1. Revisa los logs en Apps Script (Ver > Logs)
2. Verifica la consola del navegador para errores del frontend
3. Asegúrate de que todas las URLs y IDs sean correctos

¡Tu Dashboard Docente estará listo para usar una vez completada esta configuración! 🚀