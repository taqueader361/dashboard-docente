# 🚀 GUÍA DE DESPLIEGUE - Dashboard Docente

## 📋 Lista de Verificación Pre-Despliegue

- [ ] Cuenta de Google con acceso a Google Drive
- [ ] Proyecto de Google Apps Script creado
- [ ] Carpeta en Google Drive preparada
- [ ] Credenciales OAuth configuradas (opcional)
## 🎉 ¡Despliegue Completado!

Una vez completados todos los pasos, tu **Dashboard Docente** estará conectado con Google Workspace y podrá:

- ✅ Gestionar archivos en Google Drive
- ✅ Registrar colaboraciones en Google Sheets
- ✅ Analizar contenido con IA (si configuraste Gemini)
- ✅ Funcionar sin datos mock

¡Tu aplicación está lista para usar! 🚀

---

## 🔧 CONFIGURACIÓN DE WEB APP PARA DESPLIEGUE EXISTENTE

### Problema Detectado
Los despliegues existentes (@13, @12, etc.) no están configurados como **Web Apps**, por lo que requieren autenticación de Google y no pueden ser usados como APIs públicas.

### Solución: Configurar Despliegue @13 como Web App

#### Paso 1: Acceder al Editor
1. Abre el proyecto en Google Apps Script:
   ```bash
   clasp open-script
   ```
2. Se abrirá en tu navegador el editor de Apps Script

#### Paso 2: Gestionar Despliegues
1. En el editor, haz clic en **"Desplegar"** (botón azul)
2. Selecciona **"Gestionar implementaciones"**

#### Paso 3: Configurar Despliegue @13
1. En la lista de despliegues, busca **"@13"** (API Backend v1.1)
2. Haz clic en el **icono de edición** (lápiz) junto a @13
3. En la ventana de configuración:
   - **Tipo:** Aplicación web
   - **Descripción:** API Backend v1.1 - Web App
   - **Versión:** @13 (latest)
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquiera
4. Haz clic en **"Guardar"**

#### Paso 4: Obtener URL de Web App
1. Después de guardar, copia la **URL de la aplicación web**
2. Debería verse así:
   ```
   https://script.google.com/macros/s/AKfycbxZcWQ1aw3YH3_fND5MLN8tCe--WYkJtu7Q3tROAR8-akN64SUoZZIgsPKG8SO-Xhjlhg/exec
   ```

#### Paso 5: Probar Web App
1. Abre una nueva pestaña en tu navegador
2. Pega la URL y agrega `?action=test`:
   ```
   https://script.google.com/macros/s/AKfycbxZcWQ1aw3YH3_fND5MLN8tCe--WYkJtu7Q3tROAR8-akN64SUoZZIgsPKG8SO-Xhjlhg/exec?action=test
   ```
3. Deberías ver una respuesta JSON (no una página de login)

#### Paso 6: Actualizar Configuración Frontend
1. Abre `src/backend/config.js`
2. Actualiza la URL del despliegue @13:
   ```javascript
   DEPLOYMENTS: {
     "@13": "https://script.google.com/macros/s/AKfycbxZcWQ1aw3YH3_fND5MLN8tCe--WYkJtu7Q3tROAR8-akN64SUoZZIgsPKG8SO-Xhjlhg/exec",
     // ... otros despliegues
   }
   ```

### Repetir para Otros Despliegues
Repite los pasos 3-6 para cada despliegue que necesites configurar como Web App:
- @12 (API Backend v1.0)
- @11 y anteriores si es necesario

### Verificación Final
Una vez configurados todos los despliegues como Web Apps:
1. Ejecuta las pruebas del frontend:
   ```bash
   npm run test-api
   ```
2. Verifica que todos los endpoints respondan correctamente
3. Confirma que no hay páginas de autenticación

### Solución de Problemas
Si aún ves páginas de login:
- Verifica que "Quién tiene acceso" esté configurado como "Cualquiera"
- Asegúrate de que el despliegue esté usando la versión correcta
- Revisa que la URL en la configuración del frontend sea correcta 📝 PASO 1: Preparar Google Drive

