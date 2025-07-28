import React from 'react';
import { Scale } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Scale size={28} className="text-secondary-300 mr-3" />
            <div>
              <h1 className="text-xl font-bold leading-tight sm:text-2xl">AI for Legal Information</h1>
              <p className="text-xs text-primary-200 sm:text-sm">Indian Penal Code Section Matcher</p>
            </div>
          </div>
          
          
        </div>
      </div>
    </header>
  );
};

export default Header;