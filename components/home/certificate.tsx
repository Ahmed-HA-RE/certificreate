import type { ComponentType } from 'react';
import { Template1 } from '@/components/home/templates/template-1';
import { Template2 } from '@/components/home/templates/template-2';
import { Template3 } from '@/components/home/templates/template-3';
import { resolveTemplateId } from '@/lib/certificate';
import type { CertificateData, TemplateId } from '@/types/certificate';

export interface TemplateLayoutProps {
  data: CertificateData;
}

const TEMPLATE_LAYOUTS: Record<TemplateId, ComponentType<TemplateLayoutProps>> = {
  'template-1': Template1,
  'template-2': Template2,
  'template-3': Template3,
};

interface CertificateProps {
  data: CertificateData;
}

export function Certificate({ data }: CertificateProps) {
  const templateId = resolveTemplateId(data.templateId);
  const Layout = TEMPLATE_LAYOUTS[templateId];

  return (
    <div className='cert' data-template={templateId} data-border={data.border}>
      <Layout data={data} />
    </div>
  );
}
