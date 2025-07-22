export interface ProcessingStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
  progress: number;
  message: string;
}

export interface OCRResult {
  id: string;
  imageUrl: string;
  text: string;
  confidence: number;
  timestamp: number;
  language?: string;
  wordCount?: number;
  processingTime?: number;
}

export interface ProcessedImage {
  file: File;
  preview: string;
}

export interface OCRSettings {
  language: string;
  pageSegMode: number;
  ocrEngineMode: number;
  whitelist?: string;
  blacklist?: string;
}