import React, { useState } from 'react';
import { ClipboardCopy, AlertCircle } from 'lucide-react';
import { OCRResult } from '../types';

interface TextOutputProps {
  result: OCRResult | null;
  status: string;
}

const TextOutput: React.FC<TextOutputProps> = ({ result, status }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  if (status === 'loading') {
    return (
      <div className="result-container animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="result-container flex flex-col items-center justify-center text-center p-8">
        <AlertCircle className="h-12 w-12 text-error-500 mb-3" />
        <h4 className="text-lg font-medium text-gray-900 mb-1">Processing Failed</h4>
        <p className="text-gray-600">
          We couldn't extract text from this image. Please try a different image or check if the image contains readable text.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-container flex flex-col items-center justify-center text-center p-8">
        <div className="text-gray-400 mb-3">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-1">No Text Extracted Yet</h4>
        <p className="text-gray-600">
          Upload an image and click "Extract Text" to see the results here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Confidence: {Math.round(result.confidence)}%
          </span>
          {result.confidence < 70 && (
            <span className="text-xs text-warning-600">
              (Low confidence may indicate poor image quality)
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="btn btn-outline py-1 px-2 h-8"
          aria-label="Copy to clipboard"
        >
          <ClipboardCopy className="h-4 w-4 mr-1" />
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      <div className="result-container whitespace-pre-wrap font-mono text-sm">
        {result.text.trim() || (
          <span className="text-gray-500 italic">
            No text was found in this image. Try a different image with clearer text.
          </span>
        )}
      </div>
    </div>
  );
};

export default TextOutput;