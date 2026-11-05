'use client';

import { useState } from 'react';
import {
  CertificateForm,
  type CertificateFieldChange,
} from '@/components/home/certificate-form';
import { BrandSettingsPanel } from '@/components/home/brand-settings-panel';
import { CertificatePreview } from '@/components/home/certificate-preview';
import { DownloadButton } from '@/components/home/download-button';
import { useBrandSettings } from '@/components/home/use-brand-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PLACEHOLDER_CERTIFICATE } from '@/lib/certificate';
import type { CertificateData, ExportFormat } from '@/types/certificate';

export function CertificateEditor() {
  const [data, setData] = useState<CertificateData>(PLACEHOLDER_CERTIFICATE);
  const [failedFormat, setFailedFormat] = useState<ExportFormat | null>(null);
  const brand = useBrandSettings();

  const handleChange: CertificateFieldChange = (name, value) => {
    setData((current) => ({ ...current, [name]: value }));
  };

  const handleBrandColorChange = (primary: string | undefined) => {
    brand.updateBrandSettings({
      ...brand.settings,
      colors: primary ? { primary } : {},
    });
  };

  const exportHandlers = {
    data,
    colors: brand.settings.colors,
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

      <div className='flex flex-col gap-8 min-[1140px]:flex-row min-[1140px]:items-start'>
        <aside className='overflow-hidden rounded-lg border border-border bg-card min-[1140px]:w-[380px] min-[1140px]:flex-none'>
          <Tabs defaultValue='details' className='gap-0'>
            <div className='px-6 pt-6'>
              <TabsList className='w-full'>
                <TabsTrigger value='details'>Details</TabsTrigger>
                <TabsTrigger value='brand'>Brand</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value='details'>
              <CertificateForm data={data} onChange={handleChange} />
            </TabsContent>
            <TabsContent value='brand'>
              <BrandSettingsPanel
                settings={brand.settings}
                saveFailed={brand.saveFailed}
                onBrandColorChange={handleBrandColorChange}
              />
            </TabsContent>
          </Tabs>
        </aside>
        <CertificatePreview data={data} colors={brand.settings.colors} />
      </div>
    </>
  );
}
