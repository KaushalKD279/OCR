import React from 'react';
import { BookOpen, Github, ImageIcon } from 'lucide-react';
import OCRImageProcessor from './components/OCRImageProcessor';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">OCR Text Extractor</h1>
          </div>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="View on GitHub"
          >
            <Github className="h-6 w-6" />
          </a>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-primary-100 rounded-full mb-4">
              <ImageIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Extract Text from Images</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload an image containing text and our OCR technology will extract the content for you.
              Supports JPG, PNG, and JPEG formats.
            </p>
          </div>
          
          <OCRImageProcessor />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Built with React, Tesseract.js, and Tailwind CSS. Images are processed entirely in your browser.</p>
          <p className="mt-2">© {new Date().getFullYear()} OCR Text Extractor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;