import React, { useState, useCallback } from 'react';
import ImageUploader from './ImageUploader';
import ProcessingStatus from './ProcessingStatus';
import TextOutput from './TextOutput';
import TextEditor from './TextEditor';
import TextAnalytics from './TextAnalytics';
import OCRSettings from './OCRSettings';
import RecentResults from './RecentResults';
import SummarizerModal from './SummarizerModal';
import { OCRResult, ProcessedImage, ProcessingStatus as ProcessingStatusType, OCRSettings as OCRSettingsType } from '../types';
import { processImageWithOCR } from '../utils/ocrProcessing';

const OCRImageProcessor: React.FC = () => {
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = useState<ProcessingStatusType>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [result, setResult] = useState<OCRResult | null>(null);
  const [recentResults, setRecentResults] = useState<OCRResult[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSummarizer, setShowSummarizer] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizerError, setSummarizerError] = useState<string | null>(null);
  const [ocrSettings, setOcrSettings] = useState<OCRSettingsType>({
    language: 'eng',
    pageSegMode: 3,
    ocrEngineMode: 1
  });

  const handleImageUpload = useCallback((newImage: ProcessedImage) => {
    setImage(newImage);
    setResult(null);
    setShowEditor(false);
    setShowAnalytics(false);
    setProcessing({
      status: 'idle',
      progress: 0,
      message: ''
    });
    setSummary(null);
    setSummarizerError(null);
  }, []);

  const handleProcessImage = useCallback(async () => {
    if (!image) return;
    
    const startTime = Date.now();
    
    try {
      setProcessing({
        status: 'loading',
        progress: 0,
        message: 'Initializing OCR engine...'
      });
      
      const ocrResult = await processImageWithOCR(
        image.preview,
        (progress: number, message: string) => {
          setProcessing({
            status: 'loading',
            progress,
            message
          });
        },
        ocrSettings
      );
      
      const processingTime = Date.now() - startTime;
      const wordCount = ocrResult.text.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      const newResult: OCRResult = {
        id: Date.now().toString(),
        imageUrl: image.preview,
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        timestamp: Date.now(),
        language: ocrSettings.language,
        wordCount,
        processingTime
      };
      
      setResult(newResult);
      setRecentResults(prev => [newResult, ...prev].slice(0, 10));
      setShowAnalytics(true);
      setProcessing({
        status: 'success',
        progress: 100,
        message: `Text extraction complete! Found ${wordCount} words in ${processingTime}ms`
      });
    } catch (error) {
      console.error('OCR processing error:', error);
      setProcessing({
        status: 'error',
        progress: 0,
        message: 'Failed to process image. Please try again with a clearer image.'
      });
    }
  }, [image, ocrSettings]);

  const handleSummarize = async () => {
    if (!result || !result.text) return;

    setIsSummarizing(true);
    setSummarizerError(null);
    setSummary(null);
    setShowSummarizer(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textToSummarize: result.text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get a valid response from the server.');
      }

      const data = await response.json();
      setSummary(data[0].summary_text);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setSummarizerError(errorMessage);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleReset = useCallback(() => {
    setImage(null);
    setResult(null);
    setShowEditor(false);
    setShowAnalytics(false);
    setProcessing({
      status: 'idle',
      progress: 0,
      message: ''
    });
    setSummary(null);
    setSummarizerError(null);
  }, []);

  const loadPreviousResult = useCallback((selectedResult: OCRResult) => {
    setResult(selectedResult);
    setShowAnalytics(true);
    setProcessing({
      status: 'success',
      progress: 100,
      message: 'Previous result loaded'
    });
  }, []);

  const handleTextSave = useCallback((editedText: string) => {
    if (result) {
      const updatedResult = {
        ...result,
        text: editedText,
        timestamp: Date.now()
      };
      setResult(updatedResult);
      
      // Update in recent results
      setRecentResults(prev => 
        prev.map(r => r.id === result.id ? updatedResult : r)
      );
    }
  }, [result]);

  return (
    <div className="space-y-8">
      <OCRSettings
        settings={ocrSettings}
        onSettingsChange={setOcrSettings}
        isOpen={showSettings}
        onToggle={() => setShowSettings(!showSettings)}
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Upload Image</h3>
          <ImageUploader 
            onImageSelected={handleImageUpload} 
            currentImage={image} 
          />
          
          {image && processing.status !== 'loading' && processing.status !== 'success' && (
            <button 
              onClick={handleProcessImage} 
              className="btn btn-primary w-full mt-4"
            >
              Extract Text ({ocrSettings.language.toUpperCase()})
            </button>
          )}
          
          {(processing.status === 'loading' || processing.status === 'success') && (
            <ProcessingStatus status={processing} />
          )}
          
          {(processing.status === 'success' || processing.status === 'error') && (
            <button 
              onClick={handleReset} 
              className="btn btn-outline w-full mt-2"
            >
              Upload New Image
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Extracted Text</h3>
            {result && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowEditor(!showEditor)}
                  className={`btn ${showEditor ? 'btn-primary' : 'btn-outline'} py-1 px-3 h-8`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`btn ${showAnalytics ? 'btn-primary' : 'btn-outline'} py-1 px-3 h-8`}
                >
                  Analytics
                </button>
                <button
                  onClick={handleSummarize}
                  className="btn btn-outline py-1 px-3 h-8"
                  disabled={!result || !result.text}
                >
                  Summarize
                </button>
              </div>
            )}
          </div>
          
          {showEditor && result ? (
            <TextEditor 
              initialText={result.text} 
              onSave={handleTextSave}
            />
          ) : (
            <TextOutput result={result} status={processing.status} />
          )}
        </div>
      </div>
      
      {showAnalytics && result && (
        <TextAnalytics result={result} />
      )}
      
      {recentResults.length > 0 && (
        <RecentResults 
          results={recentResults} 
          onSelectResult={loadPreviousResult} 
        />
      )}
      
      <SummarizerModal 
        isOpen={showSummarizer}
        onClose={() => setShowSummarizer(false)}
        summary={summary}
        isLoading={isSummarizing}
        error={summarizerError}
      />
    </div>
  );
};

export default OCRImageProcessor;