'use client';

import { useState } from 'react';
import {
  CertificateForm,
  type CertificateFieldChange,
} from '@/components/home/certificate-form';
import { CertificatePreview } from '@/components/home/certificate-preview';
import { DownloadButton } from '@/components/home/download-button';
import { PLACEHOLDER_CERTIFICATE } from '@/lib/certificate';
import type { CertificateData, ExportFormat } from '@/types/certificate';

export function CertificateEditor() {
  const [data, setData] = useState<CertificateData>(PLACEHOLDER_CERTIFICATE);
  const [failedFormat, setFailedFormat] = useState<ExportFormat | null>(null);

  const handleChange: CertificateFieldChange = (name, value) => {
    setData((current) => ({ ...current, [name]: value }));
  };

  const exportHandlers = {
    data,
    onExportStart: () => setFailedFormat(null),
    onExportError: setFailedFormat,
  };

  return (
    <>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-4 min-[1140px]:flex-row min-[1140px]:items-center min-[1140px]:justify-between'>
          <div>
            <h1 className='text-2xl font-bold lg:text-3xl'>Preview</h1>
            <p className='mt-1 text-muted-foreground'>
              A4 landscape · what you see is what you download
            </p>
          </div>
          <div className='flex gap-2'>
            <DownloadButton format='png' variant='outline' {...exportHandlers} />
            <DownloadButton format='pdf' variant='default' {...exportHandlers} />
          </div>
        </div>
        {failedFormat && (
          <p role='alert' className='text-sm text-destructive'>
            Couldn&apos;t export the {failedFormat.toUpperCase()}. Try again.
          </p>
        )}
      </div>

      <div className='flex flex-col gap-8 min-[1140px]:flex-row min-[1140px]:items-center'>
        <aside className='overflow-hidden rounded-lg border border-border bg-card min-[1140px]:w-[380px] min-[1140px]:flex-none'>
          <CertificateForm data={data} onChange={handleChange} />
        </aside>
        <CertificatePreview data={data} />
      </div>
    </>
  );
}
