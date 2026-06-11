import { ReactNode } from 'react';

const levelColors = {
  Beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Expert: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
};

interface BadgeProps {
  children: ReactNode;
  variant?: 'skill' | 'level' | 'default';
  level?: 'Beginner' | 'Intermediate' | 'Expert';
  className?: string;
}

const Badge = ({ children, variant = 'default', level, className = '' }: BadgeProps) => {
  const base = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium';

  if (variant === 'level' && level) {
    return <span className={`${base} ${levelColors[level]} ${className}`}>{children}</span>;
  }

  if (variant === 'skill') {
    return (
      <span className={`${base} bg-primary-500/20 text-primary-300 border-primary-500/30 ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span className={`${base} bg-gray-700 text-gray-300 border-gray-600 ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
