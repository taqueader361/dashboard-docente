/**
 * CONFIGURACIÓN ACTUALIZADA - POST DESPLIEGUE
 * Dashboard Docente - Copiloto Digital
 *
 * Este archivo muestra cómo debe verse la configuración
 * después de completar el despliegue del backend
 */

// Configuración actualizada con URLs reales
export const API_CONFIG = {
  // URL real obtenida del despliegue de Google Apps Script
  BASE_URL: 'https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec',

  // Endpoints disponibles (no cambiar)
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

// Configuración OAuth actualizada
export const OAUTH_CONFIG = {
  // Credenciales reales de Google Cloud Console
  CLIENT_ID: '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
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

// Configuración de desarrollo y testing (DESPUÉS DEL DESPLIEGUE)
export const DEV_CONFIG = {
  // CAMBIAR A FALSE después del despliegue exitoso
  USE_MOCK_DATA: false,

  // Mostrar logs detallados en consola
  LOG_LEVEL: 'debug',

  // Configuración de testing
  TEST_MODE: false
};

/**
 * FUNCIONES DE UTILIDAD PARA CONFIGURACIÓN
 */

/**
 * Valida que la configuración esté completa y correcta
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
        value.includes('TU_') || value.includes('your_') || value.includes('123456789')) {
      return true;
    }
    return false;
  });

  if (missingFields.length > 0) {
    console.warn('⚠️ Configuración incompleta. Campos faltantes:', missingFields.map(f => f.path));
    console.warn('📝 Actualiza los valores en config.js antes de usar la aplicación');
    return false;
  }

  // Validar formato de URL
  const urlPattern = /^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/;
  if (!urlPattern.test(API_CONFIG.BASE_URL)) {
    console.warn('⚠️ Formato de URL de API inválido');
    console.warn('📝 Verifica que la URL tenga el formato correcto de Google Apps Script');
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
    dev: DEV_CONFIG
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

/**
 * Función para verificar la conexión con el backend
 * @returns {Promise<boolean>} True si la conexión es exitosa
 */
export const testBackendConnection = async () => {
  try {
    const response = await fetch(API_CONFIG.BASE_URL + '?action=test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'test' })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.success === true;

  } catch (error) {
    console.error('❌ Error de conexión con backend:', error);
    return false;
  }
};

/**
 * Función para cambiar entre modo mock y real
 * @param {boolean} useMock - True para usar datos mock
 */
export const setMockMode = (useMock) => {
  DEV_CONFIG.USE_MOCK_DATA = useMock;
  console.log(`🔄 Modo cambiado a: ${useMock ? 'MOCK DATA' : 'BACKEND REAL'}`);

  if (useMock) {
    console.log('📝 Usando datos de ejemplo para desarrollo');
  } else {
    console.log('🔗 Conectado con backend real de Google Apps Script');
  }
};

// Validar configuración al cargar
if (typeof window !== 'undefined') {
  const isValid = validateConfig();

  if (isValid) {
    console.log('✅ Configuración válida - Aplicación lista para usar');

    // Probar conexión automáticamente
    testBackendConnection().then(connected => {
      if (connected) {
        console.log('🔗 Backend conectado exitosamente');
      } else {
        console.warn('⚠️ No se pudo conectar con el backend');
        console.warn('💡 Cambiando automáticamente a modo mock');
        setMockMode(true);
      }
    });
  } else {
    console.warn('⚠️ Configuración inválida - Revisa los valores requeridos');
    console.warn('💡 Usando modo mock por defecto');
    setMockMode(true);
  }
}
