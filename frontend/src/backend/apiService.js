/**
 * SERVICIOS DE API
 * Dashboard Docente - Copiloto Digital
 *
 * Este archivo contiene todas las funciones para comunicarse
 * con el backend de Google Apps Script
 */

// Importaciones de configuración y datos mock
import { API_CONFIG, isDevelopment } from '../config.js';
import aiService from './aiService.js';
import {
  MOCK_FILES,
  MOCK_CATEGORIES,
  MOCK_COLLABORATIONS,
  MOCK_AI_ANALYSIS,
  mockApiCall,
  mockApiError,
  getFilesByCategory,
  searchFiles
} from '../mockData.js';

/**
 * Clase principal para servicios de API
 */
class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.useMockData = isDevelopment();
  }

  /**
   * Realiza una petición POST al backend
   * @param {string} action - Acción a ejecutar
   * @param {Object} data - Datos de la petición
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async post(action, data = {}, filters = {}) {
    // Si estamos en modo desarrollo y usando datos mock
    if (this.useMockData) {
      return this.handleMockRequest(action, data, filters);
    }

    try {
      // Construir URL con el parámetro action
      const url = new URL(this.baseUrl);
      url.searchParams.set('action', action);

      const payload = {
        data,
        filters
      };

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error en petición API:', error);
      throw error;
    }
  }

  /**
   * Maneja peticiones mock para desarrollo
   * @param {string} action - Acción solicitada
   * @param {Object} data - Datos de la petición
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>} Respuesta mock
   */
  async handleMockRequest(action, data = {}, filters = {}) {
    console.log('🔧 Usando datos mock para:', action, { data, filters });

    switch (action) {
      case 'getFiles':
        return this.mockGetFiles(filters);

      case 'getCategories':
        return this.mockGetCategories();

      case 'createFile':
        return this.mockCreateFile(data);

      case 'updateFile':
        return this.mockUpdateFile(data);

      case 'deleteFile':
        return this.mockDeleteFile(data);

      case 'saveCollaboration':
        return this.mockSaveCollaboration(data);

      case 'getCollaborations':
        return this.mockGetCollaborations(filters);

      case 'analyzeWithAI':
        return this.mockAnalyzeWithAI(data);

      default:
        return mockApiError(`Acción no soportada: ${action}`);
    }
  }

  /**
   * Mock para obtener archivos
   */
  async mockGetFiles(filters = {}) {
    let files = [...MOCK_FILES];

    // Aplicar filtros
    if (filters.category && filters.category !== 'all') {
      files = getFilesByCategory(filters.category);
    }

    if (filters.search) {
      files = searchFiles(filters.search);
    }

    if (filters.type && filters.type !== 'all') {
      files = files.filter(file => file.type === filters.type);
    }

    return mockApiCall({
      files,
      total: files.length,
      filters: filters
    });
  }

  /**
   * Mock para obtener categorías
   */
  async mockGetCategories() {
    return mockApiCall({
      categories: MOCK_CATEGORIES,
      total: MOCK_CATEGORIES.length
    });
  }

  /**
   * Mock para crear archivo
   */
  async mockCreateFile(data) {
    const newFile = {
      id: `file_${Date.now()}`,
      name: data.name || 'Nuevo Archivo',
      type: data.type || 'document',
      category: data.category || 'materiales',
      size: '0 KB',
      lastModified: new Date().toISOString(),
      url: '#',
      description: data.description || '',
      tags: data.tags || [],
      annotations: []
    };

    // Agregar a archivos mock (en una implementación real esto sería persistente)
    MOCK_FILES.push(newFile);

    return mockApiCall({
      file: newFile,
      message: 'Archivo creado exitosamente'
    });
  }

  /**
   * Mock para actualizar archivo
   */
  async mockUpdateFile(data) {
    const fileIndex = MOCK_FILES.findIndex(file => file.id === data.id);

    if (fileIndex === -1) {
      return mockApiError('Archivo no encontrado');
    }

    // Actualizar archivo
    MOCK_FILES[fileIndex] = {
      ...MOCK_FILES[fileIndex],
      ...data,
      lastModified: new Date().toISOString()
    };

    return mockApiCall({
      file: MOCK_FILES[fileIndex],
      message: 'Archivo actualizado exitosamente'
    });
  }

  /**
   * Mock para eliminar archivo
   */
  async mockDeleteFile(data) {
    const fileIndex = MOCK_FILES.findIndex(file => file.id === data.id);

    if (fileIndex === -1) {
      return mockApiError('Archivo no encontrado');
    }

    const deletedFile = MOCK_FILES.splice(fileIndex, 1)[0];

    return mockApiCall({
      file: deletedFile,
      message: 'Archivo eliminado exitosamente'
    });
  }

  /**
   * Mock para guardar colaboración
   */
  async mockSaveCollaboration(data) {
    const newCollaboration = {
      id: `collab_${Date.now()}`,
      ...data,
      timestamp: new Date().toISOString()
    };

    MOCK_COLLABORATIONS.unshift(newCollaboration);

    return mockApiCall({
      collaboration: newCollaboration,
      message: 'Colaboración guardada exitosamente'
    });
  }

  /**
   * Mock para obtener colaboraciones
   */
  async mockGetCollaborations(filters = {}) {
    let collaborations = [...MOCK_COLLABORATIONS];

    // Aplicar filtros
    if (filters.fileId) {
      collaborations = collaborations.filter(c => c.fileId === filters.fileId);
    }

    if (filters.type) {
      collaborations = collaborations.filter(c => c.type === filters.type);
    }

    if (filters.limit) {
      collaborations = collaborations.slice(0, filters.limit);
    }

    return mockApiCall({
      collaborations,
      total: collaborations.length
    });
  }

  /**
   * Mock para análisis con IA
   */
  async mockAnalyzeWithAI(data) {
    // Simular análisis basado en el contenido
    const content = data.content || '';
    // const action = data.action || 'categorize'; // No se usa actualmente

    let analysis = { ...MOCK_AI_ANALYSIS };

    // Personalizar análisis basado en el contenido
    if (content.toLowerCase().includes('matemática')) {
      analysis.keywords = ['matemáticas', 'álgebra', 'geometría', 'cálculo'];
      analysis.summary = 'Contenido matemático detectado. Se recomienda incluir ejercicios prácticos y visualizaciones.';
    } else if (content.toLowerCase().includes('historia')) {
      analysis.keywords = ['historia', 'cronología', 'eventos', 'personajes'];
      analysis.summary = 'Contenido histórico identificado. Considera agregar línea de tiempo y fuentes primarias.';
    }

    return mockApiCall(analysis, 2000); // Delay más largo para simular procesamiento IA
  }

  /**
   * Obtiene la lista de archivos con filtros opcionales
   * @param {Object} filters - Filtros a aplicar
   * @returns {Promise<Object>} Lista de archivos
   */
  async getFiles(filters = {}) {
    return this.post('getFiles', {}, filters);
  }

  /**
   * Crea un nuevo archivo
   * @param {Object} fileData - Datos del archivo
   * @returns {Promise<Object>} Resultado de la creación
   */
  async createFile(fileData) {
    return this.post('createFile', fileData);
  }

  /**
   * Actualiza un archivo existente
   * @param {string} fileId - ID del archivo
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updateFile(fileId, updates) {
    return this.post('updateFile', {
      id: fileId,
      ...updates
    });
  }

  /**
   * Elimina un archivo
   * @param {string} fileId - ID del archivo a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteFile(fileId) {
    return this.post('deleteFile', { id: fileId });
  }

  /**
   * Obtiene las categorías disponibles para filtros
   * @returns {Promise<Object>} Categorías disponibles
   */
  async getCategories() {
    return this.post('getCategories');
  }

  /**
   * Guarda un registro de colaboración
   * @param {Object} collaborationData - Datos de la colaboración
   * @returns {Promise<Object>} Resultado del guardado
   */
  async saveCollaboration(collaborationData) {
    return this.post('saveCollaboration', collaborationData);
  }

  /**
   * Obtiene registros de colaboraciones
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>} Lista de colaboraciones
   */
  async getCollaborations(filters = {}) {
    return this.post('getCollaborations', {}, filters);
  }

  /**
   * Analiza contenido usando IA
   * @param {string} content - Contenido a analizar
   * @param {string} action - Tipo de análisis
   * @returns {Promise<Object>} Resultado del análisis
   */
  async analyzeWithAI(content, action = 'categorize') {
    return this.post('analyzeWithAI', {
      content,
      action
    });
  }
}

