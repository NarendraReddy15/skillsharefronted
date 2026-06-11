import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-white
            placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1
            focus:ring-primary-500 transition-colors
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';
export default Input;
