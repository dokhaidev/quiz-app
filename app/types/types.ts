export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizAppProps {
  questions: Question[];
}