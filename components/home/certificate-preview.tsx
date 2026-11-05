'use client';

import { useEffect, useRef } from 'react';
import { Certificate } from '@/components/home/certificate';
import type { BrandColors } from '@/types/brand-settings';
import type { CertificateData } from '@/types/certificate';

/** Width of the A4 landscape sheet in `certificate.css`. */
const CERTIFICATE_WIDTH = 1123;

interface CertificatePreviewProps {
  data: CertificateData;
  colors: BrandColors;
  logoDataUrl: string | null;
}

export function CertificatePreview({
  data,
  colors,
  logoDataUrl,
}: CertificatePreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  // Written straight to the DOM so resizing never re-renders React.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(([entry]) => {
      const scale = Math.min(entry.contentRect.width / CERTIFICATE_WIDTH, 1);
      frame.style.setProperty('--preview-scale', String(scale));
    });
    observer.observe(frame);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label='Certificate preview'
      className='flex min-w-0 flex-1 justify-center min-[1140px]:sticky min-[1140px]:top-8'
    >
      {/* Scale 0 until the first measurement, so the full-size sheet never flashes. */}
      <div
        ref={frameRef}
        className='aspect-[1123/794] w-full overflow-hidden rounded-[4px] shadow-[0_20px_50px_rgb(0_0_0/0.45)] [--preview-scale:0]'
      >
        <div className='w-[1123px] origin-top-left scale-(--preview-scale)'>
          <Certificate data={data} colors={colors} logoDataUrl={logoDataUrl} />
        </div>
      </div>
    </section>
  );
}
