export function LogoMark() {
  return (
    <svg className='cert-badge' viewBox='0 0 64 64' aria-hidden='true'>
      <polygon
        className='cert-badge-ribbon'
        points='22,34 16,58 23,54 28,59 32,38'
      />
      <polygon
        className='cert-badge-ribbon'
        points='42,34 48,58 41,54 36,59 32,38'
      />
      <circle className='cert-badge-seal' cx='32' cy='26' r='19' />
      <circle className='cert-badge-face' cx='32' cy='26' r='13' />
      <polygon
        className='cert-badge-star'
        points='32,19 33.76,23.57 38.66,23.84 34.85,26.93 36.11,31.66 32,29 27.89,31.66 29.15,26.93 25.34,23.84 30.24,23.57'
      />
    </svg>
  );
}
