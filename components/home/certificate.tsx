'use client';

import { useLayoutEffect, useRef, type ComponentType } from 'react';
import { Template1 } from '@/components/home/templates/template-1';
import { Template2 } from '@/components/home/templates/template-2';
import { Template3 } from '@/components/home/templates/template-3';
import { resolveTemplateId } from '@/lib/certificate';
import type { BrandColors } from '@/types/brand-settings';
import type { CertificateData, TemplateId } from '@/types/certificate';

export interface TemplateLayoutProps {
  data: CertificateData;
  logoDataUrl?: string | null;
}

const TEMPLATE_LAYOUTS: Record<TemplateId, ComponentType<TemplateLayoutProps>> = {
  'template-1': Template1,
  'template-2': Template2,
  'template-3': Template3,
};

interface CertificateProps {
  data: CertificateData;
  colors?: BrandColors;
  logoDataUrl?: string | null;
}

export function Certificate({ data, colors, logoDataUrl }: CertificateProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const templateId = resolveTemplateId(data.templateId);
  const Layout = TEMPLATE_LAYOUTS[templateId];
  const brandColor = colors?.primary;

  // Before paint, so neither the preview nor an export capture shows navy first.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (brandColor) root.style.setProperty('--color-cert-navy', brandColor);
    else root.style.removeProperty('--color-cert-navy');
  }, [brandColor]);

  return (
    <div
      ref={rootRef}
      className='cert'
      data-template={templateId}
      data-border={data.border}
    >
      <Layout data={data} logoDataUrl={logoDataUrl} />
    </div>
  );
}
