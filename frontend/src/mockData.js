/**
 * DATOS MOCK PARA DESARROLLO
 * Dashboard Docente - Copiloto Digital
 *
 * Este archivo contiene datos de ejemplo para desarrollo y testing
 * cuando no hay conexión con el backend real
 */

// Datos mock de archivos
export const MOCK_FILES = [
  {
    id: 'file_001',
    name: 'Plan de Clases - Matemáticas 8vo Grado',
    type: 'document',
    category: 'planes_clase',
    size: '245 KB',
    lastModified: '2024-01-15T10:30:00Z',
    url: '#',
    description: 'Plan completo para el trimestre de matemáticas',
    tags: ['matemáticas', '8vo grado', 'trimestre'],
    annotations: [
      {
        id: 'ann_001',
        text: 'Revisar ejercicios de geometría',
        author: 'Prof. García',
        date: '2024-01-15T11:00:00Z',
        type: 'note'
      }
    ]
  },
  {
    id: 'file_002',
    name: 'Evaluación Final - Lenguaje',
    type: 'spreadsheet',
    category: 'evaluaciones',
    size: '156 KB',
    lastModified: '2024-01-14T14:20:00Z',
    url: '#',
    description: 'Evaluación final del curso de lenguaje',
    tags: ['lenguaje', 'evaluación', 'final'],
    annotations: []
  },
  {
    id: 'file_003',
    name: 'Material Didáctico - Ciencias Naturales',
    type: 'presentation',
    category: 'materiales',
    size: '3.2 MB',
    lastModified: '2024-01-13T09:15:00Z',
    url: '#',
    description: 'Presentación interactiva sobre el sistema solar',
    tags: ['ciencias', 'sistema solar', 'interactivo'],
    annotations: [
      {
        id: 'ann_002',
        text: 'Agregar animación para órbitas planetarias',
        author: 'Prof. López',
        date: '2024-01-13T10:30:00Z',
        type: 'suggestion'
      }
    ]
  },
  {
    id: 'file_004',
    name: 'Registro de Asistencia - Enero 2024',
    type: 'spreadsheet',
    category: 'registros',
    size: '89 KB',
    lastModified: '2024-01-12T16:45:00Z',
    url: '#',
    description: 'Registro mensual de asistencia de estudiantes',
    tags: ['asistencia', 'enero', 'registro'],
    annotations: []
  },
  {
    id: 'file_005',
    name: 'Proyecto Final - Historia',
    type: 'document',
    category: 'proyectos',
    size: '1.8 MB',
    lastModified: '2024-01-11T13:20:00Z',
    url: '#',
    description: 'Proyecto de investigación sobre la independencia',
    tags: ['historia', 'independencia', 'proyecto'],
    annotations: [
      {
        id: 'ann_003',
        text: 'Excelente trabajo de investigación',
        author: 'Prof. Martínez',
        date: '2024-01-11T14:00:00Z',
        type: 'feedback'
      }
    ]
  }
];

// Datos mock de categorías
export const MOCK_CATEGORIES = [
  {
    id: 'planes_clase',
    name: 'Planes de Clase',
    description: 'Planes de clases y programaciones',
    color: '#3B82F6',
    count: 15
  },
  {
    id: 'evaluaciones',
    name: 'Evaluaciones',
    description: 'Exámenes, pruebas y evaluaciones',
    color: '#EF4444',
    count: 8
  },
  {
    id: 'materiales',
    name: 'Materiales Didácticos',
    description: 'Presentaciones, recursos y materiales',
    color: '#10B981',
    count: 23
  },
  {
    id: 'registros',
    name: 'Registros',
    description: 'Asistencia, calificaciones y registros',
    color: '#F59E0B',
    count: 12
  },
  {
    id: 'proyectos',
    name: 'Proyectos',
    description: 'Proyectos estudiantiles y de investigación',
    color: '#8B5CF6',
    count: 6
  }
];

