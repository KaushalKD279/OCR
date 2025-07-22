import React from 'react';
import { Settings, Languages, Type, Filter } from 'lucide-react';
import { OCRSettings as OCRSettingsType } from '../types';

interface OCRSettingsProps {
  settings: OCRSettingsType;
  onSettingsChange: (settings: OCRSettingsType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const OCRSettings: React.FC<OCRSettingsProps> = ({
  settings,
  onSettingsChange,
  isOpen,
  onToggle
}) => {
  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'ita', name: 'Italian' },
    { code: 'por', name: 'Portuguese' },
    { code: 'rus', name: 'Russian' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'kor', name: 'Korean' },
    { code: 'ara', name: 'Arabic' },
    { code: 'hin', name: 'Hindi' }
  ];

  const pageSegModes = [
    { value: 0, name: 'Orientation and script detection (OSD) only' },
    { value: 1, name: 'Automatic page segmentation with OSD' },
    { value: 3, name: 'Fully automatic page segmentation (default)' },
    { value: 4, name: 'Assume a single column of text of variable sizes' },
    { value: 6, name: 'Assume a single uniform block of text' },
    { value: 7, name: 'Treat the image as a single text line' },
    { value: 8, name: 'Treat the image as a single word' },
    { value: 10, name: 'Treat the image as a single character' },
    { value: 11, name: 'Sparse text. Find as much text as possible' },
    { value: 13, name: 'Raw line. Treat as single text line, bypassing hacks' }
  ];

  const ocrEngineModes = [
    { value: 0, name: 'Legacy engine only' },
    { value: 1, name: 'Neural nets LSTM engine only' },
    { value: 2, name: 'Legacy + LSTM engines' },
    { value: 3, name: 'Default, based on what is available' }
  ];

  const handleSettingChange = (key: keyof OCRSettingsType, value: string | number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        <Settings className="h-4 w-4" />
        <span>OCR Settings</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="card p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Languages className="h-4 w-4" />
                <span>Language</span>
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Type className="h-4 w-4" />
                <span>OCR Engine Mode</span>
              </label>
              <select
                value={settings.ocrEngineMode}
                onChange={(e) => handleSettingChange('ocrEngineMode', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {ocrEngineModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Filter className="h-4 w-4" />
              <span>Page Segmentation Mode</span>
            </label>
            <select
              value={settings.pageSegMode}
              onChange={(e) => handleSettingChange('pageSegMode', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {pageSegModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Character Whitelist (optional)
              </label>
              <input
                type="text"
                value={settings.whitelist || ''}
                onChange={(e) => handleSettingChange('whitelist', e.target.value)}
                placeholder="e.g., 0123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Only recognize these characters</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Character Blacklist (optional)
              </label>
              <input
                type="text"
                value={settings.blacklist || ''}
                onChange={(e) => handleSettingChange('blacklist', e.target.value)}
                placeholder="e.g., @#$%"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Ignore these characters</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OCRSettings;