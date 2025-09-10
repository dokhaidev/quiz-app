"use client"

import { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import { Question } from './types/types';

// Hàm xáo trộn mảng (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Hàm xáo trộn câu hỏi và đáp án
const shuffleQuestions = (questions: Question[]): Question[] => {
  return shuffleArray(questions).map(question => ({
    ...question,
    options: shuffleArray(question.options),
  }));
};

export default function QuizApp() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Xáo trộn câu hỏi khi component mount
  useEffect(() => {
    setShuffledQuestions(shuffleQuestions(questionsData));
  }, []);

  const question = shuffledQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === shuffledQuestions.length - 1;

  const handleAnswerSelect = (answer: string): void => {
    if (selectedAnswer !== null) return; // Ngăn chọn lại sau khi đã chọn
    
    setSelectedAnswer(answer);
    
    // Tự động kiểm tra kết quả
    if (answer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = (): void => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePreviousQuestion = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const restartQuiz = (): void => {
    // Xáo trộn lại câu hỏi và đáp án khi làm lại
    setShuffledQuestions(shuffleQuestions(questionsData));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  // Hiển thị loading khi chưa xáo trộn xong câu hỏi
  if (shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 relative">
      {/* Popup kết thúc quiz */}
      {quizFinished && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-indigo-100">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">
                Chúc mừng!
              </h3>
              <p className="text-gray-600 mt-2">
                Bạn đã hoàn thành bài quiz với {score}/{shuffledQuestions.length} điểm!
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={restartQuiz}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1"
                >
                  Làm lại
                </button>
                <button
                  onClick={() => setQuizFinished(false)}
                  className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex-1"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quiz Việt Nam
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Khám phá kiến thức về đất nước Việt Nam</p>
          <p className="text-sm text-indigo-500 mt-1">Câu hỏi được xáo trộn ngẫu nhiên</p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-medium text-indigo-600">
              Câu hỏi {currentQuestion + 1}/{shuffledQuestions.length}
            </span>
            <span className="text-lg font-medium text-indigo-600">
              Điểm: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
            {question.question}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.correctAnswer;
              const showResult = selectedAnswer !== null;
              
              return (
                <div
                  key={index}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    showResult
                      ? isCorrect
                        ? 'bg-green-100 border-green-500 font-semibold'
                        : isSelected
                        ? 'bg-red-100 border-red-500'
                        : 'bg-gray-50 border-gray-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full mr-4 border-2 flex items-center justify-center font-medium text-lg ${
                      showResult
                        ? isCorrect
                          ? 'bg-green-500 border-green-500 text-white'
                          : isSelected
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'bg-white border-gray-300 text-gray-600'
                        : 'bg-white border-gray-300 text-gray-600'
                    }`}>
                      {showResult
                        ? isCorrect
                          ? '✓'
                          : isSelected
                          ? '✗'
                          : String.fromCharCode(65 + index)
                        : String.fromCharCode(65 + index)}
                    </div>
                    <span className={`text-lg ${
                      showResult && isCorrect
                        ? 'font-bold text-green-800' 
                        : 'text-gray-800'
                    }`}>
                      {option}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              ← Câu trước
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                selectedAnswer === null
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isLastQuestion ? 'Kết thúc' : 'Câu sau →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}