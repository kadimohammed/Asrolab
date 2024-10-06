import React from 'react';
import '../src/app/Loader.css';

const Loader: React.FC = () => {
  return (
    <div className="loader-container" aria-label="Chargement en cours">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;