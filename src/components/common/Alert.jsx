import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  X 
} from 'lucide-react';
import { clsx } from 'clsx';

const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = ''
}) => {
  const variants = {
    success: {
      bg: 'bg-medical-50',
      border: 'border-medical-200',
      icon: CheckCircle,
      iconColor: 'text-medical-400',
      titleColor: 'text-medical-800',
      textColor: 'text-medical-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: XCircle,
      iconColor: 'text-red-400',
      titleColor: 'text-red-800',
      textColor: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700'
    }
  };

  const config = variants[variant];
  const IconComponent = config.icon;

  return (
    <div className={clsx(
      'rounded-lg border p-4',
      config.bg,
      config.border,
      className
    )}>
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent className={clsx('h-5 w-5', config.iconColor)} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={clsx('text-sm font-medium', config.titleColor)}>
              {title}
            </h3>
          )}
          <div className={clsx('text-sm mt-1', config.textColor)}>
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={clsx(
                'inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2',
                `hover:bg-${variant === 'info' ? 'blue' : variant}-600`,
                `focus:ring-${variant === 'info' ? 'blue' : variant}-500`
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;