# Backend - Google Apps Script

Este directorio contiene el código del backend implementado con Google Apps Script.

## Archivos

- `Code.gs`: Código principal del backend con todas las funciones API
- `README.md`: Esta documentación
- `config.js`: Configuración del frontend para conectar con el backend

## Despliegue

### 1. Crear un nuevo proyecto en Google Apps Script

1. Ve a [script.google.com](https://script.google.com)
2. Crea un nuevo proyecto
3. Copia el contenido de `Code.gs` al editor
4. Guarda el proyecto

### 2. Configurar permisos

1. Ve a "Editor" > "Manifesto" (appsscript.json)
2. Agrega los siguientes scopes:
   ```json
   {
     "oauthScopes": [
       "https://www.googleapis.com/auth/drive.readonly",
       "https://www.googleapis.com/auth/spreadsheets",
       "https://www.googleapis.com/auth/script.external_request"
     ]
   }
   ```

### 3. Desplegar como API web

1. Ve a "Desplegar" > "Nueva implementación"
2. Selecciona tipo "API ejecutable"
3. Configura:
   - Descripción: "Dashboard Docente API"
   - Ejecutar como: "Yo"
   - Quién tiene acceso: "Cualquier persona"
4. Copia la URL de la implementación

### 4. Configurar CORS (si es necesario)

Google Apps Script maneja CORS automáticamente para APIs web.

## Endpoints Disponibles

### GET /exec

#### Obtener archivos
```
?action=getFiles&folderId={folderId}&maxResults={maxResults}&query={query}
```

**Parámetros:**
- `folderId`: ID de la carpeta de Google Drive (opcional, default: root)
- `maxResults`: Número máximo de resultados (opcional, default: 20)
- `query`: Término de búsqueda (opcional)

**Respuesta:**
```json
{
  "success": true,
  "files": [
    {
      "id": "fileId",
      "name": "Nombre del archivo",
      "type": "guía|prueba|presentación|documento",
      "url": "https://drive.google.com/...",
      "thumbnailUrl": "https://drive.google.com/thumbnail?...",
      "lastModified": "2025-09-19T10:00:00.000Z",
      "size": 12345
    }
  ]
}
```

#### Obtener tareas
```
?action=getTasks
```

**Respuesta:**
```json
{
  "success": true,
  "tasks": [
    {
      "date": "2025-09-19T10:00:00.000Z",
      "title": "Título de la tarea",
      "description": "Descripción",
      "priority": "Alta|Media|Baja",
      "dueDate": "2025-09-20",
      "category": "Codocencia|Preparación|Evaluación",
      "status": "Pendiente|Completada"
    }
  ]
}
```

### POST /exec

#### Crear tarea
```
?action=createTask
Content-Type: application/json

{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "priority": "Alta",
  "dueDate": "2025-09-20",
  "category": "Codocencia"
}
```

#### Duplicar presentación
```
?action=duplicatePresentation&presentationId={fileId}&newName={newName}
```

## Configuración del Frontend

Actualiza `frontend/src/backend/config.js` con la URL de tu implementación:

```javascript
const API_BASE_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

## Seguridad

- La API usa OAuth 2.0 de Google automáticamente
- Solo el propietario del script puede modificar el código
- Los usuarios deben autenticarse con su cuenta de Google
- Los permisos están limitados a Drive y Sheets según los scopes configurados

## Manejo de Errores

Todos los endpoints devuelven respuestas en formato JSON con la estructura:

```json
{
  "success": true|false,
  "error": "Mensaje de error (solo si success=false)",
  "data": { ... } // Datos de respuesta (solo si success=true)
}
```

## Próximos Pasos

1. Implementar subida de archivos
2. Agregar funcionalidad de anotaciones
3. Integrar con Google Gemini API para IA
4. Agregar logging y monitoreo