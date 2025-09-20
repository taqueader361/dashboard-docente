// Servicio de Inteligencia Artificial con Google Gemini
// Dashboard Docente - Copiloto Digital

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../config.js';

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: GEMINI_CONFIG.MODEL,
      generationConfig: GEMINI_CONFIG.GENERATION_CONFIG,
      safetySettings: GEMINI_CONFIG.SAFETY_SETTINGS,
    });
  }

  /**
   * Categoriza automáticamente un archivo basado en su nombre y contenido
   * @param {string} fileName - Nombre del archivo
   * @param {string} fileType - Tipo MIME del archivo
   * @param {string} content - Contenido del archivo (opcional)
   * @returns {Promise<Object>} Categorización del archivo
   */
  async categorizeFile(fileName, fileType, content = '') {
    try {
      const prompt = `
        Analiza el siguiente archivo y categorízalo para un docente:

        Nombre del archivo: ${fileName}
        Tipo MIME: ${fileType}
        ${content ? `Contenido: ${content.substring(0, 500)}...` : ''}

        Por favor proporciona:
        1. Tipo de material (guía, prueba, presentación, documento)
        2. Asignatura más probable (Matemáticas, Lenguaje, Ciencias, etc.)
        3. Nivel educativo (5° Básico, 6° Básico, etc.)
        4. Tema principal
        5. Urgencia (Alta, Media, Baja)

        Responde en formato JSON válido.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Intentar parsear la respuesta como JSON
      try {
        const categorization = JSON.parse(text);
        return {
          success: true,
          categorization: {
            materialType: categorization['Tipo de material'] || categorization.materialType || 'documento',
            subject: categorization['Asignatura más probable'] || categorization.subject || 'General',
            level: categorization['Nivel educativo'] || categorization.level || 'General',
            mainTopic: categorization['Tema principal'] || categorization.mainTopic || 'Sin especificar',
            urgency: categorization['Urgencia'] || categorization.urgency || 'Media'
          }
        };
      } catch {
        // Si no es JSON válido, extraer información del texto
        return {
          success: true,
          categorization: this.extractCategorizationFromText(text)
        };
      }
    } catch (error) {
      console.error('Error categorizando archivo:', error);
      return {
        success: false,
        error: 'No se pudo categorizar el archivo',
        categorization: {
          materialType: 'documento',
          subject: 'General',
          level: 'General',
          mainTopic: 'Sin especificar',
          urgency: 'Media'
        }
      };
    }
  }

  /**
   * Extrae categorización de texto cuando no es JSON válido
   * @param {string} text - Texto de respuesta de la IA
   * @returns {Object} Categorización extraída
   */
  extractCategorizationFromText(text) {
    const lowerText = text.toLowerCase();

    // Determinar tipo de material
    let materialType = 'documento';
    if (lowerText.includes('guía') || lowerText.includes('material')) {
      materialType = 'guía';
    } else if (lowerText.includes('prueba') || lowerText.includes('evaluación') || lowerText.includes('examen')) {
      materialType = 'prueba';
    } else if (lowerText.includes('presentación') || lowerText.includes('ppt')) {
      materialType = 'presentación';
    }

    // Determinar asignatura
    let subject = 'General';
    const subjects = ['matemáticas', 'lenguaje', 'ciencias', 'historia', 'inglés', 'educación física'];
    for (const subj of subjects) {
      if (lowerText.includes(subj)) {
        subject = subj.charAt(0).toUpperCase() + subj.slice(1);
        break;
      }
    }

    // Determinar nivel
    let level = 'General';
    const levels = ['5° básico', '6° básico', '7° básico', '8° básico', '1° medio', '2° medio', '3° medio', '4° medio'];
    for (const lvl of levels) {
      if (lowerText.includes(lvl)) {
        level = lvl;
        break;
      }
    }

    return {
      materialType,
      subject,
      level,
      mainTopic: 'Sin especificar',
      urgency: 'Media'
    };
  }

  /**
   * Genera contenido para duplicar y rellenar una presentación
   * @param {string} templateContent - Contenido de la plantilla
   * @param {string} objectives - Objetivos de aprendizaje
   * @param {string} activities - Actividades planificadas
   * @returns {Promise<Object>} Contenido generado para la presentación
   */
  async generatePresentationContent(templateContent, objectives, activities) {
    try {
      const prompt = `
        Eres un asistente pedagógico especializado en crear presentaciones educativas.

        Tienes esta plantilla de presentación:
        ${templateContent}

        Y estos objetivos de aprendizaje:
        ${objectives}

        Y estas actividades planificadas:
        ${activities}

        Por favor genera el contenido completo de la presentación, incluyendo:
        1. Título de la presentación
        2. Diapositivas con contenido específico (título, contenido, imágenes sugeridas)
        3. Notas del docente para cada diapositiva
        4. Duración estimada de la clase

        Estructura la respuesta en formato JSON con el siguiente esquema:
        {
          "title": "Título de la presentación",
          "slides": [
            {
              "number": 1,
              "title": "Título de la diapositiva",
              "content": "Contenido principal",
              "imageSuggestion": "Descripción de imagen sugerida",
              "teacherNotes": "Notas para el docente"
            }
          ],
          "estimatedDuration": "45 minutos",
          "learningObjectives": ["Objetivo 1", "Objetivo 2"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const presentationData = JSON.parse(text);
        return {
          success: true,
          presentation: presentationData
        };
      } catch {
        return {
          success: false,
          error: 'La respuesta no tiene el formato esperado',
          rawResponse: text
        };
      }
    } catch (error) {
      console.error('Error generando contenido de presentación:', error);
      return {
        success: false,
        error: 'No se pudo generar el contenido de la presentación'
      };
    }
  }

  /**
   * Analiza notas de codocencia y genera tareas de seguimiento
   * @param {string} collaborationNotes - Notas de la sesión de codocencia
   * @returns {Promise<Object>} Tareas generadas
   */
  async analyzeCollaborationNotes(collaborationNotes) {
    try {
      const prompt = `
        Analiza estas notas de una sesión de codocencia docente y genera tareas de seguimiento:

        Notas de codocencia:
        ${collaborationNotes}

        Por favor identifica:
        1. Fortalezas destacadas
        2. Áreas de mejora
        3. Tareas específicas de seguimiento
        4. Recursos o capacitaciones sugeridas
        5. Plazos recomendados para las tareas

        Estructura la respuesta en formato JSON:
        {
          "strengths": ["Fortaleza 1", "Fortaleza 2"],
          "improvementAreas": ["Área 1", "Área 2"],
          "followUpTasks": [
            {
              "title": "Título de la tarea",
              "description": "Descripción detallada",
              "priority": "Alta|Media|Baja",
              "deadline": "Fecha sugerida",
              "resources": ["Recurso 1", "Recurso 2"]
            }
          ],
          "recommendations": ["Recomendación 1", "Recomendación 2"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const analysis = JSON.parse(text);
        return {
          success: true,
          analysis: analysis
        };
      } catch {
        return {
          success: false,
          error: 'No se pudo analizar las notas correctamente',
          rawResponse: text
        };
      }
    } catch (error) {
      console.error('Error analizando notas de codocencia:', error);
      return {
        success: false,
        error: 'No se pudieron analizar las notas de codocencia'
      };
    }
  }

  /**
   * Genera sugerencias de mejora para un docente basado en su actividad
   * @param {Array} recentActivities - Actividades recientes del docente
   * @returns {Promise<Object>} Sugerencias generadas
   */
  async generateImprovementSuggestions(recentActivities) {
    try {
      const activitiesText = recentActivities.map(activity =>
        `- ${activity.type}: ${activity.description} (${activity.date})`
      ).join('\n');

      const prompt = `
        Basándote en estas actividades recientes de un docente, genera sugerencias de mejora profesional:

        Actividades recientes:
        ${activitiesText}

        Por favor proporciona:
        1. Fortalezas identificadas
        2. Áreas de oportunidad
        3. Sugerencias específicas de mejora
        4. Recursos recomendados
        5. Metas a corto plazo (1-3 meses)

        Responde en formato JSON estructurado.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const suggestions = JSON.parse(text);
        return {
          success: true,
          suggestions: suggestions
        };
      } catch {
        return {
          success: false,
          error: 'No se pudieron generar las sugerencias',
          rawResponse: text
        };
      }
    } catch (error) {
      console.error('Error generando sugerencias:', error);
      return {
        success: false,
        error: 'No se pudieron generar las sugerencias de mejora'
      };
    }
  }
}

// Exportar instancia singleton
const aiService = new AIService();
export default aiService;