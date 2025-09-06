import React from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  children, 
  position = 'top',
  className = ''
}) => {
  return (
    <div className={`${styles.tooltipContainer} ${className}`} data-tooltip={text} data-position={position}>
      {children}
    </div>
  );
};
