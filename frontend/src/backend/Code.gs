/**
 * Dashboard Docente - Copiloto Digital
 * Backend API usando Google Apps Script
 * Versión: 1.0
 * Fecha: 19 de septiembre de 2025
 */

// Configuración global
const CONFIG = {
  FOLDER_ID: 'YOUR_DRIVE_FOLDER_ID', // ID de la carpeta principal en Google Drive
  SPREADSHEET_NAME: 'Dashboard_Docente_Registro',
  API_VERSION: 'v1'
};

/**
 * Función principal que maneja las peticiones HTTP
 * @param {Object} e - Evento de la petición
 * @returns {Object} Respuesta JSON
 */
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;

    Logger.log('Nueva petición: ' + action);

    switch (action) {
      case 'getFiles':
        return ContentService
          .createTextOutput(JSON.stringify(getFiles(request)))
          .setMimeType(ContentService.MimeType.JSON);

      case 'createFile':
        return ContentService
          .createTextOutput(JSON.stringify(createFile(request)))
          .setMimeType(ContentService.MimeType.JSON);

      case 'updateFile':
        return ContentService
          .createTextOutput(JSON.stringify(updateFile(request)))
          .setMimeType(ContentService.MimeType.JSON);

      case 'deleteFile':
        return ContentService
          .createTextOutput(JSON.stringify(deleteFile(request)))
          .setMimeType(ContentService.MimeType.JSON);

      case 'getCategories':
        return ContentService
          .createTextOutput(JSON.stringify(getCategories()))
          .setMimeType(ContentService.MimeType.JSON);

      case 'saveCollaboration':
        return ContentService
          .createTextOutput(JSON.stringify(saveCollaboration(request)))
          .setMimeType(ContentService.MimeType.JSON);

      case 'getCollaborations':
        return ContentService
          .createTextOutput(JSON.stringify(getCollaborations(request)))
          .setMimeType(ContentService.MimeType.JSON);

      case 'analyzeWithAI':
        return ContentService
          .createTextOutput(JSON.stringify(analyzeWithAI(request)))
          .setMimeType(ContentService.MimeType.JSON);

      default:
        return ContentService
          .createTextOutput(JSON.stringify({
            success: false,
            error: 'Acción no reconocida: ' + action
          }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    Logger.log('Error en doPost: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para manejar peticiones GET (útil para testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Dashboard Docente API - ' + CONFIG.API_VERSION)
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Obtiene la lista de archivos del docente
 * @param {Object} request - Parámetros de filtrado
 * @returns {Object} Lista de archivos
 */
function getFiles(request) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    const files = folder.getFiles();
    const fileList = [];

    while (files.hasNext()) {
      const file = files.next();
      const fileData = {
        id: file.getId(),
        name: file.getName(),
        type: getFileType(file.getMimeType()),
        size: file.getSize(),
        dateModified: file.getLastUpdated().toISOString(),
        url: file.getUrl(),
        thumbnailUrl: getThumbnailUrl(file),
        course: extractCourseFromName(file.getName()),
        fileType: categorizeFile(file.getName(), file.getMimeType())
      };

      // Aplicar filtros si existen
      if (shouldIncludeFile(fileData, request.filters)) {
        fileList.push(fileData);
      }
    }

    return {
      success: true,
      data: fileList,
      total: fileList.length
    };

  } catch (error) {
    Logger.log('Error en getFiles: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Crea un nuevo archivo o duplica uno existente
 * @param {Object} request - Datos del archivo a crear
 * @returns {Object} Resultado de la operación
 */
function createFile(request) {
  try {
    const { name, type, content, templateId } = request.data;

    let newFile;

    if (templateId) {
      // Duplicar archivo existente
      const templateFile = DriveApp.getFileById(templateId);
      const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
      newFile = templateFile.makeCopy(name, folder);
    } else {
      // Crear archivo nuevo
      const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
      newFile = folder.createFile(name, content || '', getMimeType(type));
    }

    return {
      success: true,
      data: {
        id: newFile.getId(),
        name: newFile.getName(),
        url: newFile.getUrl()
      }
    };

  } catch (error) {
    Logger.log('Error en createFile: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Actualiza un archivo existente
 * @param {Object} request - Datos de actualización
 * @returns {Object} Resultado de la operación
 */
function updateFile(request) {
  try {
    const { id, content, name } = request.data;
    const file = DriveApp.getFileById(id);

    if (content) {
      file.setContent(content);
    }

    if (name) {
      file.setName(name);
    }

    return {
      success: true,
      data: {
        id: file.getId(),
        name: file.getName(),
        dateModified: file.getLastUpdated().toISOString()
      }
    };

  } catch (error) {
    Logger.log('Error en updateFile: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Elimina un archivo
 * @param {Object} request - ID del archivo a eliminar
 * @returns {Object} Resultado de la operación
 */
function deleteFile(request) {
  try {
    const file = DriveApp.getFileById(request.data.id);
    file.setTrashed(true);

    return {
      success: true,
      message: 'Archivo eliminado correctamente'
    };

  } catch (error) {
    Logger.log('Error en deleteFile: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Obtiene las categorías disponibles para filtrado
 * @returns {Object} Lista de categorías
 */
function getCategories() {
  return {
    success: true,
    data: {
      courses: [
        'Todos los Cursos',
        '5° Básico',
        '6° Básico',
        '7° Básico',
        '8° Básico'
      ],
      subjects: [
        'Todas',
        'Matemáticas',
        'Lenguaje',
        'Ciencias',
        'Historia',
        'Inglés'
      ],
      urgencies: [
        'Hoy',
        'Esta Semana',
        'Históricos'
      ]
    }
  };
}

/**
 * Guarda un registro de colaboración
 * @param {Object} request - Datos de la colaboración
 * @returns {Object} Resultado de la operación
 */
function saveCollaboration(request) {
  try {
    const { type, title, participants, notes, date } = request.data;

    const spreadsheet = getOrCreateSpreadsheet(CONFIG.SPREADSHEET_NAME);
    const sheet = spreadsheet.getSheetByName('Colaboraciones') || spreadsheet.insertSheet('Colaboraciones');

    // Agregar encabezados si no existen
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Fecha', 'Tipo', 'Título', 'Participantes', 'Notas', 'Timestamp']);
    }

    // Agregar nueva fila
    sheet.appendRow([
      date || new Date().toLocaleDateString(),
      type,
      title,
      participants.join(', '),
      notes,
      new Date().toISOString()
    ]);

    // Crear tarea de seguimiento si es codocencia
    if (type.toLowerCase().includes('codocencia')) {
      createFollowUpTask(title, notes);
    }

    return {
      success: true,
      message: 'Colaboración guardada correctamente'
    };

  } catch (error) {
    Logger.log('Error en saveCollaboration: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Obtiene registros de colaboraciones
 * @param {Object} request - Parámetros de filtrado
 * @returns {Object} Lista de colaboraciones
 */
function getCollaborations(request) {
  try {
    const spreadsheet = getOrCreateSpreadsheet(CONFIG.SPREADSHEET_NAME);
    const sheet = spreadsheet.getSheetByName('Colaboraciones');

    if (!sheet) {
      return {
        success: true,
        data: [],
        total: 0
      };
    }

    const data = sheet.getDataRange().getValues();
    const collaborations = [];

    // Saltar encabezado
    for (let i = 1; i < data.length; i++) {
      collaborations.push({
        date: data[i][0],
        type: data[i][1],
        title: data[i][2],
        participants: data[i][3],
        notes: data[i][4],
        timestamp: data[i][5]
      });
    }

    return {
      success: true,
      data: collaborations,
      total: collaborations.length
    };

  } catch (error) {
    Logger.log('Error en getCollaborations: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Analiza contenido usando IA (Google Gemini)
 * @param {Object} request - Contenido a analizar
 * @returns {Object} Resultado del análisis
 */
function analyzeWithAI(request) {
  try {
    const { content, action } = request.data;

    // Aquí se integraría con Google Gemini API
    // Por ahora, simulamos una respuesta
    let analysis = {};

    switch (action) {
      case 'categorize':
        analysis = {
          category: 'guía',
          course: extractCourseFromContent(content),
          subject: extractSubjectFromContent(content),
          urgency: 'week'
        };
        break;

      case 'generate_content':
        analysis = {
          generatedContent: generateContentFromTemplate(content),
          suggestions: ['Agregar más ejemplos', 'Incluir actividades prácticas']
        };
        break;

      case 'extract_tasks':
        analysis = {
          tasks: extractTasksFromNotes(content),
          priority: 'medium'
        };
        break;
    }

    return {
      success: true,
      data: analysis
    };

  } catch (error) {
    Logger.log('Error en analyzeWithAI: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// Funciones auxiliares

/**
 * Determina el tipo de archivo basado en el MIME type
 */
function getFileType(mimeType) {
  const typeMap = {
    'application/pdf': 'pdf',
    'application/vnd.google-apps.document': 'doc',
    'application/vnd.google-apps.presentation': 'ppt',
    'application/vnd.google-apps.spreadsheet': 'sheet',
    'image/': 'image'
  };

  for (const [key, value] of Object.entries(typeMap)) {
    if (mimeType.includes(key)) {
      return value;
    }
  }

  return 'file';
}

/**
 * Obtiene la URL de miniatura del archivo
 */
function getThumbnailUrl(file) {
  try {
    return 'https://drive.google.com/thumbnail?id=' + file.getId();
  } catch (error) {
    return 'https://via.placeholder.com/300x200/CCCCCC/666666?text=Sin+Imagen';
  }
}

/**
 * Extrae el curso del nombre del archivo usando IA básica
 */
function extractCourseFromName(fileName) {
  const coursePatterns = {
    '5°': '5° Básico',
    '6°': '6° Básico',
    '7°': '7° Básico',
    '8°': '8° Básico'
  };

  for (const [pattern, course] of Object.entries(coursePatterns)) {
    if (fileName.includes(pattern)) {
      return course;
    }
  }

  return 'Sin especificar';
}

/**
 * Categoriza el archivo como 'guía' o 'prueba'
 */
function categorizeFile(fileName, mimeType) {
  const name = fileName.toLowerCase();

  if (name.includes('prueba') || name.includes('evaluación') || name.includes('test')) {
    return 'prueba';
  }

  if (name.includes('guía') || name.includes('apunte') || name.includes('material')) {
    return 'guía';
  }

  // Por defecto, determinar por tipo de archivo
  if (mimeType.includes('presentation')) {
    return 'guía';
  }

  return 'guía'; // Default
}

/**
 * Verifica si un archivo debe incluirse según los filtros
 */
function shouldIncludeFile(fileData, filters) {
  if (!filters) return true;

  if (filters.course && filters.course !== 'Todos los Cursos' && fileData.course !== filters.course) {
    return false;
  }

  if (filters.subject && filters.subject !== 'Todas' && !fileData.name.toLowerCase().includes(filters.subject.toLowerCase())) {
    return false;
  }

  if (filters.search && !fileData.name.toLowerCase().includes(filters.search.toLowerCase())) {
    return false;
  }

  return true;
}

/**
 * Obtiene o crea una hoja de cálculo
 */
function getOrCreateSpreadsheet(name) {
  const files = DriveApp.getFilesByName(name);

  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  } else {
    return SpreadsheetApp.create(name);
  }
}

/**
 * Obtiene el MIME type basado en el tipo de archivo
 */
function getMimeType(type) {
  const mimeMap = {
    'pdf': 'application/pdf',
    'doc': 'application/vnd.google-apps.document',
    'ppt': 'application/vnd.google-apps.presentation',
    'txt': 'text/plain'
  };

  return mimeMap[type] || 'text/plain';
}

/**
 * Crea una tarea de seguimiento para codocencias
 */
function createFollowUpTask(title, notes) {
  // Aquí se podría integrar con Google Calendar o una lista de tareas
  Logger.log('Tarea de seguimiento creada: ' + title);
}

/**
 * Funciones de IA simuladas (se reemplazarán con Gemini API)
 */
function extractCourseFromContent(content) {
  // Lógica básica de extracción
  return '6° Básico'; // Placeholder
}

function extractSubjectFromContent(content) {
  // Lógica básica de extracción
  return 'Matemáticas'; // Placeholder
}

function generateContentFromTemplate(content) {
  // Lógica básica de generación
  return 'Contenido generado basado en: ' + content.substring(0, 50) + '...';
}

function extractTasksFromNotes(content) {
  // Lógica básica de extracción de tareas
  return ['Revisar objetivos', 'Preparar materiales', 'Coordinar con colegas'];
}
