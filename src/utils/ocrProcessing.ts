import { createWorker } from 'tesseract.js';
import { OCRSettings } from '../types';

interface OCRResult {
  text: string;
  confidence: number;
}

export const processImageWithOCR = async (
  imageUrl: string,
  progressCallback: (progress: number, message: string) => void,
  settings: OCRSettings = {
    language: 'eng',
    pageSegMode: 3,
    ocrEngineMode: 1
  }
): Promise<OCRResult> => {
  const startTime = Date.now();
  
  const worker = await createWorker(settings.language, 1, {
    logger: m => {
      if (m.status === 'recognizing text') {
        const percent = Math.round(m.progress * 100);
        progressCallback(percent, 'Recognizing text...');
      } else if (m.status === 'loading tesseract core') {
        progressCallback(10, 'Loading OCR engine...');
      } else if (m.status === 'loading language traineddata') {
        progressCallback(20, `Loading ${settings.language} language data...`);
      } else if (m.status === 'initializing api') {
        progressCallback(30, 'Initializing OCR...');
      } else if (m.status === 'initialized tesseract') {
        progressCallback(40, 'OCR engine ready');
      }
    }
  });

  try {
    progressCallback(50, 'Configuring OCR parameters...');

    // Set recognition parameters
    const parameters: Record<string, string | number> = {
      tessedit_ocr_engine_mode: settings.ocrEngineMode,
      tessedit_pageseg_mode: settings.pageSegMode,
      preserve_interword_spaces: 1,
    };

    // Add character whitelist/blacklist if specified
    if (settings.whitelist) {
      parameters.tessedit_char_whitelist = settings.whitelist;
    }
    if (settings.blacklist) {
      parameters.tessedit_char_blacklist = settings.blacklist;
    }

    await worker.setParameters(parameters);

    progressCallback(60, 'Processing image...');

    const { data: { text, confidence } } = await worker.recognize(imageUrl);
    
    const processingTime = Date.now() - startTime;
    progressCallback(100, `Processing completed in ${processingTime}ms`);
    
    return {
      text: text || '',
      confidence: confidence || 0
    };
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error(`Failed to process image with OCR: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    await worker.terminate();
  }
};

// Utility function to preprocess image for better OCR results
export const preprocessImage = (canvas: HTMLCanvasElement, imageData: ImageData): ImageData => {
  const data = imageData.data;
  
  // Convert to grayscale and increase contrast
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    
    // Increase contrast
    const contrast = 1.5;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const enhancedGray = Math.min(255, Math.max(0, factor * (gray - 128) + 128));
    
    data[i] = enhancedGray;     // Red
    data[i + 1] = enhancedGray; // Green
    data[i + 2] = enhancedGray; // Blue
    // Alpha channel remains unchanged
  }
  
  return imageData;
};