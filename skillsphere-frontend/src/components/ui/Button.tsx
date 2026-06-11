import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: 'bg-gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary-500/30',
  secondary: 'bg-gray-800 text-white hover:bg-gray-700',
  outline: 'border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
  ghost: 'text-gray-300 hover:bg-gray-800',
  danger: 'bg-red-500 text-white hover:bg-red-600'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base'
};

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    className={`
      inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? (
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : null}
    {children}
  </motion.button>
);

export default Button;
