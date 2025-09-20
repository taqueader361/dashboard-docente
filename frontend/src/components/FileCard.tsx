import React from 'react';
import { DriveFile } from '../types';

interface FileCardProps {
  file: DriveFile;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  // Usar propiedades del backend o frontend según estén disponibles
  const fileName = file.fileName || file.name;
  const fileType = file.fileType || file.type;
  const thumbnailUrl = file.thumbnailUrl;
  const fileLink = file.fileLink || file.url;
  const lastModified = file.lastModified ? new Date(file.lastModified) : undefined;

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'guía':
        return 'border-t-4 border-blue-500';
      case 'prueba':
        return 'border-t-4 border-red-500';
      case 'presentación':
        return 'border-t-4 border-green-500';
      case 'documento':
        return 'border-t-4 border-purple-500';
      default:
        return 'border-t-4 border-gray-500';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'guía':
        return 'bg-blue-100 text-blue-800';
      case 'prueba':
        return 'bg-red-100 text-red-800';
      case 'presentación':
        return 'bg-green-100 text-green-800';
      case 'documento':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastModified = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden ${getBorderColor(fileType)}`}>
      <div className="aspect-w-16 aspect-h-12 bg-gray-100">
        <img
          src={thumbnailUrl}
          alt={fileName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA2VjE2TTE2IDEySDgiIHN0cm9rZT0iIzk5QTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
          {fileName}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(fileType)}`}>
            {fileType}
          </span>
          {lastModified && (
            <span className="text-xs text-gray-500">
              {formatLastModified(lastModified)}
            </span>
          )}
        </div>
        <a
          href={fileLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          Abrir
        </a>
      </div>
    </div>
  );
};

export default FileCard;
