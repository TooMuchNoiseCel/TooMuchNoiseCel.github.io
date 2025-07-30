'use client';

import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

const Input: React.FC<InputProps> = ({ label, name, type = 'text', ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        {...props}
        className="
          block w-full px-3 py-2
          border border-gray-300 dark:border-gray-600
          rounded-md shadow-sm
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-offset-background focus:ring-primary-accent
          transition-colors
        "
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)'
        }}
      />
    </div>
  );
};

export default Input;