### 1.1 Crear Carpeta Principal
1. Ve a [Google Drive](https://drive.google.com)
2. Haz clic en **"Nuevo"** → **"Carpeta"**
3. Nombra la carpeta: `Dashboard Docente`
4. **IMPORTANTE:** Comparte la carpeta con permisos de edición
   - Haz clic derecho en la carpeta → **"Compartir"**
   - Agrega el email del proyecto de Apps Script (lo obtendrás después)

### 1.2 Obtener ID de la Carpeta
1. Abre la carpeta `Dashboard Docente`
2. Mira la URL en tu navegador
3. Copia el ID (la parte después de `/folders/`):
   ```
   https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P
   ```
   **ID:** `1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P`

---

## 📝 PASO 2: Configurar Google Apps Script

### 2.1 Crear Proyecto
1. Ve a [Google Apps Script](https://script.google.com)
2. Haz clic en **"Nuevo proyecto"**
3. Nombra el proyecto: `Dashboard Docente - Copiloto Digital`
4. Borra todo el código por defecto

### 2.2 Copiar Código
1. Abre el archivo `src/backend/Code.gs` en tu editor
2. Copia TODO el contenido
3. Pégalo en el editor de Apps Script

### 2.3 Configurar Servicios
1. En el editor, ve a **"Servicios"** (icono de **+**)
2. Agrega estos servicios uno por uno:
   - **Google Drive API**
   - **Google Sheets API**
   - **Google Gemini API** (opcional, para IA)

### 2.4 Actualizar Configuración
1. En el código de Apps Script, busca esta línea:
   ```javascript
   FOLDER_ID: 'YOUR_DRIVE_FOLDER_ID'
   ```
2. Reemplaza con el ID real de tu carpeta:
   ```javascript
   FOLDER_ID: '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P'
   ```

---

## 📝 PASO 3: Configurar Permisos

### 3.1 Compartir Carpeta
1. Regresa a Google Drive
2. Abre la carpeta `Dashboard Docente`
3. Haz clic en **"Compartir"**
4. En el editor de Apps Script, ve a **"Configuración del proyecto"**
5. Copia el **"ID del proyecto"**
6. Comparte la carpeta con: `project-id@appspot.gserviceaccount.com`

### 3.2 Autorizar APIs
1. En Apps Script, ejecuta cualquier función (como `getProjectInfo()`)
2. Google te pedirá autorización
3. Haz clic en **"Autorizar acceso"**
4. Selecciona tu cuenta de Google
5. Revisa los permisos y acepta

---

## 📝 PASO 4: Ejecutar Configuración Inicial

### 4.1 Configurar Proyecto
1. En el editor de Apps Script, ejecuta la función:
   ```javascript
   setupProject()
   ```
2. Revisa los logs para confirmar que todo funcionó
3. Deberías ver URLs de la carpeta y hoja de cálculo creadas

### 4.2 Probar Funcionalidades
1. Ejecuta la función de prueba:
   ```javascript
   testDeployment()
   ```
2. Confirma que todas las pruebas pasan

---

## 📝 PASO 5: Desplegar como Aplicación Web

### 5.1 Crear Despliegue
1. En Apps Script, ve a **"Desplegar"** → **"Nueva implementación"**
2. Selecciona tipo: **"Aplicación web"**
3. Configura:
   - **Descripción:** `Dashboard Docente API v1.0`
   - **Ejecutar como:** `Yo`
   - **Quién tiene acceso:** `Cualquiera`
4. Haz clic en **"Desplegar"**

### 5.2 Copiar URL de Despliegue
1. Después del despliegue, copia la **URL de la aplicación web**
2. Debería verse así:
   ```
   https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   ```

### 5.3 Probar Endpoint
1. Abre una nueva pestaña
2. Pega la URL y agrega `?action=test`:
   ```
   https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=test
   ```
3. Deberías ver una respuesta JSON

---

## 📝 PASO 6: Configurar Frontend

### 6.1 Actualizar Configuración
1. Abre `src/config.js`
2. Actualiza la URL base:
   ```javascript
   API_CONFIG.BASE_URL = 'https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec'
   ```

### 6.2 Deshabilitar Datos Mock
1. En el mismo archivo, cambia:
   ```javascript
   DEV_CONFIG.USE_MOCK_DATA = false
   ```

### 6.3 Reiniciar Servidor
1. Detén el servidor de desarrollo (Ctrl+C)
2. Ejecuta nuevamente:
   ```bash
   npm run dev
   ```

---

## 🔍 Verificación Final

### Checklist de Verificación
- [ ] Carpeta en Google Drive creada y compartida
- [ ] Proyecto de Apps Script configurado
- [ ] Servicios API agregados
- [ ] Función `setupProject()` ejecutada exitosamente
- [ ] Despliegue como aplicación web completado
- [ ] URL de despliegue copiada
- [ ] Configuración del frontend actualizada
- [ ] Servidor reiniciado
- [ ] Aplicación carga archivos reales

### Probar Funcionalidades
1. **Cargar archivos:** Deberías ver archivos reales de Google Drive
2. **Crear archivo:** Los nuevos archivos deberían aparecer en Drive
3. **Filtros:** Las categorías deberían funcionar con datos reales
4. **Colaboración:** Los registros deberían guardarse en Sheets

---

## 🐛 Solución de Problemas

### Error: "No se pudo acceder a la carpeta"
- Verifica que el ID de la carpeta sea correcto
- Confirma que la carpeta esté compartida con el proyecto
- Revisa que tengas permisos de edición

### Error: "API no autorizada"
- Ve a "Servicios" en Apps Script
- Agrega las APIs faltantes
- Reautoriza el proyecto

### Error: "CORS policy"
- Asegúrate de que el despliegue sea "Cualquiera"
- Verifica que la URL del frontend esté en los orígenes permitidos

### Aplicación no carga datos reales
- Confirma que `USE_MOCK_DATA = false`
- Verifica que la URL de la API sea correcta
- Revisa la consola del navegador por errores

---

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. Revisa los logs en Apps Script (Ver → Logs)
2. Verifica la consola del navegador (F12 → Console)
3. Confirma que todas las APIs estén autorizadas
4. Asegúrate de que la carpeta esté correctamente compartida

---

## � PASO CRÍTICO: Configurar como Web App

### ⚠️ IMPORTANTE
**SIN ESTE PASO, LOS ENDPOINTS DE API NO FUNCIONARÁN**

Los despliegues de Google Apps Script deben configurarse como **Web Apps ejecutables** para ser accesibles vía HTTP.

### Configuración Paso a Paso

1. **Abrir Editor de Apps Script**:
   ```bash
   cd backend/
   clasp open-script
   ```

2. **Crear Despliegue Web App**:
   - Ve a **"Desplegar"** → **"Nueva implementación"**
   - Selecciona tipo **"Aplicación web"**
   - Configura permisos:
     - **Ejecutar como:** `Tú (tu email)`
     - **Quién tiene acceso:** `Cualquier usuario (incluyendo anónimos)`

3. **Obtener URL de Producción**:
   - Después de guardar, copia la **URL de producción**
   - Formato: `https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec`

### Verificar Configuración

Prueba el endpoint de conexión:
```bash
curl "https://script.google.com/macros/s/[TU_DEPLOYMENT_ID]/exec?action=test"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Conexión exitosa",
  "timestamp": "2025-09-20T..."
}
```

### Despliegues Actuales (20/09/2025)

| Despliegue | ID | Estado | URL |
|------------|----|--------|-----|
| @13 | AKfycbxZcWQ1aw3YH3_fND5MLN8tCe--WYkJtu7Q3tROAR8-akN64SUoZZIgsPKG8SO-Xhjlhg | ❌ Pendiente Web App | - |
| @12 | AKfycbwtFu9RfAVFoK0Yb4QuDyuWNQLnxIJCjk7027nFzIYraxiM3n9kajzOmQdAZHoGaSWCnQ | ❌ Pendiente Web App | - |
| @11 | AKfycbxkcPlzfXkxCwM_1y_Abic8caL0h_dvl0ZqS9mQdnHoecZESnLrtFeSzKzMvfXMI9VAJw | ❌ Pendiente Web App | - |

### Endpoints Disponibles

Una vez configurado como Web App, estarán disponibles:

- `?action=test` - Prueba de conexión
- `?action=getFiles` - Obtener archivos de Drive
- `?action=getTasks` - Obtener tareas
- `?action=createTask` - Crear nueva tarea
- `?action=uploadFile` - Subir archivo
- `?action=duplicatePresentation` - Duplicar presentación
- `?action=saveAnnotation` - Guardar anotación

### Actualizar Frontend

Después de configurar la Web App, actualiza `src/backend/config.js`:
```javascript
DEPLOYMENT_URL: 'https://script.google.com/macros/s/[TU_DEPLOYMENT_ID]/exec'
```

---

## �🎉 ¡Despliegue Completado!

Una vez completados todos los pasos, tu **Dashboard Docente** estará conectado con Google Workspace y podrá:

- ✅ Gestionar archivos en Google Drive
- ✅ Registrar colaboraciones en Google Sheets
- ✅ Analizar contenido con IA (si configuraste Gemini)
- ✅ Funcionar sin datos mock

¡Tu aplicación está lista para usar! 🚀
