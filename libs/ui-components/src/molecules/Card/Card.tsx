import React from 'react';
import classNames from 'classnames';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className,
  variant = 'default',
}) => {
  const baseClasses = 'rounded-lg border shadow-sm overflow-hidden';
  
  const variantClasses = {
    default: 'bg-white border-gray-200',
    primary: 'bg-blue-50 border-blue-200',
    secondary: 'bg-gray-50 border-gray-200',
  };
  
  const cardClasses = classNames(
    baseClasses,
    variantClasses[variant],
    className
  );
  
  return (
    <div className={cardClasses}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
