import React from 'react';

const Spinner = ({ text = 'Chargement...', fullScreen = false, size = 'md' }) => {
  // Determine spinner size based on prop
  const spinnerSizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };
  
  const spinnerSize = spinnerSizes[size] || spinnerSizes.md;
  
  // Full screen loading with overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
        <div className={`animate-spin rounded-full ${spinnerSize} border-t-3 border-b-3 border-white`}></div>
        {text && <p className="mt-4 text-white text-lg font-medium">{text}</p>}
      </div>
    );
  }
  
  // Regular inline loading spinner
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 border-black`}></div>
      {text && <p className="mt-3 text-gray-700">{text}</p>}
    </div>
  );
};

export default Spinner; 