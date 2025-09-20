/**
 * Type declarations for apiService.js
 * Dashboard Docente - Copiloto Digital
 */

// Categorization result interface
export interface CategorizationResult {
  success: boolean;
  error?: string;
  categorization?: {
    materialType: string;
    subject: string;
    level: string;
    mainTopic: string;
    urgency: string;
  };
}

// Presentation content result interface
export interface PresentationContentResult {
  success: boolean;
  error?: string;
  content?: Record<string, unknown>; // The actual content structure depends on AI service implementation
}

// Collaboration analysis result interface
export interface CollaborationAnalysisResult {
  success: boolean;
  error?: string;
  analysis?: Record<string, unknown>; // The actual analysis structure depends on AI service implementation
}

// Improvement suggestions result interface
export interface ImprovementSuggestionsResult {
  success: boolean;
  error?: string;
  suggestions?: Record<string, unknown>; // The actual suggestions structure depends on AI service implementation
}

// Function declarations
export declare const categorizeFile: (
  fileName: string,
  fileType: string,
  content?: string
) => Promise<CategorizationResult>;

export declare const generatePresentationContent: (
  templateContent: string,
  objectives: string,
  activities: string
) => Promise<PresentationContentResult>;

export declare const analyzeCollaborationNotes: (
  collaborationNotes: string
) => Promise<CollaborationAnalysisResult>;

export declare const generateImprovementSuggestions: (
  recentActivities: Record<string, unknown>[]
) => Promise<ImprovementSuggestionsResult>;

// File interface for the dashboard
export interface DriveFile {
  fileName: string;
  fileType: 'guía' | 'prueba' | 'presentación' | 'documento';
  thumbnailUrl: string;
  fileLink: string;
  lastModified?: Date;
  fileId?: string;
  size?: number;
}

// Default export (the ApiService class instance)
interface ApiService {
  getFiles(filters?: Record<string, unknown>): Promise<DriveFile[]>;
  createFile(fileData: Record<string, unknown>): Promise<unknown>;
  updateFile(fileId: string, updates: Record<string, unknown>): Promise<unknown>;
  deleteFile(fileId: string): Promise<unknown>;
  getCategories(): Promise<unknown>;
  saveCollaboration(collaborationData: Record<string, unknown>): Promise<unknown>;
  getCollaborations(filters?: Record<string, unknown>): Promise<unknown>;
  analyzeWithAI(content: string, action?: string): Promise<unknown>;
}

declare const apiService: ApiService;
export default apiService;