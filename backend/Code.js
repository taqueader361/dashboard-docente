// Google Apps Script Backend para Dashboard Docente
// Este archivo maneja las APIs para Google Drive y Google Sheets

function doGet(e) {
  const action = e.parameter.action;

  switch(action) {
    case 'getFiles':
      return getDriveFiles(e);
    case 'createTask':
      return createTask(e);
    case 'getTasks':
      return getTasks(e);
    case 'test':
      return ContentService
        .createTextOutput('{"success": true, "message": "Conexión exitosa", "timestamp": "' + new Date().toISOString() + '"}')
        .setMimeType(ContentService.MimeType.JSON);
    default:
      return ContentService
        .createTextOutput(JSON.stringify({error: 'Acción no válida'}))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  // Intentar obtener action de los parámetros de URL primero
  let action = e.parameter.action;

  // Si no está en URL, intentar obtenerlo del body JSON
  if (!action && e.postData && e.postData.contents) {
    try {
      const data = JSON.parse(e.postData.contents);
      action = data.action;
    } catch (error) {
      // Si no se puede parsear JSON, continuar sin action
    }
  }

  switch(action) {
    case 'getFiles':
      return getDriveFiles(e);
    case 'uploadFile':
      return uploadFile(e);
    case 'duplicatePresentation':
      return duplicatePresentation(e);
    case 'saveAnnotation':
      return saveAnnotation(e);
    case 'getCategories':
      return getCategories(e);
    case 'createFile':
      return createFile(e);
    case 'updateFile':
      return updateFile(e);
    case 'deleteFile':
      return deleteFile(e);
    case 'saveCollaboration':
      return saveCollaboration(e);
    case 'getCollaborations':
      return getCollaborations(e);
    case 'analyzeWithAI':
      return analyzeWithAI(e);
    default:
      return ContentService
        .createTextOutput(JSON.stringify({error: 'Acción no válida'}))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================== FUNCIONES DE UTILIDAD ====================

/**
 * Función de utilidad para crear respuestas JSON estandarizadas
 * @param {boolean} success - Si la operación fue exitosa
 * @param {any} data - Datos a incluir en la respuesta
 * @param {string} error - Mensaje de error (si success=false)
 * @returns {TextOutput} Respuesta JSON para Google Apps Script
 */
function createJsonResponse(success, data = null, error = null) {
  const response = { success };

  if (success && data) {
    Object.assign(response, data);
  } else if (!success && error) {
    response.error = error;
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Función de utilidad para logging estandarizado
 * @param {string} level - Nivel del log (INFO, ERROR, WARN)
 * @param {string} message - Mensaje a loggear
 * @param {any} data - Datos adicionales (opcional)
 */
function logMessage(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level}: ${message}`;

  if (data) {
    console.log(logEntry, JSON.stringify(data, null, 2));
  } else {
    console.log(logEntry);
  }
}

/**
 * Función de utilidad para validar parámetros requeridos
 * @param {Object} params - Objeto con los parámetros a validar
 * @param {Array} required - Array con los nombres de parámetros requeridos
 * @returns {string|null} Nombre del primer parámetro faltante, o null si todos están presentes
 */
function validateRequiredParams(params, required) {
  for (const param of required) {
    if (!params[param] || params[param] === '') {
      return param;
    }
  }
  return null;
}

// ==================== FUNCIONES DEL API ====================

// Función para obtener archivos de Google Drive
function getDriveFiles(e) {
  try {
    logMessage('INFO', 'getDriveFiles called', { parameters: e.parameter });

    const folderId = e.parameter.folderId || 'root';
    const maxResults = parseInt(e.parameter.maxResults) || 20;
    const query = e.parameter.query || '';

    logMessage('INFO', 'Processing getDriveFiles', { folderId, maxResults, query });

    const folder = folderId === 'root' ? DriveApp.getRootFolder() : DriveApp.getFolderById(folderId);
    const files = folder.getFiles();

    const fileList = [];
    let count = 0;

    while (files.hasNext() && count < maxResults) {
      const file = files.next();

      // Filtrar por consulta si existe
      if (query && !file.getName().toLowerCase().includes(query.toLowerCase())) {
        continue;
      }

      // Solo archivos de presentación y documentos
      const mimeType = file.getMimeType();
      if (!['application/vnd.google-apps.presentation',
            'application/vnd.google-apps.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/pdf'].includes(mimeType)) {
        continue;
      }

      fileList.push({
        id: file.getId(),
        name: file.getName(),
        type: getFileType(file.getName(), mimeType),
        url: file.getUrl(),
        thumbnailUrl: getThumbnailUrl(file),
        lastModified: file.getLastUpdated().toISOString(),
        size: file.getSize()
      });

      count++;
    }

    logMessage('INFO', 'getDriveFiles completed successfully', { fileCount: fileList.length });
    return createJsonResponse(true, { files: fileList });

  } catch (error) {
    logMessage('ERROR', 'Error in getDriveFiles', { error: error.message });
    return createJsonResponse(false, null, 'Error al obtener archivos: ' + error.message);
  }
}

// Función auxiliar para determinar el tipo de archivo
function getFileType(fileName, mimeType) {
  const name = fileName.toLowerCase();

  if (name.includes('guía') || name.includes('material') || name.includes('apunte')) {
    return 'guía';
  } else if (name.includes('prueba') || name.includes('evaluación') || name.includes('examen')) {
    return 'prueba';
  } else if (mimeType.includes('presentation')) {
    return 'presentación';
  } else {
    return 'documento';
  }
}

// Función auxiliar para obtener URL de miniatura
function getThumbnailUrl(file) {
  try {
    return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=s400';
  } catch (e) {
    return 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=' + encodeURIComponent(file.getName().substring(0, 10));
  }
}

// Función para crear una tarea en Google Sheets
function createTask(e) {
  try {
    const taskData = JSON.parse(e.postData.contents);
    const { title, description, priority, dueDate, category } = taskData;

    // Buscar o crear hoja de cálculo de tareas
    const spreadsheet = getOrCreateTaskSpreadsheet();
    const sheet = spreadsheet.getSheets()[0];

    // Agregar nueva fila
    const lastRow = sheet.getLastRow() + 1;
    sheet.getRange(lastRow, 1).setValue(new Date().toISOString());
    sheet.getRange(lastRow, 2).setValue(title);
    sheet.getRange(lastRow, 3).setValue(description);
    sheet.getRange(lastRow, 4).setValue(priority);
    sheet.getRange(lastRow, 5).setValue(dueDate);
    sheet.getRange(lastRow, 6).setValue(category);
    sheet.getRange(lastRow, 7).setValue('Pendiente');

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Tarea creada exitosamente'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para obtener tareas
function getTasks(e) {
  try {
    const spreadsheet = getOrCreateTaskSpreadsheet();
    const sheet = spreadsheet.getSheets()[0];
    const data = sheet.getDataRange().getValues();

    const tasks = data.slice(1).map(row => ({
      date: row[0],
      title: row[1],
      description: row[2],
      priority: row[3],
      dueDate: row[4],
      category: row[5],
      status: row[6]
    }));

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        tasks: tasks
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función auxiliar para obtener o crear hoja de cálculo de tareas
function getOrCreateTaskSpreadsheet() {
  const spreadsheetName = 'Dashboard Docente - Tareas';

  // Buscar hoja existente
  const files = DriveApp.getFilesByName(spreadsheetName);
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  }

  // Crear nueva hoja si no existe
  const spreadsheet = SpreadsheetApp.create(spreadsheetName);
  const sheet = spreadsheet.getSheets()[0];

  // Agregar encabezados
  sheet.getRange(1, 1).setValue('Fecha');
  sheet.getRange(1, 2).setValue('Título');
  sheet.getRange(1, 3).setValue('Descripción');
  sheet.getRange(1, 4).setValue('Prioridad');
  sheet.getRange(1, 5).setValue('Fecha Límite');
  sheet.getRange(1, 6).setValue('Categoría');
  sheet.getRange(1, 7).setValue('Estado');

  return spreadsheet;
}

// Función para duplicar presentación
function duplicatePresentation(e) {
  try {
    const presentationId = e.parameter.presentationId;
    const newName = e.parameter.newName;

    const originalFile = DriveApp.getFileById(presentationId);
    const folder = originalFile.getParents().next();

    const copy = originalFile.makeCopy(newName || originalFile.getName() + ' (Copia)', folder);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        newFileId: copy.getId(),
        newFileUrl: copy.getUrl()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para guardar anotación (placeholder)
function saveAnnotation(e) {
  // Implementar lógica para guardar anotaciones
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Anotación guardada (placeholder)'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función para subir archivo (placeholder)
function uploadFile(e) {
  // Implementar lógica para subir archivos
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Archivo subido (placeholder)'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función para obtener categorías
function getCategories(e) {
  try {
    // Implementar lógica para obtener categorías de archivos
    const categories = [
      { id: 'presentations', name: 'Presentaciones', count: 0 },
      { id: 'documents', name: 'Documentos', count: 0 },
      { id: 'pdfs', name: 'PDFs', count: 0 }
    ];

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        categories: categories
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para crear archivo
function createFile(e) {
  try {
    logMessage('INFO', 'createFile called', { parameters: e.parameter });

    const name = e.parameter.name || 'Nuevo Documento';
    const type = e.parameter.type || 'document';

    logMessage('INFO', 'Creating file', { name, type });

    // Crear archivo según el tipo
    let file;
    if (type === 'presentation') {
      file = SlidesApp.create(name);
    } else {
      file = DocumentApp.create(name);
    }

    logMessage('INFO', 'File created successfully', { fileId: file.getId() });
    return createJsonResponse(true, {
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      message: 'Archivo creado exitosamente'
    });
  } catch (error) {
    logMessage('ERROR', 'Error in createFile', { error: error.message });
    return createJsonResponse(false, null, 'Error al crear archivo: ' + error.message);
  }
}

// Función para actualizar archivo
function updateFile(e) {
  try {
    let fileId, newName;

    // Intentar parsear JSON del body
    if (e.postData && e.postData.contents) {
      try {
        const body = JSON.parse(e.postData.contents);
        console.log('Body parsed:', body); // Debug log

        // Si viene en data.fileId
        if (body.data && body.data.fileId) {
          fileId = body.data.fileId;
          newName = body.data.name;
        }
        // Si viene directamente en el body
        else if (body.fileId) {
          fileId = body.fileId;
          newName = body.name;
        }
      } catch (parseError) {
        console.log('JSON parse error:', parseError);
      }
    }

    // Si no se encontró en el body, intentar parámetros de URL
    if (!fileId) {
      fileId = e.parameter.fileId;
      newName = e.parameter.newName;
    }

    console.log('Final fileId:', fileId); // Debug log

    if (!fileId) {
      throw new Error('fileId es requerido');
    }

    const file = DriveApp.getFileById(fileId);
    if (newName) {
      file.setName(newName);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Archivo actualizado'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.log('Error in updateFile:', error); // Debug log
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para eliminar archivo
function deleteFile(e) {
  try {
    let fileId;

    // Intentar parsear JSON del body
    if (e.postData && e.postData.contents) {
      try {
        const body = JSON.parse(e.postData.contents);
        console.log('Body parsed:', body); // Debug log

        // Si viene en data.fileId
        if (body.data && body.data.fileId) {
          fileId = body.data.fileId;
        }
        // Si viene directamente en el body
        else if (body.fileId) {
          fileId = body.fileId;
        }
      } catch (parseError) {
        console.log('JSON parse error:', parseError);
      }
    }

    // Si no se encontró en el body, intentar parámetros de URL
    if (!fileId) {
      fileId = e.parameter.fileId;
    }

    console.log('Final fileId:', fileId); // Debug log

    if (!fileId) {
      throw new Error('fileId es requerido');
    }

    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Archivo eliminado'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para guardar colaboración
function saveCollaboration(e) {
  try {
    // Implementar lógica para guardar colaboraciones
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Colaboración guardada (placeholder)'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para obtener colaboraciones
function getCollaborations(e) {
  try {
    // Implementar lógica para obtener colaboraciones
    const collaborations = [];

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        collaborations: collaborations
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para analizar con IA
function analyzeWithAI(e) {
  try {
    // Implementar lógica para análisis con IA
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Análisis con IA completado (placeholder)'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}