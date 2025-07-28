import React, { useState } from 'react';
import { 
  CheckCircle,
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  ArrowDownCircle
} from 'lucide-react';
import { IPCMatch } from '../types';

interface ResultsSectionProps {
  results: IPCMatch[];
  className?: string;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results, className = '' }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance > 0.8) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getRelevanceText = (relevance: number) => {
    if (relevance > 0.85) return 'High match';
    return 'Good match';
  };

  if (results.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center flex-col p-8 text-gray-500">
          <AlertTriangle size={48} className="text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Relevant Sections Found</h3>
          <p className="text-center text-sm">
            We couldn't identify any relevant IPC sections from the provided text. Please try with more detailed information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-blue-700 flex items-center">
          <CheckCircle size={20} className="mr-2 text-green-500" />
          Analysis Results
        </h2>
        
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {results.length} section{results.length !== 1 ? 's' : ''} found
        </span>
      </div>
      
      <div className="space-y-4">
        {results.map((match, index) => {
          const { section, relevance } = match;
          const sectionId = `section-${section.section}-${index}`;
          const isExpanded = expandedSections[sectionId] || false;
          
          return (
            <div 
              key={sectionId} 
              className="border border-gray-200 rounded-lg overflow-hidden transition-all"
            >
              <div className="bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-blue-700">
                        {section.section}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRelevanceColor(relevance)} bg-opacity-10 bg-current`}>
                        {getRelevanceText(relevance)}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 mt-1">
                      {section.offense || 'No specific offense title in data'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex gap-3 flex-wrap">
                    <div className="bg-blue-50 px-3 py-1.5 rounded text-sm flex-grow">
                      <span className="text-xs text-blue-600 font-medium block">Punishment:</span>
                      <span className="text-blue-800">
                        {section.punishment || 'Not specified in provided data'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleSection(sectionId)}
                  className="mt-3 text-sm text-blue-600 flex items-center hover:text-blue-700 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp size={16} className="mr-1" />
                      Hide details
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-1" />
                      Show details
                    </>
                  )}
                </button>
              </div>
              
              {isExpanded && (
                <div className="p-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">Reason/Description:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {section.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowDownCircle size={16} className="mr-1 rotate-180" />
          Back to top
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;