import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Info, 
  Clock, 
  Trash2 
} from 'lucide-react';
import Button from './ui/Button';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSubmit: (text: string) => void;
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
  history: {query: string, results: any[]}[];
  onHistoryItemClick: (item: {query: string, results: any[]}) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  inputText,
  setInputText,
  onSubmit,
  onFileUpload,
  isAnalyzing,
  history,
  onHistoryItemClick
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-primary-700 flex items-center">
          <FileText size={20} className="mr-2 text-secondary-500" />
          FIR Complaint Analysis
        </h2>
        
        {history.length > 0 && (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center"
          >
            <Clock size={16} className="mr-1" />
            <span>History</span>
          </Button>
        )}
      </div>

      {showHistory && history.length > 0 && (
        <div className="mb-6 border rounded-md p-3 bg-neutral-50 animate-slide-down">
          <h3 className="text-sm font-semibold mb-2 text-primary-600">Recent Analyses</h3>
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li 
                key={index} 
                className="text-sm border-b pb-2 last:border-0 flex items-center justify-between"
              >
                <button
                  onClick={() => onHistoryItemClick(item)}
                  className="text-left hover:text-secondary-600 transition-colors overflow-hidden overflow-ellipsis max-w-[80%]"
                >
                  {truncateText(item.query)}
                </button>
                <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                  {item.results.length} matches
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4 mb-4">
        <div className="flex items-start text-xs text-neutral-600 mb-3">
          <Info size={14} className="mr-1 mt-0.5 flex-shrink-0 text-secondary-500" />
          <p>Enter your FIR complaint text or upload a file below. The system will analyze it and suggest relevant IPC sections.</p>
        </div>
        
        <textarea 
          className="w-full p-3 border border-neutral-300 rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-secondary-400 transition-shadow"
          placeholder="Enter FIR complaint text here..."
          value={inputText}
          onChange={handleTextChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Button
          onClick={() => onSubmit(inputText)}
          disabled={!inputText.trim() || isAnalyzing}
          isLoading={isAnalyzing}
          className="flex-1"
        >
          {!isAnalyzing && <Search size={18} className="mr-2" />}
          {isAnalyzing ? 'Analyzing...' : 'Analyze Complaint'}
        </Button>

        <Button
          variant="outline"
          onClick={triggerFileInput}
          disabled={isAnalyzing}
          className="flex-1"
        >
          <Upload size={18} className="mr-2" />
          Upload FIR Document
        </Button>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".txt,.pdf,.doc,.docx"
          className="hidden"
        />
      </div>

      {inputText && (
        <div className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInputText('')}
            className="text-neutral-500"
          >
            <Trash2 size={16} className="mr-1" />
            Clear text
          </Button>
        </div>
      )}
    </div>
  );
};

export default InputSection;