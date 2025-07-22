import React from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { ProcessingStatus as ProcessingStatusType } from '../types';

interface ProcessingStatusProps {
  status: ProcessingStatusType;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status.status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-error-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'loading':
        return 'text-primary-700';
      case 'success':
        return 'text-success-700';
      case 'error':
        return 'text-error-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="card p-4">
      <div className="flex items-center space-x-2 mb-2">
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {status.status === 'loading' ? 'Processing...' : status.message}
        </span>
      </div>
      
      {status.status === 'loading' && (
        <>
          <div className="progress-bar">
            <div 
              className="progress-value" 
              style={{ width: `${status.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {status.message}
          </p>
        </>
      )}
    </div>
  );
};

export default ProcessingStatus;