import React, { useState, useEffect, useRef } from 'react';
import { searchTopics } from '../services/geminiService';
import { Language, Topic } from '../types';
import { learningData } from '../constants';

interface SearchResultsPageProps {
  query: string;
  onBack: () => void;
  onNavigate: (view: { name: 'topic', language: Language, topic: Topic }) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, onBack, onNavigate }) => {
    const [results, setResults] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const resultsRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const link = target.closest('a[data-type="topic"]');
            if (link) {
                event.preventDefault();
                const langSlug = link.getAttribute('data-language-slug');
                const topicSlug = link.getAttribute('data-topic-slug');
                
                if (langSlug && topicSlug) {
                    const language = learningData.flatMap(c => c.languages).find(l => l.slug === langSlug);
                    if (language) {
                        const topic = language.topics.find(t => t.slug === topicSlug);
                        if (topic) {
                            onNavigate({ name: 'topic', language, topic });
                        }
                    }
                }
            }
        };

        const container = resultsRef.current;
        container?.addEventListener('click', handleClick);

        return () => {
            container?.removeEventListener('click', handleClick);
        };
    }, [results, onNavigate]);

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-white/10 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
                &larr; Back to Home
            </button>
            <h1 className="text-3xl font-bold mb-4">Search Results for: <span className="text-blue-600 dark:text-cyan-400">"{query}"</span></h1>
            
            <div ref={resultsRef} className="bg-white dark:bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 dark:border-white/10 min-h-[200px]">
                {isLoading && <p>🤖 Searching...</p>}
                {error && <div className="prose dark:prose-invert max-w-none">{error}</div>}
                {results && <div className="prose dark:prose-invert max-w-none prose-a:text-blue-600 dark:prose-a:text-cyan-400 hover:prose-a:text-blue-500 dark:hover:prose-a:text-cyan-300" dangerouslySetInnerHTML={{ __html: results }} />}
            </div>
        </div>
    );
};

export default SearchResultsPage;