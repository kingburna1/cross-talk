'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from './Preloader';


// This component wraps your main content
export default function LoadingWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. You can add logic here to wait for specific data or assets to load.
    // 2. For a simple splash screen, we use a minimum timer.
    const minimumDisplayTime = 2500; // 2.5 seconds

    const timer = setTimeout(() => {
      // Set to false to trigger the Preloader's exit animation
      setIsLoading(false);
    }, minimumDisplayTime);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  return (
    <>
      {/* AnimatePresence handles the smooth removal of the Preloader */}
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" isLoading={isLoading} />}
      </AnimatePresence>
      
      {/* Render the children (your entire app) */}
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s' }}>
          {children}
      </div>
    </>
  );
}