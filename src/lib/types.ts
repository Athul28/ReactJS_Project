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
}
