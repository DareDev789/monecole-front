// components/ui/LoadingIndicator.jsx
import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

const sizes = {
  xs: 'h-4 w-4',
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10'
};

const variants = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  light: 'text-white',
  danger: 'text-red-600',
  success: 'text-green-600'
};

const LoadingIndicator = forwardRef(
  (
    {
      size = 'md',
      variant = 'primary',
      className = '',
      fullScreen = false,
      text = '',
      textPosition = 'bottom',
      ...props
    },
    ref
  ) => {
    const spinner = (
      <svg
        ref={ref}
        className={classNames(
          'animate-spin',
          sizes[size],
          variants[variant],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          {spinner}
          {text && (
            <p
              className={classNames(
                'mt-4 text-lg font-medium',
                variant === 'light' ? 'text-white' : 'text-gray-700'
              )}
            >
              {text}
            </p>
          )}
        </div>
      );
    }

    if (text) {
      return (
        <div
          className={classNames(
            'flex items-center justify-center',
            textPosition === 'bottom' ? 'flex-col' : 'flex-row space-x-3'
          )}
        >
          {textPosition === 'right' && spinner}
          {spinner}
          {textPosition === 'left' && spinner}
          <span
            className={classNames(
              textPosition === 'bottom' ? 'mt-2' : 'ml-2',
              'text-sm font-medium',
              variants[variant]
            )}
          >
            {text}
          </span>
        </div>
      );
    }

    return spinner;
  }
);

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;