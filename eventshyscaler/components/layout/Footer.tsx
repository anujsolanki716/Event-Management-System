import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-6 text-center text-dark-text-secondary">
        <p>&copy; {new Date().getFullYear()} EventsHyScaler. All rights reserved.</p>
        
      </div>
    </footer>
  );
};

export default Footer;