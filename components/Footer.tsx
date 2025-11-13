import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full mt-auto bg-gray-50/50 dark:bg-black/50 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} StackTutor. All rights reserved.</p>
                <p className="text-sm mt-1">Your AI-Powered Coding Companion</p>
            </div>
        </footer>
    );
};

export default Footer;