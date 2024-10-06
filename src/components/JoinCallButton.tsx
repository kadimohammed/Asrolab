import React from 'react';
import Image from 'next/image';

interface JoinCallButtonProps {
  onClick: () => void;
  className?: string;
}

const JoinCallButton: React.FC<JoinCallButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`relative group overflow-hidden rounded-full ${className}`}
    >
      <div className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform bg-gradient-to-r from-purple-500 to-indigo-600 group-hover:from-purple-600 group-hover:to-indigo-700"></div>
      <span className="relative flex items-center justify-center px-8 py-3 text-xl font-bold text-white transition-all duration-300 ease-out transform group-hover:translate-y-1">
        <Image src="/images/svgs/starshadow.svg" alt="Star" width={24} height={24} className="mr-2" />
        Rejoindre l'appel
      </span>
    </button>
  );
};

export default JoinCallButton;