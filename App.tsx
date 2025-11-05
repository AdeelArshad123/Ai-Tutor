import React, { useState, useEffect } from 'react';
import { getCurrentUser, loginUser, signupUser, logoutUser } from './utils/auth';
import { User, Language, Topic, LearningPath, InterviewQuestion } from './types';
import { learningData } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LanguagePage from './components/LanguagePage';
import TopicPage from './components/TopicPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import SearchResultsPage from './components/SearchResultsPage';
import CodeDebuggerPage from './components/CodeDebuggerPage';
import LearningPathPage from './components/LearningPathPage';
import InterviewPrepPage from './components/InterviewPrepPage';
import ApiGeneratorPage from './components/ApiGeneratorPage';
import LiveTutorPage from './components/LiveTutorPage';


type View = 
  | { name: 'home' }
  | { name: 'language', language: Language }
  | { name: 'topic', language: Language, topic: Topic }
  | { name: 'login' }
  | { name: 'signup' }
  | { name: 'search', query: string }
  | { name: 'debugger' }
  | { name: 'learningPath' }
  | { name: 'interviewPrep' }
  | { name: 'apiGenerator' }
  | { name: 'liveTutor' };


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

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView({ name: 'home' });
  };
  
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentView({ name: 'login' });
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };
  
  const renderContent = () => {
    if (!user) {
        switch (currentView.name) {
            case 'signup':
                return <SignupPage onSignupSuccess={handleLoginSuccess} onNavigateToLogin={() => handleNavigate({ name: 'login' })} />;
            default:
                return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToSignup={() => handleNavigate({ name: 'signup' })} />;
        }
    }
    
    switch (currentView.name) {
      case 'home':
        return <HomePage 
            learningData={learningData} 
            onSelectLanguage={(lang) => handleNavigate({ name: 'language', language: lang })} 
            user={user} 
            onNavigate={(viewName) => handleNavigate({ name: viewName as 'debugger' | 'learningPath' | 'interviewPrep' | 'apiGenerator' | 'liveTutor' })}
        />;
      case 'language':
        return <LanguagePage language={currentView.language} onSelectTopic={(topic) => handleNavigate({ name: 'topic', language: currentView.language, topic: topic })} onBack={() => handleNavigate({ name: 'home' })} user={user} />;
      case 'topic':
        return <TopicPage topic={currentView.topic} language={currentView.language} onBack={() => handleNavigate({ name: 'language', language: currentView.language })} user={user} onNavigate={handleNavigate} />;
      case 'search':
        return <SearchResultsPage query={currentView.query} onBack={() => handleNavigate({ name: 'home' })} />;
      case 'debugger':
        return <CodeDebuggerPage onBack={() => handleNavigate({ name: 'home' })} />;
      case 'learningPath':
        return <LearningPathPage onBack={() => handleNavigate({ name: 'home' })} onNavigate={handleNavigate as any} />;
      case 'interviewPrep':
        return <InterviewPrepPage onBack={() => handleNavigate({ name: 'home' })} />;
      case 'apiGenerator':
        return <ApiGeneratorPage />;
      case 'liveTutor':
        return <LiveTutorPage onBack={() => handleNavigate({ name: 'home' })} user={user} />;
      default:
        return <HomePage 
            learningData={learningData} 
            onSelectLanguage={(lang) => handleNavigate({ name: 'language', language: lang })} 
            user={user}
            onNavigate={(viewName) => handleNavigate({ name: viewName as 'debugger' | 'learningPath' | 'interviewPrep' | 'apiGenerator' | 'liveTutor' })}
        />;
    }
  };


  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-950 text-slate-100">
        <Header 
            user={user} 
            onLogout={handleLogout} 
            onSearch={(query) => handleNavigate({ name: 'search', query })}
            onNavigate={(viewName) => handleNavigate({ name: viewName as 'home' | 'debugger' | 'learningPath' | 'interviewPrep' | 'apiGenerator' | 'liveTutor' })}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
            {renderContent()}
        </main>
        {user && <Footer />}
    </div>
  );
};

export default App;