// Datos mock de colaboraciones
export const MOCK_COLLABORATIONS = [
  {
    id: 'collab_001',
    fileId: 'file_001',
    fileName: 'Plan de Clases - Matemáticas 8vo Grado',
    action: 'annotation_added',
    description: 'Agregó anotación: "Revisar ejercicios de geometría"',
    author: 'Prof. García',
    timestamp: '2024-01-15T11:00:00Z',
    type: 'annotation'
  },
  {
    id: 'collab_002',
    fileId: 'file_003',
    fileName: 'Material Didáctico - Ciencias Naturales',
    action: 'suggestion_added',
    description: 'Sugerencia: "Agregar animación para órbitas planetarias"',
    author: 'Prof. López',
    timestamp: '2024-01-13T10:30:00Z',
    type: 'suggestion'
  },
  {
    id: 'collab_003',
    fileId: 'file_005',
    fileName: 'Proyecto Final - Historia',
    action: 'feedback_provided',
    description: 'Feedback positivo sobre investigación histórica',
    author: 'Prof. Martínez',
    timestamp: '2024-01-11T14:00:00Z',
    type: 'feedback'
  },
  {
    id: 'collab_004',
    fileId: 'file_002',
    fileName: 'Evaluación Final - Lenguaje',
    action: 'file_updated',
    description: 'Actualizó criterios de evaluación',
    author: 'Prof. Rodríguez',
    timestamp: '2024-01-10T09:15:00Z',
    type: 'update'
  }
];

// Datos mock de análisis AI
export const MOCK_AI_ANALYSIS = {
  summary: 'El material educativo presenta una estructura sólida con buena organización de contenidos. Se recomienda mejorar la interactividad y agregar más elementos multimedia.',
  suggestions: [
    'Incorporar videos explicativos para conceptos complejos',
    'Agregar cuestionarios interactivos',
    'Incluir actividades prácticas complementarias',
    'Mejorar la accesibilidad con alternativas textuales'
  ],
  keywords: ['educativo', 'interactivo', 'matemáticas', 'geometría', 'aprendizaje'],
  readability_score: 85,
  engagement_score: 78,
  completeness_score: 92
};

// Funciones de utilidad para datos mock

/**
 * Simula una llamada a la API con delay
 * @param {any} data - Datos a retornar
 * @param {number} delay - Delay en milisegundos
 * @returns {Promise} Promesa con los datos
 */
export const mockApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      });
    }, delay);
  });
};

/**
 * Simula un error de API
 * @param {string} message - Mensaje de error
 * @param {number} delay - Delay en milisegundos
 * @returns {Promise} Promesa que rechaza con error
 */
export const mockApiError = (message = 'Error simulado', delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({
        success: false,
        error: message,
        timestamp: new Date().toISOString()
      });
    }, delay);
  });
};

/**
 * Filtra archivos por categoría
 * @param {string} categoryId - ID de la categoría
 * @returns {Array} Archivos filtrados
 */
export const getFilesByCategory = (categoryId) => {
  return MOCK_FILES.filter(file => file.category === categoryId);
};

/**
 * Busca archivos por texto
 * @param {string} query - Texto de búsqueda
 * @returns {Array} Archivos encontrados
 */
export const searchFiles = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_FILES.filter(file =>
    file.name.toLowerCase().includes(lowercaseQuery) ||
    file.description.toLowerCase().includes(lowercaseQuery) ||
    file.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

/**
 * Obtiene estadísticas de archivos
 * @returns {Object} Estadísticas
 */
export const getFileStats = () => {
  const totalFiles = MOCK_FILES.length;
  const totalSize = MOCK_FILES.reduce((sum, file) => {
    const size = parseFloat(file.size.replace(' KB', '').replace(' MB', '')) *
                 (file.size.includes('MB') ? 1024 : 1);
    return sum + size;
  }, 0);

  const categoryStats = MOCK_CATEGORIES.map(cat => ({
    ...cat,
    actualCount: MOCK_FILES.filter(file => file.category === cat.id).length
  }));

  return {
    totalFiles,
    totalSize: `${(totalSize / 1024).toFixed(1)} MB`,
    categories: categoryStats,
    recentActivity: MOCK_COLLABORATIONS.slice(0, 5)
  };
};