// Instancia singleton del servicio
const apiService = new ApiService();

/**
 * FUNCIONES DE UTILIDAD PARA EL FRONTEND
 */

/**
 * Carga archivos con manejo de errores
 * @param {Object} filters - Filtros a aplicar
 * @returns {Promise<Array>} Lista de archivos
 */
export const loadFiles = async (filters = {}) => {
  try {
    const response = await apiService.getFiles(filters);

    if (response.success) {
      return response.data?.files || response.data || [];
    } else {
      console.error('Error al cargar archivos:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    return [];
  }
};

/**
 * Carga categorías para los filtros
 * @returns {Promise<Object>} Categorías disponibles
 */
export const loadCategories = async () => {
  try {
    const response = await apiService.getCategories();

    if (response.success) {
      const categories = response.data?.categories || response.data || [];
      return {
        courses: categories.map(cat => cat.name) || ['Todos los Cursos', '5° Básico', '6° Básico', '7° Básico', '8° Básico'],
        subjects: ['Todas', 'Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés'],
        urgencies: ['Hoy', 'Esta Semana', 'Este Mes', 'Históricos'],
        categories: categories
      };
    } else {
      console.error('Error al cargar categorías:', response.error);
      return {
        courses: ['Todos los Cursos', '5° Básico', '6° Básico', '7° Básico', '8° Básico'],
        subjects: ['Todas', 'Matemáticas', 'Lenguaje', 'Ciencias'],
        urgencies: ['Hoy', 'Esta Semana', 'Históricos'],
        categories: []
      };
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    return {
      courses: ['Todos los Cursos', '5° Básico', '6° Básico', '7° Básico', '8° Básico'],
      subjects: ['Todas', 'Matemáticas', 'Lenguaje', 'Ciencias'],
      urgencies: ['Hoy', 'Esta Semana', 'Históricos'],
      categories: []
    };
  }
};

/**
 * Guarda una colaboración
 * @param {Object} collaborationData - Datos de la colaboración
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const saveCollaborationRecord = async (collaborationData) => {
  try {
    const response = await apiService.saveCollaboration(collaborationData);
    return response.success;
  } catch (error) {
    console.error('Error al guardar colaboración:', error);
    return false;
  }
};

/**
 * Analiza contenido con IA
 * @param {string} content - Contenido a analizar
 * @param {string} action - Tipo de análisis
 * @returns {Promise<Object>} Resultado del análisis
 */
export const analyzeContent = async (content, action = 'categorize') => {
  try {
    const response = await apiService.analyzeWithAI(content, action);

    if (response.success) {
      return response.data || MOCK_AI_ANALYSIS;
    } else {
      console.error('Error en análisis IA:', response.error);
      return MOCK_AI_ANALYSIS;
    }
  } catch (error) {
    console.error('Error de conexión IA:', error);
    return MOCK_AI_ANALYSIS;
  }
};

/**
 * Crea un archivo duplicando una plantilla
 * @param {string} templateId - ID de la plantilla
 * @param {string} newName - Nombre del nuevo archivo
 * @returns {Promise<Object>} Resultado de la creación
 */
export const duplicateTemplate = async (templateId, newName) => {
  try {
    const response = await apiService.createFile({
      templateId,
      name: newName
    });

    if (response.success) {
      return response.data;
    } else {
      console.error('Error al duplicar plantilla:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    return null;
  }
};

/**
 * Categoriza automáticamente un archivo usando IA
 * @param {string} fileName - Nombre del archivo
 * @param {string} fileType - Tipo MIME del archivo
 * @param {string} content - Contenido del archivo (opcional)
 * @returns {Promise<Object>} Resultado de la categorización
 */
export const categorizeFile = async (fileName, fileType, content = '') => {
  try {
    console.log('🤖 Categorizando archivo con IA:', fileName);
    return await aiService.categorizeFile(fileName, fileType, content);
  } catch (error) {
    console.error('Error en categorización IA:', error);
    return {
      success: false,
      error: 'Error al categorizar el archivo',
      categorization: {
        materialType: 'documento',
        subject: 'General',
        level: 'General',
        mainTopic: 'Sin especificar',
        urgency: 'Media'
      }
    };
  }
};

/**
 * Genera contenido para una presentación usando IA
 * @param {string} templateContent - Contenido de la plantilla
 * @param {string} objectives - Objetivos de aprendizaje
 * @param {string} activities - Actividades planificadas
 * @returns {Promise<Object>} Contenido generado
 */
export const generatePresentationContent = async (templateContent, objectives, activities) => {
  try {
    console.log('🤖 Generando contenido de presentación con IA');
    return await aiService.generatePresentationContent(templateContent, objectives, activities);
  } catch (error) {
    console.error('Error generando presentación:', error);
    return {
      success: false,
      error: 'Error al generar el contenido de la presentación'
    };
  }
};

/**
 * Analiza notas de codocencia y genera tareas usando IA
 * @param {string} collaborationNotes - Notas de la sesión
 * @returns {Promise<Object>} Análisis y tareas generadas
 */
export const analyzeCollaborationNotes = async (collaborationNotes) => {
  try {
    console.log('🤖 Analizando notas de codocencia con IA');
    return await aiService.analyzeCollaborationNotes(collaborationNotes);
  } catch (error) {
    console.error('Error analizando notas:', error);
    return {
      success: false,
      error: 'Error al analizar las notas de codocencia'
    };
  }
};

/**
 * Genera sugerencias de mejora profesional usando IA
 * @param {Array} recentActivities - Actividades recientes
 * @returns {Promise<Object>} Sugerencias generadas
 */
export const generateImprovementSuggestions = async (recentActivities) => {
  try {
    console.log('🤖 Generando sugerencias de mejora con IA');
    return await aiService.generateImprovementSuggestions(recentActivities);
  } catch (error) {
    console.error('Error generando sugerencias:', error);
    return {
      success: false,
      error: 'Error al generar sugerencias de mejora'
    };
  }
};

export default apiService;
