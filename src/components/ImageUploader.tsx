import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { ProcessedImage } from '../types';

interface ImageUploaderProps {
  onImageSelected: (image: ProcessedImage) => void;
  currentImage: ProcessedImage | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelected, 
  currentImage 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG or JPEG)');
      return false;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError('Image size should be less than 5MB');
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const processFile = (file: File) => {
    if (!validateFile(file)) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected({
          file,
          preview: e.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [onImageSelected]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  }, [onImageSelected]);
  
  const handleRemoveImage = useCallback(() => {
    onImageSelected({
      file: new File([], ''),
      preview: ''
    });
  }, [onImageSelected]);

  return (
    <div className="card p-4">
      {currentImage && currentImage.preview ? (
        <div className="space-y-3">
          <div className="relative">
            <img 
              src={currentImage.preview} 
              alt="Preview" 
              className="w-full h-auto rounded-md object-contain max-h-[300px]" 
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-500 truncate">
            {currentImage.file.name}
          </p>
        </div>
      ) : (
        <div
          className={`drop-zone ${isDragging ? 'drop-zone-active' : 'drop-zone-inactive'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-3 p-3 bg-primary-50 rounded-full">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
            <p className="text-base font-medium text-gray-900">
              Drag and drop image here or click to browse
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Supports JPG, PNG up to 5MB
            </p>
            <label className="btn btn-outline mt-4 cursor-pointer">
              <span>Select File</span>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-error-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;