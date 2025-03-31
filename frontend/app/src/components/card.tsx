import React from "react";

interface CardProps {
  title: string;
  description: string;
  num: React.ReactNode; // More flexible type
}

export const Card = ({ title, description, num }: CardProps) => {
  return (
    <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      <div className="h-52 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
        {num}
      </div>
      <div className="p-4 md:p-6">
        <span className="block mb-1 text-xs font-semibold uppercase text-blue-600 dark:text-blue-500">
          {title} {/* Consider making this a category instead */}
        </span>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
          {title}
        </h3>
        <p className="mt-3 text-gray-500 dark:text-neutral-500">{description}</p>
      </div>
    </div>
  );
};
