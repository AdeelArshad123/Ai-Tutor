
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent border-t border-white/10 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} StackTutor. All rights reserved.</p>
        <p className="text-sm mt-1">Learn. Code. Master — with AI.</p>
      </div>
    </footer>
  );
};

export default Footer;