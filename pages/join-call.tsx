import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import JoinCallButton from '../src/components/JoinCallButton';
import '../src/styles/join-call.css';

const JoinCallPage: React.FC = () => {
  const router = useRouter();

  const handleJoinCall = () => {
    router.push('/video-call');
  };

  return (
    <div className="join-call-bg">
      <header className="join-call-header">
        <Image src="/images/astrolab white 2.png" alt="Astrolab Logo" width={60} height={60} className="join-call-logo" />
        <nav>
          <a href="/" className="join-call-nav-link mr-4">Home</a>
          <a href="/about" className="join-call-nav-link">About</a>
        </nav>
      </header>
      <main className="join-call-main">
        <div className="join-call-content">
          <div className="join-call-text">
            <h1 className="join-call-title">
              Rejoignez l'<span className="text-blue-300">Exploration</span> Spatiale
            </h1>
            <p className="join-call-description">
              Connectez-vous avec des experts et explorez l'univers dans une expérience immersive unique.
            </p>
            <JoinCallButton onClick={handleJoinCall} className="join-call-button" />
          </div>
          <div className="join-call-image-container">
            <div className="join-call-glow"></div>
          </div>
        </div>
      </main>
      <footer className="join-call-footer">
        <p>© 2023 Astrolab. Tous droits réservés.</p>
        <div>
          <a href="/privacy" className="join-call-footer-link mr-4">Privacy Policy</a>
          <a href="/terms" className="join-call-footer-link">Terms of Service</a>
        </div>
      </footer>  
    </div>
  );
};

export default JoinCallPage;