import React from 'react';
import Header from '../src/components/Header';
import '../src/app/SolarSystem.css';
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Loading from '@/components/Loading'

const NEOViewer = dynamic(() => import('@/components/NEOViewer'), {
  ssr: false
})

const SolarSystem: React.FC = () => {
  const headerStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  };

  return (
    <>
      <Header 
        showText={false} 
        className="solar-system-header" 
        showHeaderWave={false} 
        style={headerStyles}
      />
      <div className="solar-system-page">
        <Suspense fallback={<Loading />}>
          <NEOViewer />
        </Suspense>
      </div>
    </>
  );
};

export default SolarSystem;