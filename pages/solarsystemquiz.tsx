import React from 'react';
import Header from '../src/components/Header';
import QuizComponent from '../src/components/QuizComponent';
import '../src/app/QuizComponent.css';

const SolarSystemQuiz: React.FC = () => {
  return (
    <>
      <Header 
        showText={false} 
        className="solar-system-quiz-header" 
        showHeaderWave={false} 
      />
      <div className="solar-system-quiz-page">
        <QuizComponent />
      </div>
    </>
  );
};

export default SolarSystemQuiz;