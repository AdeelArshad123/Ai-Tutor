import React, { useState } from 'react';
import { Language, Topic, User } from '../types';
import { isTopicComplete, getLanguageProgress } from '../utils/progress';
import { CheckCircleIcon } from './icons';
import { generateProjectIdea } from '../services/geminiService';

interface LanguagePageProps {
  language: Language;
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void;
  user: User;
}

const LanguagePage: React.FC<LanguagePageProps> = ({ language, onSelectTopic, onBack, user }) => {
  const progress = getLanguageProgress(user.username, language.slug, language.topics.length);
  const [projectIdea, setProjectIdea] = useState<string>('');
  const [isProjectLoading, setIsProjectLoading] = useState<boolean>(false);
  const [projectError, setProjectError] = useState<string>('');

  const handleSuggestProject = async () => {
    setIsProjectLoading(true);
    setProjectError('');
    setProjectIdea('');
    try {
      const topicTitles = language.topics.map(t => t.title);
      const result = await generateProjectIdea(language.name, topicTitles);
      setProjectIdea(result);
    } catch (e) {
      setProjectError('An error occurred while generating a project idea. Please try again.');
    } finally {
      setIsProjectLoading(false);
    }
  };


  return (
    <div>
      <button onClick={onBack} className="mb-6 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
        &larr; Back to Home
      </button>

      <div className="flex items-center mb-8">
        <img src={language.logo} alt={`${language.name} logo`} className="h-20 w-20 mr-6" />
        <div>
          <h1 className="text-4xl font-bold">{language.name}</h1>
          <p className="text-slate-400 mt-1">{language.description}</p>
        </div>
      </div>
      
      {language.topics.length > 0 && (
          <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2 text-cyan-400">Progress</h2>
              <div className="w-full bg-black/20 rounded-full h-4 border border-white/10">
                  <div 
                      className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-4 rounded-full" 
                      style={{ width: `${progress}%` }}
                  ></div>
              </div>
              <p className="text-right text-slate-400 text-sm mt-1">{progress}% Complete</p>
          </div>
      )}

      <div className="my-8 p-6 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
        <h3 className="text-xl font-semibold text-cyan-400 mb-3">Stuck on what to build?</h3>
        <p className="text-slate-400 mb-4">Let our AI Tutor suggest a project to help you practice these concepts.</p>
        <button
            onClick={handleSuggestProject}
            disabled={isProjectLoading}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-cyan-500 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
            {isProjectLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : '🤖'}
            <span className="ml-2">Suggest a Project</span>
        </button>

        { (isProjectLoading || projectError || projectIdea) && (
            <div className="mt-4 p-4 bg-black/20 rounded-lg">
                {isProjectLoading && <p>🤖 Thinking of a great project for you...</p>}
                {projectError && <p className="text-red-400">{projectError}</p>}
                {projectIdea && (
                    <div className="prose prose-invert max-w-none prose-h4:text-cyan-400" dangerouslySetInnerHTML={{__html: projectIdea}} />
                )}
            </div>
        )}
      </div>


      <div className="space-y-4">
        <h2 className="text-3xl font-semibold text-cyan-400 border-b-2 border-white/10 pb-2">Topics</h2>
        {language.topics.map((topic) => {
          const completed = isTopicComplete(user.username, language.slug, topic.slug);
          return (
            <div
              key={topic.slug}
              onClick={() => onSelectTopic(topic)}
              className="bg-black/20 backdrop-blur-xl p-6 rounded-xl shadow-md cursor-pointer border border-white/10 hover:border-cyan-500/50 transition-all flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-white">{topic.title}</h3>
                <p className="text-slate-400 mt-1">{topic.description}</p>
              </div>
              {completed && (
                <div className="flex-shrink-0 ml-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguagePage;