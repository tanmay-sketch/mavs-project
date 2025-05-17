import React from "react";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center bg-white dark:bg-primary-900 h-screen w-full px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary-900 dark:text-primary-50 mb-4 text-center">DraftHub</h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-primary-700 dark:text-primary-200 text-center max-w-3xl">The home for draft boards and scouting.</p>
      {/* <div className="flex flex-col items-center justify-center">
        <input type="text" placeholder="Search for a player" className="w-full max-w-md p-2 rounded-md border border-primary-200 dark:border-primary-800" />
        <button className="bg-primary-700 dark:bg-primary-900 text-white dark:text-primary-50 px-4 py-2 rounded-md">Search</button>
      </div> */}
    </section>
  );
} 