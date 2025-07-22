import React, { useState, useRef } from 'react';
import { Edit3, Save, Undo, Download, Search, Replace } from 'lucide-react';

interface TextEditorProps {
  initialText: string;
  onSave: (text: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ initialText, onSave }) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  const handleUndo = () => {
    setText(initialText);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFindReplace = () => {
    if (searchTerm && replaceTerm) {
      const newText = text.replace(new RegExp(searchTerm, 'g'), replaceTerm);
      setText(newText);
      setSearchTerm('');
      setReplaceTerm('');
    }
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`btn ${isEditing ? 'btn-secondary' : 'btn-outline'} py-1 px-3 h-8`}
          >
            <Edit3 className="h-4 w-4 mr-1" />
            {isEditing ? 'View' : 'Edit'}
          </button>
          
          {isEditing && (
            <>
              <button
                onClick={handleSave}
                className="btn btn-primary py-1 px-3 h-8"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </button>
              <button
                onClick={handleUndo}
                className="btn btn-outline py-1 px-3 h-8"
              >
                <Undo className="h-4 w-4 mr-1" />
                Undo
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFindReplace(!showFindReplace)}
            className="btn btn-outline py-1 px-3 h-8"
          >
            <Search className="h-4 w-4 mr-1" />
            Find
          </button>
          <button
            onClick={handleDownload}
            className="btn btn-outline py-1 px-3 h-8"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </button>
        </div>
      </div>

      {showFindReplace && (
        <div className="card p-3 space-y-2">
          <div className="grid md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Find..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <button
              onClick={handleFindReplace}
              className="btn btn-primary py-2 px-3"
            >
              <Replace className="h-4 w-4 mr-1" />
              Replace All
            </button>
          </div>
        </div>
      )}

      <div className="result-container">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 p-3 border-none resize-none focus:outline-none font-mono text-sm"
            placeholder="Edit your extracted text here..."
          />
        ) : (
          <div 
            className="whitespace-pre-wrap font-mono text-sm min-h-[16rem] p-3"
            dangerouslySetInnerHTML={{
              __html: highlightSearchTerm(text, searchTerm)
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TextEditor;