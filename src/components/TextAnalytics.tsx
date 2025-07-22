import React from 'react';
import { BarChart3, FileText, Clock, Target } from 'lucide-react';
import { OCRResult } from '../types';

interface TextAnalyticsProps {
  result: OCRResult;
}

const TextAnalytics: React.FC<TextAnalyticsProps> = ({ result }) => {
  const getTextStats = () => {
    const text = result.text.trim();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    return {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      characters,
      charactersNoSpaces,
      avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
      readingTime: Math.ceil(words.length / 200) // Assuming 200 words per minute
    };
  };

  const stats = getTextStats();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-success-600 bg-success-50';
    if (confidence >= 70) return 'text-warning-600 bg-warning-50';
    return 'text-error-600 bg-error-50';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return 'Excellent';
    if (confidence >= 70) return 'Good';
    if (confidence >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <BarChart3 className="h-5 w-5 text-primary-600" />
        <h4 className="text-lg font-semibold text-gray-900">Text Analytics</h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">{stats.words}</div>
          <div className="text-sm text-gray-600">Words</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-secondary-600">{stats.sentences}</div>
          <div className="text-sm text-gray-600">Sentences</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.characters}</div>
          <div className="text-sm text-gray-600">Characters</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">{stats.paragraphs}</div>
          <div className="text-sm text-gray-600">Paragraphs</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Target className={`h-5 w-5 ${getConfidenceColor(result.confidence).split(' ')[0]}`} />
          <div>
            <div className="text-sm font-medium text-gray-900">
              Confidence: {Math.round(result.confidence)}%
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(result.confidence)}`}>
              {getConfidenceLabel(result.confidence)}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Clock className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-sm font-medium text-gray-900">Reading Time</div>
            <div className="text-xs text-gray-600">~{stats.readingTime} min</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <FileText className="h-5 w-5 text-green-600" />
          <div>
            <div className="text-sm font-medium text-gray-900">Avg Words/Sentence</div>
            <div className="text-xs text-gray-600">{stats.avgWordsPerSentence}</div>
          </div>
        </div>
      </div>

      {result.processingTime && (
        <div className="text-xs text-gray-500 text-center">
          Processing completed in {result.processingTime}ms
        </div>
      )}
    </div>
  );
};

export default TextAnalytics;