import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Topic, Language, User, View, Exercise, ResourceLink } from '../types';
import { explainCode, simplifyTopic, generateQuiz, reviewCode } from '../services/geminiService';
import { markTopicAsComplete } from '../utils/progress';
import { runCode } from '../utils/codeRunner';
import CodeBlock from './CodeBlock';
import { Quiz as QuizType } from '../types';
import { SparklesIcon, ExternalLinkIcon, PlayIcon, YouTubeIcon, GitHubIcon, BookOpenIcon, NewspaperIcon, UsersIcon } from './icons';
import CodeEditor from './CodeEditor';

const Quiz = lazy(() => import('./Quiz'));

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-4">
        <svg className="animate-spin h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const ResourceCard: React.FC<{ resource: ResourceLink }> = ({ resource }) => {
    const Icon = {
        youtube: YouTubeIcon,
        github: GitHubIcon,
        documentation: BookOpenIcon,
        article: NewspaperIcon,
        tutor: UsersIcon
    }[resource.type];

    return (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                   <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                    <h4 className="font-semibold text-black dark:text-white">{resource.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
                </div>
            </div>
        </a>
    );
};


interface TopicPageProps {
  topic: Topic;
  language: Language;
  onBack: () => void;
  user: User;
  onNavigate: (view: View) => void;
}

