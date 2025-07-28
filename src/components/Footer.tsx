import React from 'react';
import { GithubIcon, Scale } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-600 text-white py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex items-center">
            <Scale size={20} className="text-secondary-300 mr-2" />
            <span className="text-sm">FIR Analysis System © {new Date().getFullYear()}</span>
          </div>
          
          
          
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;