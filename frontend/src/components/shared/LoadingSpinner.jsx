import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ size = 40, color = "#3b82f6", loading = true, message = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <ClipLoader
        color={color}
        loading={loading}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {message && (
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;