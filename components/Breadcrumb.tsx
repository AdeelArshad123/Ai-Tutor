import React from 'react';
import { BreadcrumbItem, View } from '../types';
import { ChevronRightIcon } from './icons';

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    onNavigate: (view: View) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
    // Don't render a breadcrumb for a single item (like Home) or empty list
    if (items.length <= 1) {
        return <div className="h-[36px]"></div>; // Keep height consistent
    }

    return (
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-2">
            <ol className="flex items-center space-x-2 text-sm">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />}
                        {item.view && index < items.length - 1 ? (
                            <button onClick={() => onNavigate(item.view!)} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                {item.label}
                            </button>
                        ) : (
                            <span className="font-semibold text-black dark:text-white" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;