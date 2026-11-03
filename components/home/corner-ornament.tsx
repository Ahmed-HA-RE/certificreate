type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

interface CornerOrnamentProps {
  position: CornerPosition;
}

export function CornerOrnament({ position }: CornerOrnamentProps) {
  return (
    <svg
      className={`cert-corner ${position}`}
      viewBox='0 0 76 76'
      aria-hidden='true'
    >
      <rect className='cert-corner-bg' width='76' height='76' />
      <rect width='76' height='8' fill='currentColor' />
      <rect width='8' height='76' fill='currentColor' />
      <rect x='14' y='14' width='52' height='4' fill='currentColor' />
      <rect x='14' y='14' width='4' height='52' fill='currentColor' />
      <polygon
        fill='currentColor'
        points='40,30 42.47,36.6 49.51,36.91 43.99,41.3 45.88,48.09 40,44.2 34.12,48.09 36.01,41.3 30.49,36.91 37.53,36.6'
      />
    </svg>
  );
}
