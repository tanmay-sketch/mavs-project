// ===================================================================
// Hero component seen on the home page
// Path to this file: /src/components/Hero.jsx
// ===================================================================

import React from "react";
import { BackgroundBeamsWithCollision } from "./ui/background-beams-with-collision";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center bg-white dark:bg-primary-900 min-h-screen w-full px-4">
      <BackgroundBeamsWithCollision className="min-h-screen">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="relative inline-flex">
            <span className="absolute inset-0 w-full h-full rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 blur-2xl opacity-20 dark:opacity-30"></span>
            <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-900 to-primary-600 dark:from-primary-100 dark:to-primary-400">
              DraftHub
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-primary-700 dark:text-primary-200 text-center max-w-3xl font-light">
            The home for draft boards and scouting.
          </p>
        </div>
      </BackgroundBeamsWithCollision>
    </section>
  );
} 