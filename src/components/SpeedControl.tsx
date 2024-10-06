import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SpeedControlProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}

const timeIncrements = [
  { label: 'Live', value: 0 },
  { label: '+1 Day', value: 1 },
  { label: '+3 Days', value: 3 },
  { label: '+1 Week', value: 7 },
  { label: '+2 Weeks', value: 14 },
  { label: '+1 Month', value: 30 },
  { label: '+3 Months', value: 90 },
  { label: '+6 Months', value: 180 },
  { label: '+1 Year', value: 365 },
];

export default function SpeedControl({ currentDate, onDateChange }: SpeedControlProps) {
  const [selectedIncrement, setSelectedIncrement] = useState(0);
  const [internalDate, setInternalDate] = useState(currentDate || new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const newDate = new Date(internalDate.getTime());
      newDate.setDate(newDate.getDate() + timeIncrements[selectedIncrement].value);
      setInternalDate(newDate);
      if (typeof onDateChange === 'function') {
        onDateChange(newDate);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedIncrement, internalDate, onDateChange]);

  useEffect(() => {
    if (currentDate) {
      setInternalDate(currentDate);
    }
  }, [currentDate]);

  const handleIncrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIncrement(Number(e.target.value));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const currentSize = 32 + (64 - 32) * (selectedIncrement / (timeIncrements.length - 1));

  return (
    <div className="bg-black bg-opacity-50 p-4 rounded-lg w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-white text-sm">{formatDate(internalDate)}</div>
        <div className="text-white text-sm">{formatTime(internalDate)}</div>
      </div>
      <div className="w-64 relative h-16">
        <input
          id="speed-slider"
          type="range"
          min="0"
          max={timeIncrements.length - 1}
          step="1"
          value={selectedIncrement}
          onChange={handleIncrementChange}
          className="w-full appearance-none bg-gray-300 h-0.5 rounded-full outline-none opacity-70 transition-opacity duration-200 ease-in-out hover:opacity-100 absolute top-1/2 -translate-y-1/2"
          style={{
            WebkitAppearance: 'none',
            cursor: 'pointer',
          }}
        />
        <div 
          className="absolute top-1/2 pointer-events-none" 
          style={{ 
            left: `calc(${(selectedIncrement / (timeIncrements.length - 1)) * 100}% - ${currentSize / 2}px)`,
            transform: 'translateY(-50%)'
          }}
        >
          <Image
            src="/slider star.svg"
            alt="Slider Thumb"
            width={currentSize}
            height={currentSize}
            style={{ transition: 'width 0.2s, height 0.2s' }}
          />
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <button 
          className={`text-white text-xs px-2 py-1 rounded transition-colors duration-200 ${
            selectedIncrement === 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setSelectedIncrement(0)}
        >
          Live
        </button>
        <div className="text-white text-xs">
          {timeIncrements[selectedIncrement].label}
        </div>
      </div>
    </div>
  );
}