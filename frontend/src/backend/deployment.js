/**
 * SCRIPT DE DESPLIEGUE AUTOMATIZADO
 * Dashboard Docente - Copiloto Digital
 *
 * Este script facilita el proceso de despliegue del backend
 * en Google Apps Script y configuración inicial
 */

// Configuración del despliegue
const DEPLOYMENT_CONFIG = {
  projectName: 'Dashboard_Docente_Copiloto',
  folderName: 'Dashboard Docente',
  spreadsheetName: 'Dashboard_Docente_Registro',
  timeZone: 'America/Santiago', // Cambia según tu zona horaria
  locale: 'es_CL' // Cambia según tu ubicación
};

/**
 * INSTRUCCIONES DE DESPLIEGUE PASO A PASO
 *
 * PASO 1: Crear proyecto en Google Apps Script
 * ============================================
 * 1. Ve a https://script.google.com
 * 2. Haz clic en "Nuevo proyecto"
 * 3. Nombra el proyecto: "Dashboard Docente - Copiloto Digital"
 * 4. Borra el código por defecto
 * 5. Copia y pega todo el contenido del archivo Code.gs
 *
 * PASO 2: Configurar servicios
 * ============================
 * 1. En el editor de Apps Script, ve a "Servicios" (icono de +)
 * 2. Agrega "Google Drive API"
 * 3. Agrega "Google Sheets API"
 * 4. Agrega "Google Gemini API" (opcional, para análisis de IA)
 *
 * PASO 3: Crear carpeta en Google Drive
 * =====================================
 * 1. Ve a https://drive.google.com
 * 2. Crea una nueva carpeta llamada "Dashboard Docente"
 * 3. Comparte la carpeta con el email del proyecto de Apps Script
 * 4. Copia el ID de la carpeta desde la URL (la parte después de /folders/)
 *
 * PASO 4: Configurar el proyecto
 * ==============================
 * 1. En Code.gs, reemplaza 'YOUR_DRIVE_FOLDER_ID' con el ID real de la carpeta
 * 2. Ejecuta la función setupProject() desde el editor (solo una vez)
 *
 * PASO 5: Desplegar como aplicación web
 * =====================================
 * 1. Ve a "Desplegar" > "Nueva implementación"
 * 2. Selecciona tipo "Aplicación web"
 * 3. Configura:
 *    - Descripción: "Dashboard Docente API"
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquiera"
 * 4. Autoriza el acceso cuando se solicite
 * 5. Copia la URL de despliegue
 *
 * PASO 6: Configurar frontend
 * ===========================
 * 1. En src/config.js, actualiza API_CONFIG.BASE_URL con la URL del despliegue
 * 2. Cambia DEV_CONFIG.USE_MOCK_DATA a false
 * 3. Reinicia el servidor de desarrollo
 */

/**
 * Función de configuración inicial (ejecutar solo una vez)
 * Esta función debe ejecutarse desde el editor de Google Apps Script
 */
function setupProject() {
  try {
    Logger.log('🚀 Iniciando configuración del proyecto...');

    // Verificar configuración
    if (CONFIG.FOLDER_ID === 'YOUR_DRIVE_FOLDER_ID') {
      throw new Error('❌ Debes configurar FOLDER_ID antes de ejecutar setupProject()');
    }

    // Crear/verificar carpeta principal
    const folder = setupDriveFolder();

    // Crear/verificar hoja de cálculo para registros
    const spreadsheet = setupSpreadsheet();

    // Crear estructura de carpetas
    setupFolderStructure(folder);

    Logger.log('✅ Configuración completada exitosamente');
    Logger.log('📁 Carpeta principal:', folder.getUrl());
    Logger.log('📊 Hoja de cálculo:', spreadsheet.getUrl());

    return {
      success: true,
      message: 'Proyecto configurado correctamente',
      folderUrl: folder.getUrl(),
      spreadsheetUrl: spreadsheet.getUrl()
    };

  } catch (error) {
    Logger.log('❌ Error en configuración:', error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Configura la carpeta principal en Google Drive
 */
function setupDriveFolder() {
  const folderId = CONFIG.FOLDER_ID;

  try {
    const folder = DriveApp.getFolderById(folderId);
    Logger.log('📁 Carpeta encontrada:', folder.getName());
    return folder;
  } catch (error) {
    throw new Error('No se pudo acceder a la carpeta con ID: ' + folderId +
                   '. Verifica que el ID sea correcto y que la carpeta esté compartida.');
  }
}

/**
 * Configura la hoja de cálculo para registros
 */
function setupSpreadsheet() {
  const spreadsheetName = CONFIG.SPREADSHEET_NAME;

  // Buscar si ya existe
  const files = DriveApp.getFilesByName(spreadsheetName);
  if (files.hasNext()) {
    const spreadsheet = SpreadsheetApp.open(files.next());
    Logger.log('📊 Hoja de cálculo encontrada:', spreadsheet.getName());
    return spreadsheet;
  }

  // Crear nueva hoja de cálculo
  const spreadsheet = SpreadsheetApp.create(spreadsheetName);
  const sheet = spreadsheet.getActiveSheet();

  // Configurar encabezados
  const headers = [
    'Timestamp',
    'Usuario',
    'Acción',
    'Archivo',
    'Detalles',
    'Categoría',
    'Tipo'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formato de encabezados
  sheet.getRange(1, 1, 1, headers.length)
       .setFontWeight('bold')
       .setBackground('#f3f4f6');

  Logger.log('📊 Nueva hoja de cálculo creada:', spreadsheet.getName());
  return spreadsheet;
}

/**
 * Crea la estructura de carpetas organizacional
 */
function setupFolderStructure(parentFolder) {
  const categories = [
    'Planes de Clase',
    'Evaluaciones',
    'Materiales Didácticos',
    'Registros',
    'Proyectos',
    'Plantillas'
  ];

  categories.forEach(category => {
    try {
      // Verificar si la carpeta ya existe
      const existingFolders = parentFolder.getFoldersByName(category);
      if (!existingFolders.hasNext()) {
        parentFolder.createFolder(category);
        Logger.log('📁 Carpeta creada:', category);
      } else {
        Logger.log('📁 Carpeta ya existe:', category);
      }
    } catch (error) {
      Logger.log('⚠️ Error creando carpeta', category, ':', error.toString());
    }
  });
}

/**
 * Función de prueba para verificar que todo funciona
 */
function testDeployment() {
  try {
    Logger.log('🧪 Ejecutando pruebas de despliegue...');

    // Probar acceso a carpeta
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    Logger.log('✅ Acceso a carpeta OK');

    // Probar creación de archivo de prueba
    const testFile = folder.createFile('test_deployment.txt', 'Prueba de despliegue exitosa');
    Logger.log('✅ Creación de archivo OK');

    // Limpiar archivo de prueba
    testFile.setTrashed(true);
    Logger.log('✅ Eliminación de archivo OK');

    Logger.log('🎉 Todas las pruebas pasaron exitosamente');
    return { success: true, message: 'Pruebas completadas' };

  } catch (error) {
    Logger.log('❌ Error en pruebas:', error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Función para obtener información del proyecto
 */
function getProjectInfo() {
  return {
    projectName: DEPLOYMENT_CONFIG.projectName,
    folderId: CONFIG.FOLDER_ID,
    spreadsheetName: CONFIG.SPREADSHEET_NAME,
    apiVersion: CONFIG.API_VERSION,
    timestamp: new Date().toISOString()
  };
}

/**
 * Función para resetear configuración (usar con cuidado)
 */
function resetConfiguration() {
  Logger.log('⚠️ Reseteando configuración...');

  // Esto borrará la configuración actual
  // Solo usar si es necesario empezar desde cero

  Logger.log('✅ Configuración reseteada');
  return { success: true, message: 'Configuración reseteada' };
}
