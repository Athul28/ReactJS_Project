export interface Question {
  id: number;
  question: string;
  options: {
    option1: string;
    option2: string;
    option3: string;
    option4: string;
  };
  answer: string;
  selectedAnswer?: string;
  explanation: string;
}

export interface Quizzes {
  id: string;
  title: string;
  userId: string;
  score: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  userId: string;
  score: number;
}

export interface QuizApi {
  id: string;
  title: string;
  userId: string;
  score: number;
  questions: {
    id: number;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correctAnswer: string;
    selectedAnswer: string;
    explanation: string;
    quizId: string;
  }[];
}

export interface Resources {
  topic: string;
  youtube: string[];
  websites: string[];
}
