/**
 * CONFIGURACIÓN DEL BACKEND
 * Dashboard Docente - Copiloto Digital
 *
 * INSTRUCCIONES DE CONFIGURACIÓN:
 *
 * 1. Crear un nuevo proyecto en Google Apps Script:
 *    - Ir a https://script.google.com
 *    - Crear un nuevo proyecto
 *    - Copiar el contenido de Code.gs
 *
 * 2. Configurar permisos:
 *    - En el editor de Apps Script, ir a "Servicios"
 *    - Agregar "Google Drive API" y "Google Sheets API"
 *
 * 3. Configurar carpeta en Google Drive:
 *    - Crear una carpeta llamada "Dashboard Docente" en Google Drive
 *    - Obtener el ID de la carpeta desde la URL
 *    - Reemplazar 'YOUR_DRIVE_FOLDER_ID' en CONFIG.FOLDER_ID
 *
 * 4. Desplegar como aplicación web:
 *    - En el editor, ir a "Desplegar" > "Nueva implementación"
 *    - Seleccionar tipo "Aplicación web"
 *    - Configurar permisos para "Cualquiera"
 *    - Copiar la URL de despliegue
 *
 * 5. Actualizar configuración en el frontend:
 *    - En el archivo de configuración del frontend, actualizar API_URL
 *    - con la URL obtenida en el paso anterior
 */

// Configuración que debe actualizarse
const BACKEND_CONFIG = {
  // ID de la carpeta principal en Google Drive donde se almacenan los archivos
  DRIVE_FOLDER_ID: 'YOUR_DRIVE_FOLDER_ID',

  // Nombre de la hoja de cálculo para registros de colaboración
  SPREADSHEET_NAME: 'Dashboard_Docente_Registro',

  // URLs de despliegues disponibles (actualizado: 20/09/2025)
  DEPLOYMENTS: {
    // Despliegue más reciente (@22) - ÚLTIMA VERSIÓN
    latest: {
      id: 'AKfycbyINpZVWPBouIf7zxtQLuhnIDiZOUcqPTeMehOkCW81KIZoatBqmQPlPDxezgl1Ygscrg',
      description: 'V4 - Latest Code with Debug',
      url: 'https://script.google.com/macros/s/AKfycbyINpZVWPBouIf7zxtQLuhnIDiZOUcqPTeMehOkCW81KIZoatBqmQPlPDxezgl1Ygscrg/exec',
      status: 'webapp_configured'
    },

    // Despliegue @12 - API Backend v1.1
    v11: {
      id: 'AKfycbwtFu9RfAVFoK0Yb4QuDyuWNQLnxIJCjk7027nFzIYraxiM3n9kajzOmQdAZHoGaSWCnQ',
      description: 'API Backend v1.1 - Validación completa',
      url: 'https://script.google.com/macros/s/AKfycbwtFu9RfAVFoK0Yb4QuDyuWNQLnxIJCjk7027nFzIYraxiM3n9kajzOmQdAZHoGaSWCnQ/exec',
      status: 'needs_webapp_config'
    },

    // Despliegue @11 - Anterior
    previous: {
      id: 'AKfycbxkcPlzfXkxCwM_1y_Abic8caL0h_dvl0ZqS9mQdnHoecZESnLrtFeSzKzMvfXMI9VAJw',
      description: 'Despliegue anterior',
      url: 'https://script.google.com/macros/s/AKfycbxkcPlzfXkxCwM_1y_Abic8caL0h_dvl0ZqS9mQdnHoecZESnLrtFeSzKzMvfXMI9VAJw/exec',
      status: 'needs_webapp_config'
    }
  },

  // URL activa actual (actualizada después de configurar Web App)
  DEPLOYMENT_URL: 'https://script.google.com/macros/s/AKfycbz3F1OIBiifR6XHOE0tYsY2zaTjD5HKOsJV9S5VNo2xDNBk8d9MCKHp2e7dTRElTRWU6w/exec',

  // Configuración de permisos
  PERMISSIONS: {
    drive: true,      // Acceso a Google Drive
    sheets: true,     // Acceso a Google Sheets
    calendar: false,  // Acceso a Google Calendar (opcional)
    gmail: false      // Acceso a Gmail (opcional)
  }
};

/**
 * ENDPOINTS DISPONIBLES:
 *
 * POST / (doPost)
 *
 * Acciones disponibles:
 * - getFiles: Obtiene lista de archivos con filtros
 * - createFile: Crea nuevo archivo o duplica existente
 * - updateFile: Actualiza archivo existente
 * - deleteFile: Elimina archivo
 * - getCategories: Obtiene categorías para filtros
 * - saveCollaboration: Guarda registro de colaboración
 * - getCollaborations: Obtiene registros de colaboraciones
 * - analyzeWithAI: Analiza contenido con IA
 *
 * Formato de petición:
 * {
 *   "action": "getFiles",
 *   "data": { ... },
 *   "filters": { ... }
 * }
 *
 * EJEMPLOS DE USO:
 *
 * 1. Obtener archivos:
 * {
 *   "action": "getFiles",
 *   "filters": {
 *     "course": "6° Básico",
 *     "subject": "Matemáticas",
 *     "search": "fracciones"
 *   }
 * }
 *
 * 2. Crear archivo:
 * {
 *   "action": "createFile",
 *   "data": {
 *     "name": "Nueva Guía de Matemáticas",
 *     "type": "doc",
 *     "content": "Contenido de la guía..."
 *   }
 * }
 *
 * 3. Guardar colaboración:
 * {
 *   "action": "saveCollaboration",
 *   "data": {
 *     "type": "Codocencia",
 *     "title": "Revisión de objetivos 6°B",
 *     "participants": ["Prof. García", "Prof. López"],
 *     "notes": "Se discutieron los objetivos de aprendizaje...",
 *     "date": "2025-09-19"
 *   }
 * }
 *
 * 4. Análisis con IA:
 * {
 *   "action": "analyzeWithAI",
 *   "data": {
 *     "content": "Objetivos: Resolver ecuaciones lineales...",
 *     "action": "categorize"
 *   }
 * }
 */

/**
 * CONFIGURACIÓN DEL FRONTEND
 *
 * Actualizar el archivo de configuración del frontend con:
 *
 * const API_CONFIG = {
 *   BASE_URL: 'YOUR_DEPLOYMENT_URL',
 *   ENDPOINTS: {
 *     FILES: '/?action=getFiles',
 *     CREATE_FILE: '/?action=createFile',
 *     UPDATE_FILE: '/?action=updateFile',
 *     DELETE_FILE: '/?action=deleteFile',
 *     CATEGORIES: '/?action=getCategories',
 *     SAVE_COLLABORATION: '/?action=saveCollaboration',
 *     GET_COLLABORATIONS: '/?action=getCollaborations',
 *     ANALYZE_AI: '/?action=analyzeWithAI'
 *   }
 * };
 */

export { BACKEND_CONFIG };
