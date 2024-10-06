import React from 'react';
import { useRouter } from 'next/router';
import Header from '../src/components/Header';
import '../src/app/Quiz.css'; // Add this line if there's a Quiz.css file

const QuizPage: React.FC = () => {
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <Header 
        logoImageName="astrolab white png.png"
        showText={true}
        showHeaderWave={true}
      />
      <main className="quiz-main">
        {/* Ajoutez ici le contenu de votre page de quiz */}
      </main>
    </>
  );
};

export default QuizPage;