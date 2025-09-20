import React, { useState } from 'react';

interface FilterState {
  course: string;
  urgency: string;
  subject: string;
}

interface QuickFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    course: 'Todos los Cursos',
    urgency: '',
    subject: 'Todas'
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const courses = ['Todos los Cursos', '5° Básico', '6° Básico', '7° Básico', '8° Básico'];
  const subjects = ['Todas', 'Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés'];

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filtro de Curso */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Curso</label>
        <select
          value={filters.course}
          onChange={(e) => handleFilterChange('course', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          {courses.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </div>

      {/* Filtro de Urgencia */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Urgencia</label>
        <div className="flex space-x-2">
          {[
            { value: 'Hoy', label: 'Hoy', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
            { value: 'Esta Semana', label: 'Esta Semana', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
            { value: 'Históricos', label: 'Históricos', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' }
          ].map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => handleFilterChange('urgency', value)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition duration-200 ${
                filters.urgency === value
                  ? 'bg-blue-600 text-white'
                  : color
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro de Asignatura */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Asignatura</label>
        <select
          value={filters.subject}
          onChange={(e) => handleFilterChange('subject', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default QuickFilters;
