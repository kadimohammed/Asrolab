import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const QuizComponent: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchedQuestions: Question[] = [
      {
        id: 1,
        text: "If we observe an object in space with the following characteristics:\n\nDiameter: 18.5 meters\nAlbedo (Shine): 0.30\nRotation Speed: 2.10 rotations per hour\nOrbital Type: Amor (AMO)\n\nWhat would be the class of this object?",
        options: ["Apollo (APO)", "Aten (ATE)", "Amor (AMO)", "Interior Earth Object (IEO)"],
        correctAnswer: "Amor (AMO)"
      },
      {
        id: 2,
        text: "Consider a space object with the following details:\n\nDiameter: 24.7 meters\nAlbedo (Shine): 0.20\nRotation Speed: 1.75 rotations per hour\nOrbital Type: Apollo (APO)\n\nWhat class would the model assign to this object?",
        options: ["Apollo (APO)", "Aten (ATE)", "Amor (AMO)", "Interior Earth Object (IEO)"],
        correctAnswer: "Apollo (APO)"
      },
      {
        id: 3,
        text: "Imagine an object in space with the following properties:\n\nDiameter: 12.3 meters\nAlbedo (Shine): 0.45\nRotation Speed: 4.50 rotations per hour\nOrbital Type: Interior Earth Object (IEO)\n\nWhich class does this object belong to?",
        options: ["Apollo (APO)", "Aten (ATE)", "Amor (AMO)", "Interior Earth Object (IEO)"],
        correctAnswer: "Interior Earth Object (IEO)"
      },
      {
        id: 4,
        text: "Suppose we detect a space object with the following attributes:\n\nDiameter: 9.8 meters\nAlbedo (Shine): 0.25\nRotation Speed: 0.95 rotations per hour\nOrbital Type: Aten (ATE)\n\nWhat classification would the model likely assign to this object?",
        options: ["Apollo (APO)", "Aten (ATE)", "Amor (AMO)", "Interior Earth Object (IEO)"],
        correctAnswer: "Aten (ATE)"
      },
    ];
    setQuestions(fetchedQuestions);
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleStartQuiz = () => {
    setShowWelcomeModal(false);
    setShowAudioModal(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    
    // Scroll to the quiz after a short delay to ensure the modal is closed
    setTimeout(() => {
      if (quizRef.current) {
        quizRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const playAudioIntroduction = () => {
    setShowWelcomeModal(false);
    setShowAudioModal(true);
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const closeAudioModal = () => {
    setShowAudioModal(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    handleStartQuiz(); // Start the quiz when closing the audio modal
  };

  if (questions.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  if (showWelcomeModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Welcome to the Solar System Quiz!</h2>
          <p>Test your knowledge about our cosmic neighborhood. Are you ready to explore the wonders of space?</p>
          <button onClick={playAudioIntroduction} className="audio-button">
            Play Audio Introduction
          </button>
        </div>
      </div>
    );
  }

  if (showAudioModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-content audio-modal">
          <h2>What You'll Learn</h2>
          <ul>
            <li>Fascinating facts about planets in our solar system</li>
            <li>The order and characteristics of planets</li>
            <li>Interesting phenomena in space</li>
            <li>Basic astronomical concepts</li>
          </ul>
          <p>Listen to the audio introduction for more details:</p>
          <button onClick={toggleAudio} className="audio-button">
            {isPlaying ? 'Pause Audio' : 'Play Audio'}
          </button>
          <button onClick={handleStartQuiz} className="start-quiz-button">Start Quiz</button>
          <audio 
            ref={audioRef} 
            src="/audio/quiz-intro.mp3" 
            onEnded={handleStartQuiz}
          /> {/* Updated path to the audio file */}
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-completed">
        <h2>Quiz Completed!</h2>
        <p>Your score: {score} out of {questions.length}</p>
        <button onClick={restartQuiz} className="restart-button">Restart Quiz</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="solar-system-quiz-page">
      <div className="space-theme" ref={quizRef}>
        <div className="top-left-star">
          <Image src="/images/svgs/grnstarshadow.svg" alt="Top Left Star" width={240} height={240} />
        </div>
        <div className="bottom-right-star">
          <Image src="/images/svgs/starshadow.svg" alt="Bottom Right Star" width={240} height={240} />
        </div>
        <div className="quiz-container">
          <h2>Solar System Quiz</h2>
          <div className="question-container">
            <h3>Question {currentQuestionIndex + 1} of {questions.length}</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{currentQuestion.text}</p>
          </div>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`option ${selectedAnswer === option ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
          <button 
            onClick={handleNextQuestion} 
            disabled={!selectedAnswer}
            className="next-button"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
          <div className="score">
            Score: {score} / {currentQuestionIndex}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;