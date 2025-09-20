// Tipos compartidos para el Dashboard Docente
// Este archivo contiene todas las interfaces y tipos utilizados en la aplicación

export interface DriveFile {
  // Propiedades del backend
  id: string;
  name: string;
  type: 'documento' | 'prueba' | 'presentación' | 'pdf' | 'guía';
  url: string;
  thumbnailUrl: string;
  lastModified: string;
  size: number;

  // Propiedades del frontend (compatibilidad)
  fileName?: string;
  fileType?: 'guía' | 'prueba' | 'presentación' | 'documento';
  fileLink?: string;
  fileId?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  color?: string;
}

export interface Collaboration {
  id: string;
  fileId: string;
  fileName: string;
  action: string;
  description: string;
  author: string;
  timestamp: string;
  type: 'annotation' | 'suggestion' | 'feedback' | 'update';
}

export interface AIAnalysis {
  summary: string;
  suggestions: string[];
  keywords: string[];
  readability_score: number;
  engagement_score: number;
  completeness_score: number;
}

export interface FilterState {
  course: string;
  urgency: string;
  subject: string;
  searchQuery?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para el panel interactivo
export type ToolType = 'annotations' | 'screenshot' | 'roulette' | 'poll';

export interface Poll {
  question: string;
  options: string[];
  votes: number[];
  isActive: boolean;
}

// Tipos para autenticación
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'admin';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}