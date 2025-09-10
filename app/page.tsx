"use client"

import { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import { Question } from './types/types';

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showResultPopup, setShowResultPopup] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const question: Question = questionsData[currentQuestion];
  const isLastQuestion = currentQuestion === questionsData.length - 1;

  const handleAnswerSelect = (index: number): void => {
    setSelectedAnswer(index);
  };

  const handleSubmit = (): void => {
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
    setShowResult(true);
    setShowResultPopup(true);
  };

  const handleNextQuestion = (): void => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
      setShowResultPopup(true);
    }
  };

  const handlePreviousQuestion = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const restartQuiz = (): void => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
    setShowResultPopup(false);
  };

  // Đóng popup khi nhấn ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowResultPopup(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 relative">
      {/* Popup kết quả */}
      {showResultPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${quizFinished ? 'bg-indigo-100' : 'bg-green-100'}`}>
                <svg className={`w-8 h-8 ${quizFinished ? 'text-indigo-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {quizFinished ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  )}
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">
                {quizFinished ? 'Chúc mừng!' : 'Kết quả'}
              </h3>
              <p className="text-gray-600 mt-2">
                {quizFinished 
                  ? `Bạn đã hoàn thành bài quiz với ${score}/${questionsData.length} điểm!`
                  : selectedAnswer === question.correctAnswer 
                    ? 'Chính xác! Câu trả lời của bạn đúng.' 
                    : `Sai rồi! Đáp án đúng là: ${question.options[question.correctAnswer]}`
                }
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {quizFinished ? (
                  <>
                    <button
                      onClick={restartQuiz}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex-1"
                    >
                      Làm lại
                    </button>
                    <button
                      onClick={() => setShowResultPopup(false)}
                      className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex-1"
                    >
                      Đóng
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowResultPopup(false);
                      if (isLastQuestion) {
                        setQuizFinished(true);
                      } else {
                        handleNextQuestion();
                      }
                    }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    {isLastQuestion ? 'Xem kết quả cuối cùng' : 'Tiếp tục'}
                  </button>
                )}
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
        </div>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-medium text-indigo-600">
              Câu hỏi {currentQuestion + 1}/{questionsData.length}
            </span>
            <span className="text-lg font-medium text-indigo-600">
              Điểm: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${((currentQuestion + 1) / questionsData.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
            {question.question}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option: string, index: number) => (
              <div
                key={index}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedAnswer === index
                    ? index === question.correctAnswer && showResult
                      ? 'bg-green-50 border-green-500'
                      : showResult
                      ? 'bg-red-50 border-red-500'
                      : 'bg-indigo-50 border-indigo-500'
                    : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
                }`}
                onClick={() => !showResult && handleAnswerSelect(index)}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full mr-4 border-2 flex items-center justify-center font-medium text-lg ${
                    selectedAnswer === index
                      ? index === question.correctAnswer && showResult
                        ? 'bg-green-500 border-green-500 text-white'
                        : showResult
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-white border-gray-300 text-gray-600'
                  }`}>
                    {selectedAnswer === index && showResult ? (
                      index === question.correctAnswer ? '✓' : '✗'
                    ) : String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-800 text-lg">{option}</span>
                </div>
              </div>
            ))}
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
              disabled={!showResult && isLastQuestion}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                !showResult && isLastQuestion
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Câu sau →
            </button>
          </div>
          
          {/* Chỉ hiển thị nút Kiểm tra khi ở câu cuối cùng và chưa xem kết quả */}
          {isLastQuestion && !showResult ? (
            <button
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 text-lg ${
                selectedAnswer === null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Kiểm tra
            </button>
          ) : showResult ? (
            <button
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg text-lg"
              onClick={() => setShowResultPopup(true)}
            >
              Xem kết quả
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}