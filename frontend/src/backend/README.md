# Backend - Dashboard Docente: Copiloto Digital

## 📋 Descripción

Este backend está construido con **Google Apps Script** y proporciona una API REST completa para el Dashboard Docente. Utiliza las APIs nativas de Google Workspace para una integración perfecta con Google Drive, Google Sheets y otros servicios.

## 🚀 Características Principales

- ✅ **API REST completa** con 8 endpoints principales
- ✅ **Integración nativa** con Google Drive y Google Sheets
- ✅ **Sistema de filtros avanzado** para archivos
- ✅ **Registro automático** de colaboraciones y codocencias
- ✅ **Preparado para IA** con Google Gemini API
- ✅ **Automatización inteligente** de tareas y seguimiento

## � Guía de Despliegue

> 📖 **Para instrucciones detalladas paso a paso, consulta:**
> **[DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)** - Guía completa de despliegue

### Despliegue Rápido

1. **Crear proyecto:** [script.google.com](https://script.google.com)
2. **Copiar código:** Todo el contenido de `Code.gs`
3. **Configurar APIs:** Drive, Sheets, Gemini
4. **Crear carpeta:** En Google Drive y compartir
5. **Desplegar:** Como aplicación web
6. **Conectar frontend:** Actualizar `config.js`

## �📁 Estructura del Proyecto

```
backend/
├── Code.gs              # Archivo principal de Google Apps Script
├── config.js            # Configuración y documentación
├── apiService.js        # Servicios para el frontend
├── deployment.js        # Scripts de despliegue automatizado
└── README.md           # Esta documentación
```

## ⚙️ Configuración Inicial

### Paso 1: Crear Proyecto en Google Apps Script

1. Ve a [https://script.google.com](https://script.google.com)
2. Haz clic en "Nuevo proyecto"
3. Nombra el proyecto: "Dashboard Docente - Backend"
4. Copia todo el contenido del archivo `Code.gs` en el editor

### Paso 2: Configurar Servicios

1. En el editor de Apps Script, ve a "Servicios" (icono de llave inglesa)
2. Agrega los siguientes servicios:
   - **Google Drive API**
   - **Google Sheets API**
   - **Google Gemini API** (opcional, para IA)

### Paso 3: Configurar Carpeta en Google Drive

1. Crea una carpeta llamada "Dashboard Docente" en tu Google Drive
2. Abre la carpeta y copia el ID de la URL:
   ```
   https://drive.google.com/drive/folders/[COPIA_ESTE_ID]
   ```
3. En `Code.gs`, actualiza la configuración:
   ```javascript
   const CONFIG = {
     FOLDER_ID: 'COPIA_ESTE_ID', // ← Aquí pega el ID
     SPREADSHEET_NAME: 'Dashboard_Docente_Registro',
     API_VERSION: 'v1'
   };
   ```

### Paso 4: Desplegar como Aplicación Web

1. En el editor, ve a "Desplegar" > "Nueva implementación"
2. Selecciona tipo: **Aplicación web**
3. Configura:
   - **Ejecutar como:** Tú (tu email)
   - **Quién tiene acceso:** Cualquiera
4. Haz clic en "Desplegar"
5. **Copia la URL de despliegue** (la necesitarás para el frontend)

### Paso 5: Configurar el Frontend

1. En el frontend, actualiza `src/backend/apiService.js`:
   ```javascript
   const API_CONFIG = {
     BASE_URL: 'TU_URL_DE_DESPLIEGUE', // ← Pega la URL aquí
     // ... resto de la configuración
   };
   ```

## 📡 Endpoints de la API

### GET /
- **Descripción:** Endpoint de prueba
- **Respuesta:** Información básica de la API

### POST / (Todos los endpoints usan POST)

#### 1. `getFiles`
Obtiene lista de archivos con filtros opcionales.

**Petición:**
```json
{
  "action": "getFiles",
  "filters": {
    "course": "6° Básico",
    "subject": "Matemáticas",
    "search": "fracciones"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "file_id",
      "name": "Fracciones 6°B",
      "type": "ppt",
      "fileType": "guía",
      "course": "6° Básico",
      "url": "https://drive.google.com/...",
      "thumbnailUrl": "https://drive.google.com/thumbnail?id=..."
    }
  ],
  "total": 1
}
```

#### 2. `createFile`
Crea nuevo archivo o duplica plantilla.

**Petición:**
```json
{
  "action": "createFile",
  "data": {
    "name": "Nueva Guía de Matemáticas",
    "type": "doc",
    "content": "Contenido de la guía...",
    "templateId": "optional_template_id"
  }
}
```

#### 3. `updateFile`
Actualiza archivo existente.

#### 4. `deleteFile`
Elimina archivo.

#### 5. `getCategories`
Obtiene categorías para filtros.

#### 6. `saveCollaboration`
Guarda registro de colaboración/codocencia.

**Petición:**
```json
{
  "action": "saveCollaboration",
  "data": {
    "type": "Codocencia",
    "title": "Revisión de objetivos 6°B",
    "participants": ["Prof. García", "Prof. López"],
    "notes": "Se discutieron los objetivos de aprendizaje...",
    "date": "2025-09-19"
  }
}
```

#### 7. `getCollaborations`
Obtiene registros de colaboraciones.

#### 8. `analyzeWithAI`
Analiza contenido con IA (Google Gemini).

## 🔧 Funcionalidades Especiales

### Sistema de Filtros Inteligente
- Filtrado por curso, asignatura y urgencia
- Búsqueda en tiempo real
- Categorización automática de archivos

### Registro de Colaboraciones
- Creación automática de hoja de cálculo
- Sistema "find-or-create" para hojas
- Seguimiento automático de tareas

### Integración con IA
- Análisis automático de contenido
- Categorización inteligente
- Generación de contenido basada en plantillas

## 🛠️ Desarrollo y Testing

### Testing Local
Puedes probar los endpoints usando herramientas como:
- **Postman**
- **Insomnia**
- **cURL**

### Logs y Debugging
- Los logs aparecen en la consola de Google Apps Script
- Usa `Logger.log()` para debugging
- Revisa los logs en "Ejecuciones" del editor

### Manejo de Errores
- Todos los endpoints incluyen manejo de errores
- Respuestas consistentes con campos `success` y `error`
- Logging detallado para troubleshooting

## 🔒 Seguridad

- **OAuth 2.0** para autenticación
- **Permisos granulares** por servicio
- **Validación de entrada** en todos los endpoints
- **Logs de auditoría** para operaciones sensibles

## 📈 Escalabilidad

- **Serverless** - No hay servidores que mantener
- **Auto-escalable** con Google Cloud
- **Integración nativa** con Google Workspace
- **Bajo costo** de mantenimiento

## 🚀 Próximos Pasos

1. **Integrar Google Gemini API** para funcionalidades de IA completas
2. **Agregar Google Calendar API** para gestión de eventos
3. **Implementar webhooks** para sincronización en tiempo real
4. **Crear sistema de backups** automáticos

## 📞 Soporte

Para soporte técnico:
1. Revisa los logs en Google Apps Script
2. Verifica la configuración de permisos
3. Consulta la documentación de Google Apps Script
4. Revisa la configuración del frontend

---

**Última actualización:** 19 de septiembre de 2025
**Versión:** 1.0
