import React, { useState, useEffect } from 'react';
import QuickFilters from '../components/QuickFilters';
import SearchBar from '../components/SearchBar';
import FileDisplay from '../components/FileDisplay';
import EmptyState from '../components/EmptyState';
import AIExample from '../components/AIExample';
import InteractivePanel from '../components/InteractivePanel';
import apiService from '../backend/apiService';
import { DriveFile } from '../types';

interface DashboardPageProps {
  onLogout: () => void;
}

interface FilterState {
  course: string;
  urgency: string;
  subject: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [isMosaicView, setIsMosaicView] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    course: 'Todos los Cursos',
    urgency: '',
    subject: 'Todas'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAIExample, setShowAIExample] = useState(false);
  const [showInteractivePanel, setShowInteractivePanel] = useState(false);

  // Cargar archivos desde la API al montar el componente
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedFiles = await apiService.getFiles();

      // Transformar los datos del backend al formato del frontend
      const transformedFiles: DriveFile[] = fetchedFiles.map((file: any) => ({
        id: file.id || file.fileId || '',
        name: file.name || file.fileName || '',
        type: (file.type || file.fileType || 'documento') as DriveFile['type'],
        url: file.url || file.fileLink || '',
        thumbnailUrl: file.thumbnailUrl || '',
        lastModified: typeof file.lastModified === 'string' ? file.lastModified : file.lastModified?.toISOString() || '',
        size: file.size || 0,
        // Mantener compatibilidad con propiedades del frontend
        fileName: file.name || file.fileName || '',
        fileType: file.type || file.fileType || 'documento',
        fileLink: file.url || file.fileLink || '',
        fileId: file.id || file.fileId || ''
      }));

      setFiles(transformedFiles);
    } catch (err) {
      console.error('Error loading files:', err);
      setError('No se pudieron cargar los archivos. Verifica tu conexión.');
      // Fallback a datos mock en formato correcto
      setFiles([
        {
          id: 'mock1',
          name: 'Fracciones 5°B - Guía de Estudio',
          type: 'guía',
          url: 'https://drive.google.com/file/d/mock1',
          thumbnailUrl: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Fracciones',
          lastModified: new Date().toISOString(),
          size: 1024000,
          fileName: 'Fracciones 5°B - Guía de Estudio',
          fileType: 'guía',
          fileLink: 'https://drive.google.com/file/d/mock1',
          fileId: 'mock1'
        },
        {
          id: 'mock2',
          name: 'Prueba de Matemáticas - Unidad 2',
          type: 'prueba',
          url: 'https://drive.google.com/file/d/mock2',
          thumbnailUrl: 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Prueba',
          lastModified: new Date().toISOString(),
          size: 2048000,
          fileName: 'Prueba de Matemáticas - Unidad 2',
          fileType: 'prueba',
          fileLink: 'https://drive.google.com/file/d/mock2',
          fileId: 'mock2'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFiles = files.filter(file => {
    const fileName = file.fileName || file.name || '';
    const matchesCourse = filters.course === 'Todos los Cursos' ||
      fileName.toLowerCase().includes(filters.course.toLowerCase());
    const matchesSubject = filters.subject === 'Todas' ||
      fileName.toLowerCase().includes(filters.subject.toLowerCase());
    const matchesSearch = !searchTerm ||
      fileName.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por urgencia basado en fecha de modificación
    let matchesUrgency = true;
    if (filters.urgency && file.lastModified) {
      const lastModifiedDate = typeof file.lastModified === 'string'
        ? new Date(file.lastModified)
        : file.lastModified;
      const daysDiff = Math.floor((new Date().getTime() - lastModifiedDate.getTime()) / (1000 * 3600 * 24));
      switch (filters.urgency) {
        case 'Hoy':
          matchesUrgency = daysDiff === 0;
          break;
        case 'Esta Semana':
          matchesUrgency = daysDiff <= 7;
          break;
        case 'Históricos':
          matchesUrgency = daysDiff > 7;
          break;
      }
    }

    return matchesCourse && matchesSubject && matchesSearch && matchesUrgency;
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const toggleAnnotation = () => {
    setIsAnnotating(!isAnnotating);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Docente</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleAnnotation}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  isAnnotating
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isAnnotating ? 'Detener Anotación' : 'Iniciar Anotación'}
              </button>
              <button
                onClick={() => setShowAIExample(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                🤖 Probar IA
              </button>
              <button
                onClick={() => setShowInteractivePanel(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                🎯 Panel Interactivo
              </button>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Sidebar Left */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Menú</h3>
            <nav className="space-y-2">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-200">
                Inicio
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-200">
                Archivos
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-200">
                Calendario
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-200">
                Configuración
              </a>
            </nav>

            {/* Pomodoro Timer */}
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Temporizador Pomodoro</h4>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">25:00</div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition duration-200">
                  Iniciar
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Tu Día, Hoy</h2>

              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMosaicView(true)}
                  className={`p-2 rounded ${isMosaicView ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsMosaicView(false)}
                  className={`p-2 rounded ${!isMosaicView ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 000-2H3z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 space-y-4">
              <QuickFilters onFilterChange={handleFilterChange} />
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Files Display */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Cargando archivos...</span>
              </div>
            ) : error ? (
              <EmptyState
                title="Error al cargar archivos"
                description={error}
                action={
                  <button
                    onClick={loadFiles}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Reintentar
                  </button>
                }
              />
            ) : filteredFiles.length === 0 ? (
              <EmptyState
                title="No se encontraron archivos"
                description="Intenta ajustar los filtros de búsqueda o sube nuevos archivos."
              />
            ) : (
              <FileDisplay files={filteredFiles} />
            )}
          </div>

          {/* Sidebar Right */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones</h3>
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">Archivo subido exitosamente</p>
                <p className="text-xs text-green-600 mt-1">Hace 2 horas</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">Nueva actualización disponible</p>
                <p className="text-xs text-yellow-600 mt-1">Hace 1 día</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">Próxima clase: Matemáticas 5°B</p>
                <p className="text-xs text-blue-600 mt-1">En 30 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Annotation Canvas Overlay */}
      {isAnnotating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Modo de Anotación</h3>
            <p className="text-gray-600 mb-4">
              Usa tu tableta digital o mouse para hacer anotaciones sobre la presentación proyectada.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={toggleAnnotation}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Here would be the logic to capture and save the annotation
                  console.log('Capturing annotation...');
                  toggleAnnotation();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
              >
                Capturar y Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Example Modal */}
      {showAIExample && (
        <AIExample onClose={() => setShowAIExample(false)} />
      )}

      {/* Interactive Panel Modal */}
      {showInteractivePanel && (
        <InteractivePanel onClose={() => setShowInteractivePanel(false)} />
      )}
    </div>
  );
};

export default DashboardPage;
