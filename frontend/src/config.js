/**
 * CONFIGURACIÓN DEL FRONTEND
 * Dashboard Docente - Copiloto Digital
 *
 * Este archivo contiene la configuración necesaria para conectar
 * el frontend con el backend de Google Apps Script
 */

// Configuración de la API
export const API_CONFIG = {
  // URL del despliegue de Google Apps Script
  // ✅ ACTUALIZADO: URL del despliegue @22 (V4 - Latest Code with Debug)
  BASE_URL: 'https://script.google.com/macros/s/AKfycbyINpZVWPBouIf7zxtQLuhnIDiZOUcqPTeMehOkCW81KIZoatBqmQPlPDxezgl1Ygscrg/exec',

  // Endpoints disponibles
  ENDPOINTS: {
    FILES: '?action=getFiles',
    CREATE_FILE: '?action=createFile',
    UPDATE_FILE: '?action=updateFile',
    DELETE_FILE: '?action=deleteFile',
    CATEGORIES: '?action=getCategories',
    SAVE_COLLABORATION: '?action=saveCollaboration',
    GET_COLLABORATIONS: '?action=getCollaborations',
    ANALYZE_AI: '?action=analyzeWithAI'
  },

  // Configuración de timeouts y reintentos
  TIMEOUT: 30000, // 30 segundos
  RETRIES: 3,

  // Configuración de desarrollo
  DEBUG: true
};

// Configuración de autenticación OAuth
export const OAUTH_CONFIG = {
  CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID',
  SCOPES: [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/script.external_request'
  ],
  REDIRECT_URI: window.location.origin
};

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'Dashboard Docente - Copiloto Digital',
  VERSION: '1.0.0',
  AUTHOR: 'Equipo de Desarrollo',

  // Configuración de UI
  THEME: {
    PRIMARY_COLOR: '#3B82F6',
    SECONDARY_COLOR: '#10B981',
    ACCENT_COLOR: '#F59E0B'
  },

  // Configuración de funcionalidades
  FEATURES: {
    ANNOTATIONS: true,
    AI_ANALYSIS: true,
    COLLABORATION_LOG: true,
    TEMPLATE_DUPLICATION: true
  }
};

// Configuración de Google Gemini AI
export const GEMINI_CONFIG = {
  // API Key de Google AI Studio
  API_KEY: import.meta.env.VITE_GEMINI_API_KEY || 'your_gemini_api_key_here',

  // Modelo a utilizar
  MODEL: 'gemini-1.5-flash',

  // Configuración de generación
  GENERATION_CONFIG: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },

  // Configuración de seguridad
  SAFETY_SETTINGS: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
};

// Configuración de desarrollo y testing
export const DEV_CONFIG = {
  // Usar datos mock cuando no hay backend disponible
  USE_MOCK_DATA: true,

  // Mostrar logs detallados en consola
  LOG_LEVEL: 'debug',

  // Configuración de testing
  TEST_MODE: false
};

/**
 * FUNCIONES DE UTILIDAD PARA CONFIGURACIÓN
 */

/**
 * Valida que la configuración esté completa
 * @returns {boolean} True si la configuración es válida
 */
export const validateConfig = () => {
  const requiredFields = [
    { path: 'API_CONFIG.BASE_URL', value: API_CONFIG.BASE_URL },
    { path: 'OAUTH_CONFIG.CLIENT_ID', value: OAUTH_CONFIG.CLIENT_ID }
  ];

  const missingFields = requiredFields.filter(field => {
    const value = field.value;
    if (value === undefined || value === 'YOUR_' + field.path.split('.')[1].toUpperCase() ||
        value.includes('TU_') || value.includes('your_')) {
      return true;
    }
    return false;
  });

  if (missingFields.length > 0) {
    console.warn('⚠️ Configuración incompleta. Campos faltantes:', missingFields.map(f => f.path));
    console.warn('📝 Actualiza los valores en config.js antes de usar la aplicación');
    return false;
  }

  return true;
};

/**
 * Obtiene la configuración completa
 * @returns {Object} Configuración completa
 */
export const getConfig = () => {
  return {
    api: API_CONFIG,
    oauth: OAUTH_CONFIG,
    app: APP_CONFIG,
    dev: DEV_CONFIG,
    gemini: GEMINI_CONFIG
  };
};

/**
 * Verifica si estamos en modo desarrollo
 * @returns {boolean} True si estamos en desarrollo
 */
export const isDevelopment = () => {
  return DEV_CONFIG.USE_MOCK_DATA || DEV_CONFIG.TEST_MODE;
};

/**
 * Obtiene la URL completa para un endpoint
 * @param {string} endpoint - Nombre del endpoint
 * @returns {string} URL completa
 */
export const getEndpointUrl = (endpoint) => {
  const endpointPath = API_CONFIG.ENDPOINTS[endpoint];
  if (!endpointPath) {
    throw new Error(`Endpoint no encontrado: ${endpoint}`);
  }
  return API_CONFIG.BASE_URL + endpointPath;
};

// Validar configuración al cargar
if (typeof window !== 'undefined') {
  validateConfig();
}
