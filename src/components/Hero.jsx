// ===================================================================
// Hero component seen on the home page
// Path to this file: /src/components/Hero.jsx
// ===================================================================

import React from "react";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center bg-white dark:bg-primary-900 h-screen w-full px-4">
      <div className="relative inline-flex">
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 blur-xl filter opacity-20 dark:opacity-30 w-full h-full absolute inset-0 rounded-lg"></span>
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary-900 dark:text-primary-50 mb-4 text-center">
          DraftHub
        </h1>
      </div>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-primary-700 dark:text-primary-200 text-center max-w-3xl">
        The home for draft boards and scouting.
      </p> 
    </section>
  );
} 