const TopicPage: React.FC<TopicPageProps> = ({ topic, language, onBack, user }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(topic.exercises?.[0] || null);
  const [userCode, setUserCode] = useState(activeExercise?.starterCode || '');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [review, setReview] = useState('');
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  
  useEffect(() => {
    // Mark topic as complete when viewed
    markTopicAsComplete(user.username, language.slug, topic.slug);
  }, [user.username, language.slug, topic.slug]);

  useEffect(() => {
      if (activeExercise) {
          setUserCode(activeExercise.starterCode);
          setTestResults([]);
          setReview('');
      }
  }, [activeExercise]);

  const handleAiAction = async (action: 'explain' | 'simplify') => {
    setIsLoadingAi(true);
    setAiResponse('');
    try {
      const response = action === 'explain'
        ? await explainCode(topic.codeExample, language.name)
        : await simplifyTopic(topic.longDescription);
      setAiResponse(response);
    } catch (error) {
      setAiResponse('<p class="text-gray-600 dark:text-gray-400">Sorry, an error occurred.</p>');
    }
    setIsLoadingAi(false);
  };
  
  const handleGenerateQuiz = async () => {
      setIsLoadingQuiz(true);
      setQuiz(null);
      setQuizError('');
      try {
          const generatedQuiz = await generateQuiz(topic.title, topic.longDescription);
          setQuiz(generatedQuiz);
      } catch(e) {
          setQuizError((e as Error).message);
      }
      setIsLoadingQuiz(false);
  };
  
  const handleRunCode = () => {
      if (!activeExercise) return;
      setIsTesting(true);
      setTimeout(() => { // Simulate execution time
          const results = runCode(userCode, activeExercise, language.slug);
          setTestResults(results);
          setIsTesting(false);

          const allPassed = results.every(r => r.passed);
          if (allPassed) {
              handleGetReview();
          }
      }, 500);
  };

  const handleGetReview = async () => {
      if (!activeExercise) return;
      setIsLoadingReview(true);
      setReview('');
      try {
          const aiReview = await reviewCode(userCode, language.name, activeExercise.description);
          setReview(aiReview);
      } catch (e) {
          console.error("Review generation failed", e);
      }
      setIsLoadingReview(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
          &larr; Back to {language.name}
        </button>
        <h1 className="text-4xl font-bold text-black dark:text-white">{topic.title}</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl">{topic.longDescription}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Code Example & AI Helper */}
            <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Code Example</h2>
                <CodeBlock code={topic.codeExample} language={language.slug} />
                <div className="flex gap-4 mt-4">
                    <button onClick={() => handleAiAction('explain')} disabled={isLoadingAi} className="flex-1 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                       <SparklesIcon className="w-5 h-5 inline-block mr-2" /> Explain Code
                    </button>
                    <button onClick={() => handleAiAction('simplify')} disabled={isLoadingAi} className="flex-1 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                       <SparklesIcon className="w-5 h-5 inline-block mr-2" /> Simplify Topic
                    </button>
                </div>
                {isLoadingAi && <LoadingSpinner />}
                {aiResponse && <div className="mt-4 prose dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300" dangerouslySetInnerHTML={{ __html: aiResponse }} />}
            </div>

            {/* Exercises */}
            {topic.exercises && topic.exercises.length > 0 && (
                <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-4">Exercises</h2>
                     {topic.exercises.length > 1 && (
                         <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
                             {topic.exercises.map(ex => (
                                 <button key={ex.id} onClick={() => setActiveExercise(ex)} className={`py-2 px-4 text-sm font-medium ${activeExercise?.id === ex.id ? 'border-b-2 border-black dark:border-white text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>
                                     {ex.id.toUpperCase()}
                                 </button>
                             ))}
                         </div>
                     )}
                     {activeExercise && (
                         <div>
                             <p className="mb-4">{activeExercise.description}</p>
                             <div className="w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-white">
                                 <CodeEditor
                                    value={userCode}
                                    onChange={setUserCode}
                                    language={language.slug}
                                    height="250px"
                                />
                            </div>
                             <button onClick={handleRunCode} disabled={isTesting} className="mt-4 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50">
                                 <PlayIcon className="w-5 h-5" /> Run Tests
                             </button>
                             {isTesting && <LoadingSpinner />}
                             {testResults.length > 0 && (
                                <div className="mt-4 space-y-2">
                                     <h3 className="font-bold">Test Results:</h3>
                                     {testResults.map((result, i) => (
                                         <div key={i} className={`p-2 rounded-md text-sm ${result.passed ? 'bg-green-100 dark:bg-gray-800' : 'bg-red-100 dark:bg-gray-800'}`}>
                                            <p><strong>Test {i+1}:</strong> <span className={result.passed ? 'text-green-800 dark:text-white' : 'text-red-800 dark:text-gray-300'}>{result.passed ? 'Passed' : 'Failed'}</span></p>
                                            {!result.passed && <p className="font-mono text-xs mt-1">Expected: {result.expected}, Got: {result.output}</p>}
                                         </div>
                                     ))}
                                </div>
                             )}
                             {isLoadingReview && <div className="mt-4"><LoadingSpinner /></div>}
                             {review && (
                                 <div className="mt-4">
                                     <h3 className="font-bold text-lg">AI Code Review:</h3>
                                      <div className="mt-2 prose dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300" dangerouslySetInnerHTML={{ __html: review }} />
                                 </div>
                             )}
                         </div>
                     )}
                </div>
            )}
            
            {/* Quiz */}
             <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                 <h2 className="text-2xl font-bold mb-4">Test Your Knowledge</h2>
                 {isLoadingQuiz && <LoadingSpinner />}
                 {quiz ? (
                     <Suspense fallback={<LoadingSpinner />}>
                        <Quiz quiz={quiz} />
                     </Suspense>
                 ) : (
                     <button onClick={handleGenerateQuiz} disabled={isLoadingQuiz} className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                        <SparklesIcon className="w-5 h-5 inline-block mr-2" /> Generate Quiz
                     </button>
                 )}
                 {quizError && <p className="text-red-500 dark:text-red-400 mt-2 text-sm">{quizError}</p>}
             </div>

        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
            {(topic.resources || topic.externalLinks) && (
                 <div className="space-y-4">
                    <h2 className="text-2xl font-bold border-l-4 border-gray-400 dark:border-gray-500 pl-3">Resources</h2>
                     {topic.resources?.map(res => <ResourceCard key={res.url} resource={res} />)}
                     {topic.externalLinks.map(link => (
                         <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.url} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                             <span className="font-semibold text-black dark:text-white">{link.name}</span>
                             <ExternalLinkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                         </a>
                     ))}
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TopicPage;