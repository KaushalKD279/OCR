import React from 'react';
import { Clock, Image } from 'lucide-react';
import { OCRResult } from '../types';

interface RecentResultsProps {
  results: OCRResult[];
  onSelectResult: (result: OCRResult) => void;
}

const RecentResults: React.FC<RecentResultsProps> = ({ 
  results, 
  onSelectResult 
}) => {
  if (!results.length) return null;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const truncateText = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-gray-500" />
        <h3 className="text-xl font-semibold text-gray-900">Recent Results</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <button
            key={result.id}
            onClick={() => onSelectResult(result)}
            className="card p-3 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex space-x-3">
              <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                {result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt="Processed image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-primary-600">
                    {formatTimestamp(result.timestamp)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(result.confidence)}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-900 truncate">
                  {truncateText(result.text.trim() || 'No text found', 80)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentResults;