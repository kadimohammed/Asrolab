import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface FocusButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export default function FocusButton({ onClick, isVisible }: FocusButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
      onClick={onClick}
      title="Return to global view"
    >
      <FaArrowLeft />
    </button>
  );
}