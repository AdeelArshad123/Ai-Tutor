import React, { useState, useEffect } from 'react';
import { searchTopics } from '../services/geminiService';

interface SearchResultsPageProps {
  query: string;
  onBack: () => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, onBack }) => {
    const [results, setResults] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await searchTopics(query);
                setResults(response);
            } catch (e) {
                setError('An error occurred while searching. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                &larr; Back to Home
            </button>
            <h1 className="text-3xl font-bold mb-4">Search Results for: <span className="text-cyan-400">"{query}"</span></h1>
            
            <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 min-h-[200px]">
                {isLoading && <p>🤖 Searching...</p>}
                {error && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: error }} />}
                {results && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: results }} />}
            </div>
        </div>
    );
};

export default SearchResultsPage;