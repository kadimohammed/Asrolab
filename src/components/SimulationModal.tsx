import React, { useState } from 'react';
import Image from 'next/image';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyChanges: (changes: SimulationChanges) => void;
}

interface SimulationChanges {
  mass: number;
  radius: number;
  rotationSpeed: number;
}

const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, onClose, onApplyChanges }) => {
  const [mass, setMass] = useState(100);
  const [radius, setRadius] = useState(100);
  const [rotationSpeed, setRotationSpeed] = useState(100);

  if (!isOpen) return null;

  const handleApplyChanges = () => {
    onApplyChanges({ mass, radius, rotationSpeed });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-[409px] h-[500px]">
        <Image
          src="/panel_1.svg"
          alt="Simulation Panel Background"
          layout="fill"
          objectFit="contain"
        />
        <div className="absolute inset-0 p-8 flex flex-col">
          <div className="flex items-center mb-2">
            <button
              className="text-white hover:text-gray-300 mr-2 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={onClose}
              aria-label="Close simulation modal"
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
            <h2 className="text-3xl font-bold text-white flex-grow text-center">Simulate Saturn Changes</h2>
          </div>
          <div className="w-full h-px bg-white mt-1 mb-4"></div>
          <div className="flex-grow flex flex-col items-center justify-center overflow-y-auto">
            <div className="mb-4 w-full">
              <label className="text-white block mb-2">Mass (%)</label>
              <input 
                type="range" 
                min="50" 
                max="150" 
                value={mass} 
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-white">{mass}%</span>
            </div>
            <div className="mb-4 w-full">
              <label className="text-white block mb-2">Radius (%)</label>
              <input 
                type="range" 
                min="50" 
                max="150" 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-white">{radius}%</span>
            </div>
            <div className="mb-4 w-full">
              <label className="text-white block mb-2">Rotation Speed (%)</label>
              <input 
                type="range" 
                min="50" 
                max="150" 
                value={rotationSpeed} 
                onChange={(e) => setRotationSpeed(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-white">{rotationSpeed}%</span>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleApplyChanges}
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationModal;