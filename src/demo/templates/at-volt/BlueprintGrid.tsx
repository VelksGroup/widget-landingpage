import { useId } from 'react';

interface BlueprintGridProps {
  className?: string;
}

/**
 * Fine technical grid, inspired by blueprint drafting paper.
 * Adapted from Magic UI's grid-pattern primitive, recolored for the AT VOLT direction.
 */
export function BlueprintGrid({ className }: BlueprintGridProps) {
  const id = useId();
  const size = 44;

  return (
    <svg
      aria-hidden="true"
      className={className}
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="rgba(180,210,230,0.09)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id={`${id}-fade`} cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="rgba(11,29,46,0)" />
          <stop offset="100%" stopColor="rgba(6,16,26,0.9)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
    </svg>
  );
}
