// Componente de ejemplo para demostrar el uso de IA
// Dashboard Docente - Copiloto Digital

import React, { useState } from 'react';
import { categorizeFile, generatePresentationContent, analyzeCollaborationNotes, CategorizationResult, PresentationContentResult, CollaborationAnalysisResult } from '../backend/apiService.js';

interface AIExampleProps {
  onClose: () => void;
}

const AIExample: React.FC<AIExampleProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'categorize' | 'presentation' | 'collaboration'>('categorize');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CategorizationResult | PresentationContentResult | CollaborationAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados para cada funcionalidad
  const [fileName, setFileName] = useState('Fracciones_Matemáticas_5B_Guía_Estudio.pdf');
  const [fileType, setFileType] = useState('application/pdf');

  const [templateContent, setTemplateContent] = useState('Plantilla de Matemáticas - Unidad 2');
  const [objectives, setObjectives] = useState('Comprender conceptos básicos de fracciones\nResolver problemas con fracciones\nAplicar fracciones en situaciones reales');
  const [activities, setActivities] = useState('Ejercicios de identificación de fracciones\nProblemas de suma y resta de fracciones\nJuego interactivo de fracciones');

  const [collaborationNotes, setCollaborationNotes] = useState(`Sesión de codocencia - 19/09/2025

Participantes: Prof. María González, Prof. Carlos Rodríguez

Fortalezas observadas:
- Buena gestión del tiempo en clase
- Interacción positiva con estudiantes
- Uso efectivo de recursos tecnológicos

Áreas de mejora:
- Mayor variedad en estrategias de evaluación
- Incrementar participación de estudiantes con dificultades
- Mejorar transición entre actividades

Acuerdos:
- Implementar rúbrica de evaluación compartida
- Coordinar materiales entre ambas secciones
- Reunión semanal para seguimiento`);

  const handleCategorize = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categorizeFile(fileName, fileType);
      setResult(response);
    } catch (err) {
      setError('Error al categorizar el archivo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePresentation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generatePresentationContent(templateContent, objectives, activities);
      setResult(response);
    } catch (err) {
      setError('Error al generar contenido de presentación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCollaboration = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeCollaborationNotes(collaborationNotes);
      setResult(response);
    } catch (err) {
      setError('Error al analizar notas de codocencia');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      );
    }

    if (!result) return null;

    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Resultado:</h3>
        <pre className="text-sm text-green-700 whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🤖 Demostración de IA</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            {[
              { id: 'categorize', label: 'Categorizar Archivo', icon: '📁' },
              { id: 'presentation', label: 'Generar Presentación', icon: '📊' },
              { id: 'collaboration', label: 'Analizar Codocencia', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'categorize' | 'presentation' | 'collaboration')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'categorize' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Categorización Automática de Archivos</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Archivo
                    </label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo MIME
                    </label>
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="application/pdf">PDF</option>
                      <option value="application/vnd.google-apps.presentation">Presentación Google</option>
                      <option value="application/vnd.google-apps.document">Documento Google</option>
                    </select>
                  </div>
                  <button
                    onClick={handleCategorize}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Categorizando...' : 'Categorizar Archivo'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'presentation' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Generación de Contenido para Presentaciones</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenido de la Plantilla
                    </label>
                    <textarea
                      value={templateContent}
                      onChange={(e) => setTemplateContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objetivos de Aprendizaje
                    </label>
                    <textarea
                      value={objectives}
                      onChange={(e) => setObjectives(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actividades Planificadas
                    </label>
                    <textarea
                      value={activities}
                      onChange={(e) => setActivities(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleGeneratePresentation}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Generando...' : 'Generar Presentación'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'collaboration' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Análisis de Notas de Codocencia</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas de la Sesión de Codocencia
                    </label>
                    <textarea
                      value={collaborationNotes}
                      onChange={(e) => setCollaborationNotes(e.target.value)}
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAnalyzeCollaboration}
                    disabled={loading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Analizando...' : 'Analizar Notas'}
                  </button>
                </div>
              </div>
            )}

            {/* Result */}
            {renderResult()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIExample;