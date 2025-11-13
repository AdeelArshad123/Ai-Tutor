import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { getCurrentUser, loginUser, signupUser, logoutUser } from './utils/auth';
import { User, Language, Topic, View, BreadcrumbItem } from './types';
import { learningData } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load all page components for code splitting
const HomePage = lazy(() => import('./components/HomePage'));
const LanguagePage = lazy(() => import('./components/LanguagePage'));
const TopicPage = lazy(() => import('./components/TopicPage'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const SignupPage = lazy(() => import('./components/SignupPage'));
const SearchResultsPage = lazy(() => import('./components/SearchResultsPage'));
const CodeDebuggerPage = lazy(() => import('./components/CodeDebuggerPage'));
const LearningPathPage = lazy(() => import('./components/LearningPathPage'));
const InterviewPrepPage = lazy(() => import('./components/InterviewPrepPage'));
const ApiGeneratorPage = lazy(() => import('./components/ApiGeneratorPage'));
const LiveTutorPage = lazy(() => import('./components/LiveTutorPage'));
const CodeTranslatorPage = lazy(() => import('./components/CodeTranslatorPage'));
const QuizGeneratorPage = lazy(() => import('./components/QuizGeneratorPage'));
const CodeMentorPage = lazy(() => import('./components/CodeMentorPage'));
const EducatorsPage = lazy(() => import('./components/EducatorsPage'));
const CodePlaygroundPage = lazy(() => import('./components/CodePlaygroundPage'));
const UnitTestGeneratorPage = lazy(() => import('./components/UnitTestGeneratorPage'));
const UIDrafterPage = lazy(() => import('./components/UIDrafterPage'));
const CodeImproverPage = lazy(() => import('./components/CodeImproverPage'));

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full w-full py-20">
        <svg className="animate-spin h-10 w-10 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const findCategoryForLanguage = (languageSlug: string): string | null => {
    for (const category of learningData) {
        if (category.languages.some(lang => lang.slug === languageSlug)) {
            return category.name;
        }
    }
    return null;
};

const generateBreadcrumbs = (view: View): BreadcrumbItem[] => {
    const homeCrumb: BreadcrumbItem = { label: 'Home', view: { name: 'home' } };

    switch (view.name) {
        case 'home':
            return [{ label: 'Home' }];

        case 'language': {
            const categoryName = findCategoryForLanguage(view.language.slug);
            const crumbs: BreadcrumbItem[] = [homeCrumb];
            if (categoryName) {
                crumbs.push({ label: categoryName, view: { name: 'home' } });
            }
            crumbs.push({ label: view.language.name });
            return crumbs;
        }

        case 'topic': {
            const categoryName = findCategoryForLanguage(view.language.slug);
            const crumbs: BreadcrumbItem[] = [homeCrumb];
            if (categoryName) {
                crumbs.push({ label: categoryName, view: { name: 'home' } });
            }
            crumbs.push({
                label: view.language.name,
                view: { name: 'language', language: view.language }
            });
            crumbs.push({ label: view.topic.title });
            return crumbs;
        }

        case 'search':
            return [homeCrumb, { label: `Search: "${view.query}"` }];
        case 'debugger':
            return [homeCrumb, { label: 'AI Code Debugger' }];
        case 'learningPath':
            return [homeCrumb, { label: 'Learning Path Generator' }];
        case 'interviewPrep':
            return [homeCrumb, { label: 'Interview Simulator' }];
        case 'apiGenerator':
            return [homeCrumb, { label: 'API Forge' }];
        case 'liveTutor':
            return [homeCrumb, { label: 'Live AI Voice Tutor' }];
        case 'codeTranslator':
            return [homeCrumb, { label: 'Code Translator' }];
        case 'quizGenerator':
            return [homeCrumb, { label: 'AI Quiz Generator' }];
        case 'codeMentor':
            return [homeCrumb, { label: 'Code Mentor' }];
        case 'playground':
            return [homeCrumb, { label: 'Code Playground' }];
        case 'unitTestGenerator':
            return [homeCrumb, { label: 'Unit Test Generator' }];
        case 'uiDrafter':
            return [homeCrumb, { label: 'UI Drafter' }];
        case 'codeImprover':
            return [homeCrumb, { label: 'AI Code Improver' }];
        case 'educators':
            return [homeCrumb, { label: 'Top Educators' }];

        default:
            return [];
    }
};


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>({ name: 'home' });

  useEffect(() => {
    const loggedInUser = getCurrentUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      setCurrentView({ name: 'login' });
    }
  }, []);

  // --- Memoized Navigation Handlers ---
  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const handleLoginSuccess = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    handleNavigate({ name: 'home' });
  }, [handleNavigate]);
  
  const handleLogout = useCallback(() => {
    logoutUser();
    setUser(null);
    handleNavigate({ name: 'login' });
  }, [handleNavigate]);

  const handleSearch = useCallback((query: string) => {
    handleNavigate({ name: 'search', query });
  }, [handleNavigate]);

  const handleBackToHome = useCallback(() => {
    handleNavigate({ name: 'home' });
  }, [handleNavigate]);

  const handleNavigateToLogin = useCallback(() => {
    handleNavigate({ name: 'login' });
  }, [handleNavigate]);

  const handleNavigateToSignup = useCallback(() => {
    handleNavigate({ name: 'signup' });
  }, [handleNavigate]);

  const handleSelectLanguage = useCallback((language: Language) => {
    handleNavigate({ name: 'language', language });
  }, [handleNavigate]);

  const handleSelectTopic = useCallback((language: Language, topic: Topic) => {
    handleNavigate({ name: 'topic', language, topic });
  }, [handleNavigate]);

  const handleSelectTopicFromLanguagePage = useCallback((topic: Topic) => {
    if (currentView.name === 'language') {
      handleNavigate({ name: 'topic', language: currentView.language, topic });
    }
  }, [currentView, handleNavigate]);

  const handleBackToLanguage = useCallback(() => {
    if (currentView.name === 'topic') {
      handleNavigate({ name: 'language', language: currentView.language });
    }
  }, [currentView, handleNavigate]);
  
  const renderContent = () => {
    if (!user) {
        switch (currentView.name) {
            case 'signup':
                return <SignupPage onSignupSuccess={handleLoginSuccess} onNavigateToLogin={handleNavigateToLogin} />;
            default:
                return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToSignup={handleNavigateToSignup} />;
        }
    }
    
    switch (currentView.name) {
      case 'home':
        return <HomePage 
            learningData={learningData} 
            onSelectLanguage={handleSelectLanguage} 
            onSelectTopic={handleSelectTopic}
            user={user} 
            onNavigate={handleNavigate}
        />;
      case 'language':
        return <LanguagePage language={currentView.language} onSelectTopic={handleSelectTopicFromLanguagePage} onBack={handleBackToHome} user={user} />;
      case 'topic':
        return <TopicPage topic={currentView.topic} language={currentView.language} onBack={handleBackToLanguage} user={user} onNavigate={handleNavigate} />;
      case 'search':
        return <SearchResultsPage query={currentView.query} onBack={handleBackToHome} onNavigate={handleNavigate} />;
      case 'debugger':
        return <CodeDebuggerPage onBack={handleBackToHome} />;
      case 'learningPath':
        return <LearningPathPage onBack={handleBackToHome} onNavigate={handleNavigate as any} />;
      case 'interviewPrep':
        return <InterviewPrepPage onBack={handleBackToHome} />;
      case 'apiGenerator':
        return <ApiGeneratorPage />;
      case 'liveTutor':
        return <LiveTutorPage onBack={handleBackToHome} user={user} />;
      case 'codeTranslator':
        return <CodeTranslatorPage onBack={handleBackToHome} />;
      case 'quizGenerator':
        return <QuizGeneratorPage onBack={handleBackToHome} />;
      case 'codeMentor':
        return <CodeMentorPage onBack={handleBackToHome} />;
       case 'educators':
        return <EducatorsPage onBack={handleBackToHome} />;
      case 'playground':
        return <CodePlaygroundPage onBack={handleBackToHome} />;
      case 'unitTestGenerator':
        return <UnitTestGeneratorPage onBack={handleBackToHome} />;
      case 'uiDrafter':
        return <UIDrafterPage onBack={handleBackToHome} />;
      case 'codeImprover':
        return <CodeImproverPage onBack={handleBackToHome} />;
      default:
        return <HomePage 
            learningData={learningData} 
            onSelectLanguage={handleSelectLanguage} 
            onSelectTopic={handleSelectTopic}
            user={user}
            onNavigate={handleNavigate}
        />;
    }
  };

  const breadcrumbs = generateBreadcrumbs(currentView);

  return (
    <div className="min-h-screen font-sans flex flex-col">
        { user && <Header 
            user={user} 
            onLogout={handleLogout} 
            onSearch={handleSearch}
            onNavigate={handleNavigate}
            breadcrumbs={breadcrumbs}
        /> }
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
            <Suspense fallback={<LoadingSpinner />}>
              {renderContent()}
            </Suspense>
        </main>
        {user && <Footer />}
    </div>
  );
};

export default App;
