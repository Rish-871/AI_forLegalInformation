import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IPCSection } from '../types';
import { Upload, FileText, Search, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';

const IPCSectionFinder: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<IPCSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check file type
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Please upload a text file (.txt)');
      return;
    }

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setError('File size should be less than 1MB');
      return;
    }

    try {
      const text = await file.text();
      setInput(text);
      setFileName(file.name);
      setError(null);
    } catch (err) {
      setError('Error reading file. Please try again.');
      console.error('File reading error:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please enter a complaint description or upload a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found. Please check your environment variables.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
        }
      });

      const prompt = `Analyze the following disaster scenario and identify relevant IPC sections. Format the response as follows:
**1. Relating to [brief context]:**
*   **Section:** [IPC section number]
*   **Offense:** [offense description]
*   **Punishment:** [punishment details]
*   **Reason:** [why this section is relevant]

Focus on identifying specific IPC sections related to:
- Negligence causing death or injury
- Environmental damage
- Public safety violations
- Property damage
- Workplace safety violations

Scenario: ${input}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response into IPCSection objects
      const sections: IPCSection[] = [];
      const sectionRegex = /\*\*(\d+)\. Relating to (.*?):\*\*\s*\n\s*\*   \*\*Section:\*\* (.*?)\n\s*\*   \*\*Offense:\*\* (.*?)\n\s*\*   \*\*Punishment:\*\* (.*?)\n\s*\*   \*\*Reason:\*\* (.*?)(?=\n\s*\*\*|\n$)/gs;
      
      let match;
      while ((match = sectionRegex.exec(text)) !== null) {
        sections.push({
          section: match[3].trim(),
          offense: match[4].trim(),
          punishment: match[5].trim(),
          description: match[2].trim(),
          reason: match[6].trim(),
        });
      }

      if (sections.length === 0) {
        setError('No relevant IPC sections found. Please try with a more detailed description.');
        return;
      }

      setResponse(sections);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing your request.';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => {
    setInput('');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">
            AI for Legal Information
          </h1>
          <p className="text-lg text-neutral-600">
            Intelligent legal analysis at your fingertips
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transform transition-all duration-300 hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="complaint" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your complaint description or upload a file:
              </label>
              <div className="space-y-4">
                <textarea
                  id="complaint"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Describe the incident in detail..."
                />
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".txt"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </label>
                    {fileName && (
                      <span className="ml-3 text-sm text-gray-600 flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {fileName}
                      </span>
                    )}
                  </div>
                  {input && (
                    <button
                      type="button"
                      onClick={clearInput}
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Find Relevant IPC Sections
                </>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {response.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            {response.map((section, index) => {
              const sectionId = `section-${section.section}-${index}`;
              const isExpanded = expandedSections[sectionId] || false;
              
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">
                          {section.section}
                        </h2>
                        <p className="text-lg font-medium text-gray-800 mb-4">
                          {section.offense}
                        </p>
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <p className="text-blue-800">
                            <span className="font-semibold">Punishment:</span> {section.punishment}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSection(sectionId)}
                        className="ml-4 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-down">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-1">Description:</h3>
                            <p className="text-gray-700">{section.description}</p>
                          </div>
                          {section.reason && (
                            <div>
                              <h3 className="text-sm font-semibold text-gray-600 mb-1">Reason:</h3>
                              <p className="text-gray-700">{section.reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default IPCSectionFinder; 