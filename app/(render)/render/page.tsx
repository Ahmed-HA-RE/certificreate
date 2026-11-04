import type { Metadata } from 'next';
import { CertificateRender } from '@/app/(render)/render/_components/certificate-render';

export const metadata: Metadata = {
  robots: { index: false },
};

// Loaded only by Puppeteer for PNG and PDF export; see lib/export.ts.
function RenderPage() {
  return <CertificateRender />;
}

export default RenderPage;
