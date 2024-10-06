import React from 'react';
import { AppProps } from 'next/app';
import '../src/app/globals.css'; // Import the global CSS file

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
