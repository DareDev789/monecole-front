// components/ui/Badge.jsx
import { classNames } from '../../utils/helpers';

const variantStyles = {
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-indigo-100 text-indigo-800',
  light: 'bg-gray-50 text-gray-600',
  dark: 'bg-gray-800 text-white'
};

const sizeStyles = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2.5 py-1 text-sm',
  md: 'px-3 py-1.5 text-base',
  lg: 'px-4 py-2 text-lg'
};

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
};

export default function Badge({
  variant = 'primary',
  size = 'sm',
  rounded = 'full',
  text,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center font-medium whitespace-nowrap';

  return (
    <span
      className={classNames(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className={classNames(size === 'xs' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1.5')} />}
      {text}
    </span>
  );
}