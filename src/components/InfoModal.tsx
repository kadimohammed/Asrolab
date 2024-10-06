import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1000 }}>
      <div className="relative w-[409px] h-[500px]">
        <Image
          src="/panel_1.svg"
          alt="Info Panel Background"
          layout="fill"
          objectFit="contain"
        />
        <div className="absolute inset-0 p-8 flex flex-col">
          <div className="flex items-center mb-2">
            <button
              className="text-white hover:text-gray-300 mr-2 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={onClose}
              aria-label="Close info modal"
            >
              <div className="relative w-6 h-6">
                <Image
                  src="/panel btn.svg"
                  alt="Close"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </button>
            <h2 className="text-3xl font-bold text-white flex-grow text-center">Solar System Visualizer</h2>
          </div>
          <div className="w-full h-px bg-white mt-1 mb-4"></div>
          <div className="flex-grow flex flex-col items-center justify-center overflow-y-auto">
            <h3 className="text-xl font-bold text-white text-center mb-2">Welcome to Our Solar System</h3>
            <p className="text-white text-center text-sm px-2 mb-4">
              Explore the wonders of our cosmic neighborhood with this interactive Solar System Visualizer. 
              Here's what you can do:
            </p>
            <ul className="text-white text-sm list-disc list-inside">
              <li className="mb-2">View all planets in our solar system</li>
              <li className="mb-2">Click on a planet to see detailed information</li>
              <li className="mb-2">Use the zoom controls to get a closer look</li>
              <li className="mb-2">Drag to rotate the view</li>
              <li>Toggle between 2D and 3D views</li>
            </ul>
            <p className="text-white text-center text-sm px-2 mt-4">
              Enjoy your journey through space and discover the unique characteristics of each planet!
            </p>
          </div>
          <div className="w-full h-px bg-white mt-4 mb-1"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;