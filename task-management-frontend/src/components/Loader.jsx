/**
 * Loader component — displays a full-screen or inline loading spinner.
 */
import React from 'react';

const Loader = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-purple-200 border-t-purple-600`} />
      {text && <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

export default Loader;
