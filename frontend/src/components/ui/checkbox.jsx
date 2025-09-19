import React from 'react';

// Minimal checkbox component compatible with our design system usage
// Props: checked (boolean), onCheckedChange (fn), disabled (boolean), className (string)
export const Checkbox = ({ checked = false, onCheckedChange, disabled = false, className = '', ...rest }) => {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
      checked={!!checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      {...rest}
    />
  );
};

export default Checkbox;
