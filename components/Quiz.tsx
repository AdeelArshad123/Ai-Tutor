import React, { useState, useMemo } from 'react';
import { Quiz as QuizType } from '../types';

interface QuizProps {
  quiz: QuizType;
}

const Quiz: React.FC<QuizProps> = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  const score = useMemo(() => {
    return userAnswers.reduce((acc, answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [userAnswers, quiz.questions]);

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl">Your Score: <span className="font-bold text-black dark:text-white">{score}</span> / {quiz.questions.length}</p>
        <button
          onClick={handleRestart}
          className="mt-6 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h2>
        {selectedAnswer && <p className="text-sm">Score: {score}</p>}
      </div>
      <p className="mb-4 text-lg">{currentQuestion.question}</p>
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = currentQuestion.correctAnswer === option;
          let buttonClass = 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700';
          if (selectedAnswer) {
            if (isCorrect) {
              buttonClass = 'bg-green-600 border-green-700 text-white'; // Correct answer
            } else if (isSelected) {
              buttonClass = 'bg-red-600 border-red-700 text-white line-through opacity-70'; // Incorrectly selected
            } else {
               buttonClass = 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-50'; // Not selected
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
              className={`w-full text-left p-3 border rounded-lg transition-colors ${buttonClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selectedAnswer && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800/70 rounded-lg">
          <p className="font-bold">{selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect.'}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{currentQuestion.explanation}</p>
        </div>
      )}
      {selectedAnswer && (
        <div className="text-right mt-4">
          <button
            onClick={handleNext}
            className="bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;