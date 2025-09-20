// Configuración del backend para el frontend
// Actualiza API_BASE_URL con la URL de tu implementación de Google Apps Script

var CONFIG = {
  // URL base de la API de Google Apps Script
  // Reemplaza YOUR_SCRIPT_ID con el ID real de tu script
  API_BASE_URL: 'https://script.google.com/macros/s/AKfycbxZcWQ1aw3YH3_fND5MLN8tCe--WYkJtu7Q3tROAR8-akN64SUoZZIgsPKG8SO-Xhjlhg/exec',

  // Configuración de timeouts
  TIMEOUT: 30000, // 30 segundos

  // Configuración de reintentos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo

  // Configuración de paginación
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Tipos de archivo soportados
  SUPPORTED_FILE_TYPES: [
    'application/vnd.google-apps.presentation',
    'application/vnd.google-apps.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/pdf'
  ],

  // Configuración de Google Drive
  DRIVE_CONFIG: {
    DEFAULT_FOLDER: 'root',
    THUMBNAIL_SIZE: 's400'
  }
};

// Hacer CONFIG disponible globalmente
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}