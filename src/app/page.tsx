'use client';

import React from 'react';
import Header from '../components/Header';
import Welcome from '../components/Welcome';
import KeyFeatures from '../components/KeyFeatures';
import SolarSystemMapping from '../components/SolarSystemMapping';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header logoImageName="astrolab white png.png"/>
      <main>
        <Welcome />
        <KeyFeatures />
        <SolarSystemMapping />
      </main>
      <Footer />
    </>
  );
}