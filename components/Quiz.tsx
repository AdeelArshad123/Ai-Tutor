import React, { useState } from 'react';
import { Quiz as QuizType } from '../types';

interface QuizProps {
  quizData: QuizType;
}

export const Quiz: React.FC<QuizProps> = ({ quizData }) => {
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (questionIndex: number, option: string) => {
    if (submitted) return;
    setAnswers({
      ...answers,
      [questionIndex]: option,
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getOptionClass = (questionIndex: number, option: string) => {
    if (!submitted) {
      return 'bg-white/5 hover:bg-white/10';
    }
    const question = quizData.questions[questionIndex];
    if (option === question.correctAnswer) {
      return 'bg-green-500/30 border-green-500';
    }
    if (answers[questionIndex] === option) {
      return 'bg-red-500/30 border-red-500';
    }
    return 'bg-white/5 opacity-60';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Quiz Time!</h3>
      {quizData.questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-black/20 p-4 rounded-lg">
          <p className="font-semibold mb-3">{qIndex + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, oIndex) => (
              <button
                key={oIndex}
                onClick={() => handleOptionChange(qIndex, option)}
                disabled={submitted}
                className={`w-full text-left p-3 rounded-md border border-white/10 transition-colors ${getOptionClass(qIndex, option)} ${answers[qIndex] === option && !submitted ? 'ring-2 ring-cyan-400' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
          {submitted && (
            <div className="mt-3 p-3 bg-black/20 rounded-md text-sm">
                <p><span className="font-bold">Correct Answer:</span> {q.correctAnswer}</p>
                <p className="mt-1"><span className="font-bold">Explanation:</span> {q.explanation}</p>
            </div>
          )}
        </div>
      ))}
      {!submitted && (
        <button 
            onClick={handleSubmit} 
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-cyan-500 hover:to-teal-500 transition-all"
        >
          Submit Answers
        </button>
      )}
    </div>
  );
};