'use client'; 
import { motion } from 'framer-motion';

const ringVariant = {
  rotate: {
    rotate: 360,
    transition: {
      duration: 8, 
      ease: "linear",
      repeat: Infinity,
    },
  },
};

export default function Preloader({ isLoading }) {
  // Uses Tailwind CSS classes and custom styles for the multi-colored ring
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed inset-0 z-9999 flex items-center justify-center 
                  ${isLoading ? 'visible' : 'pointer-events-none opacity-0'} 
                  bg-black dark:bg-gray-900 transition-opacity duration-500`}
    >
      <motion.div
        variants={ringVariant}
        animate="rotate"
        className="w-24 h-24 rounded-full border-8"
        style={{
          borderColor: 'transparent',
          borderTopColor: 'rgb(255, 107, 107)',    // Red/Pink
          borderRightColor: 'rgb(72, 219, 251)',   // Blue
          borderBottomColor: 'rgb(29, 209, 161)',  // Green
        }}
      />
    </motion.div>
  );
}