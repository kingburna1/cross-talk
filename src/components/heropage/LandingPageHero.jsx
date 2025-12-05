"use client"
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Main component, designed to be the Hero section of your landing page
const LandingPageHero = () => {
  // Styles for the floating shapes animation and the subtle glow
  const animationStyles = `
    /* Define keyframes for the vertical float animation (for background shapes) */
    @keyframes float {
      0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 0.6;
      }
      50% {
        transform: translate(20px, 30px) rotate(5deg);
        opacity: 0.8;
      }
      100% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 0.6;
      }
    }
    
    /* Define keyframes for the subtle glow (adjusted for light background) */
    @keyframes soft-glow {
      0%, 100% {
        box-shadow: 0 0 10px rgba(76, 201, 240, 0.6), 0 0 20px rgba(76, 201, 240, 0.4);
      }
      50% {
        box-shadow: 0 0 15px rgba(76, 201, 240, 0.9), 0 0 30px rgba(76, 201, 240, 0.7);
      }
    }
  `;

  // Visual for the bouncing balls
  const BouncingBallsVisual = () => {
    // Defines the parameters for the continuous, non-linear bouncing effect
    const transition = {
      duration: 4, // Slightly faster movement
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    };
    
    // Common properties for the balls (Increased size and visibility)
    const ballClass = "absolute w-8 h-8 rounded-full shadow-md opacity-90 z-20"; // Added z-20 to sit above image if needed, slightly lowered opacity

    return (
      <div className="w-40 h-64 md:w-56 md:h-80 relative flex items-center justify-center 
                      bg-gray-100/70 backdrop-blur-sm border border-gray-300 rounded-3xl 
                      shadow-xl transition-all duration-300 hover:scale-[1.03] transform overflow-hidden p-2">
        
        {/* --- CENTRAL LOGO IMAGE WITH ANIMATION --- */}
        <motion.img 
          src="/image3.png" 
          alt="Crose Talk Logo"
          className="w-28 md:w-36 object-contain relative z-10 drop-shadow-sm" 
          // Soft animation from below
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.2, 0.65, 0.3, 0.9], // Custom cubic-bezier for a "soft" landing
            delay: 0.2 
          }}
        />

        {/* Ball 1: Moves between top-left (0,0) and bottom-right (Xmax, Ymax) */}
        <motion.div 
          className={`${ballClass} bg-blue-500`} 
          initial={{ top: '10px', left: '10px' }}
          animate={{ 
            x: 'calc(100% - 38px)', 
            y: 'calc(100% - 38px)',
            backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#3b82f6'] 
          }}
          transition={{ ...transition, duration: 4.5 }}
        />
        
        {/* Ball 2: Moves between top-right and bottom-left */}
        <motion.div 
          className={`${ballClass} bg-purple-500`} 
          initial={{ top: '10px', right: '10px' }}
          animate={{ 
            x: 'calc(-100% + 38px)', 
            y: 'calc(100% - 38px)',
            backgroundColor: ['#8b5cf6', '#ef4444', '#f59e0b', '#8b5cf6'] 
          }}
          transition={{ ...transition, duration: 5.5, delay: 0.5 }}
        />
        
        {/* Ball 3: Moves between bottom-left and top-right */}
        <motion.div 
          className={`${ballClass} bg-green-500`} 
          initial={{ bottom: '10px', left: '10px' }}
          animate={{ 
            x: 'calc(100% - 38px)', 
            y: 'calc(-100% + 38px)',
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#10b981'] 
          }}
          transition={{ ...transition, duration: 3.8, delay: 1 }}
        />
        
        {/* Ball 4: Moves between bottom-right and top-left */}
        <motion.div 
          className={`${ballClass} bg-rose-500`} 
          initial={{ bottom: '10px', right: '10px' }}
          animate={{ 
            x: 'calc(-100% + 38px)', 
            y: 'calc(-100% + 38px)',
            backgroundColor: ['#ef4444', '#8b5cf6', '#10b981', '#ef4444'] 
          }}
          transition={{ ...transition, duration: 5, delay: 1.5 }}
        />
      </div>
    );
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden 
                    bg-gradient-to-br from-white via-gray-50 to-gray-100 p-4">
      
      {/* 1. Inject custom CSS for animations */}
      <style>{animationStyles}</style>

      {/* 2. Floating Shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-300/50 rounded-full blur-3xl opacity-70" 
           style={{ animation: 'float 15s infinite ease-in-out' }}></div>

      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-rose-300/50 rounded-xl blur-3xl opacity-70" 
           style={{ animation: 'float 18s infinite ease-in-out reverse' }}></div>
      
      <div className="absolute top-1/2 right-10 w-48 h-64 bg-indigo-300/50 rounded-full blur-3xl opacity-70" 
           style={{ animation: 'float 12s infinite linear' }}></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          {/* Dynamic Interactions */}
        </h1>

        {/* 3. Center Visual: Bouncing Balls WITH IMAGE */}
        <div className="mb-12">
          <BouncingBallsVisual />
        </div>

        {/* 4. Center CTA Button */}
        <Link 
         href="/signin"
          className="
            px-8 py-4 text-lg font-semibold text-white uppercase tracking-wider 
            bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 focus:outline-none focus:ring-4 
            rounded-full 
            shadow-xl shadow-cyan-400/70 
            transform hover:scale-[1.05] active:scale-95 
            "
            style={{ animation: 'soft-glow 3s infinite ease-in-out' }}
        >
          GET STARTED
          <span className="ml-2 transition-transform duration-300 inline-block group-hover:translate-x-1">
            &rarr; 
          </span>
        </Link>
        
        <p className="mt-4 text-sm text-gray-600">
          Discover a new way to engage.
        </p>

      </div>
    </div>
  );
};

export default LandingPageHero;
