'use client';

import { useState } from 'react';
import {
  CertificateForm,
  type CertificateFieldChange,
} from '@/components/home/certificate-form';
import { CertificatePreview } from '@/components/home/certificate-preview';
import { PLACEHOLDER_CERTIFICATE } from '@/lib/certificate';
import type { CertificateData } from '@/types/certificate';

export function CertificateEditor() {
  const [data, setData] = useState<CertificateData>(PLACEHOLDER_CERTIFICATE);

  const handleChange: CertificateFieldChange = (name, value) => {
    setData((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className='flex flex-col gap-8 min-[1140px]:flex-row min-[1140px]:items-center'>
      <aside className='overflow-hidden rounded-lg border border-border bg-surface min-[1140px]:w-[380px] min-[1140px]:flex-none'>
        <CertificateForm data={data} onChange={handleChange} />
      </aside>
      <CertificatePreview data={data} />
    </div>
  );
}
