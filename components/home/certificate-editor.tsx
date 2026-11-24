'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  CertificateForm,
  CertificateFormSkeleton,
  type CertificateFieldChange,
} from '@/components/home/certificate-form';
import { BrandSettingsPanel } from '@/components/home/brand-settings-panel';
import { CertificatePreview } from '@/components/home/certificate-preview';
import { DownloadButton } from '@/components/home/download-button';
import { HistoryPanel } from '@/components/home/history-panel';
import { useBrandSettings } from '@/components/home/use-brand-settings';
import { useHistory } from '@/components/home/use-history';
import { useLastFormValues } from '@/components/home/use-last-form-values';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { clearCertificateText } from '@/lib/certificate';
import type { CertificateData, ExportFormat } from '@/types/certificate';

export function CertificateEditor() {
  // Every local-storage store switches from its server fallback in the same
  // post-hydration render, so `loaded` also covers the brand settings.
  const { data, loaded, setData } = useLastFormValues();
  const [failedFormat, setFailedFormat] = useState<ExportFormat | null>(null);
  const brand = useBrandSettings();
  const history = useHistory();
  const historyTabRef = useRef<HTMLButtonElement>(null);

  const handleChange: CertificateFieldChange = (name, value) => {
    setData((current) => ({ ...current, [name]: value }));
  };

  const handleClearForm = () => {
    const previous = data;
    setData(clearCertificateText(data));
    toast('Form cleared', {
      action: { label: 'Undo', onClick: () => setData(previous) },
    });
  };

  const handleOpen = (entry: CertificateData) => {
    setData(entry);
    toast.success(
      `Opened the certificate for ${entry.recipientName || 'Unnamed recipient'}`,
    );
  };

  const handleLogoChange = (logoDataUrl: string | null) => {
    brand.updateBrandSettings({ ...brand.settings, logoDataUrl });
  };

  const handleBrandColorChange = (primary: string | undefined) => {
    brand.updateBrandSettings({
      ...brand.settings,
      colors: primary ? { primary } : {},
    });
  };

  // Shared by the header buttons and every history row.
  const exportCallbacks = {
    onExportStart: () => setFailedFormat(null),
    onExportError: setFailedFormat,
    onExportSuccess: history.addToHistory,
  };

  const exportHandlers = {
    data,
    colors: brand.settings.colors,
    logoDataUrl: brand.settings.logoDataUrl,
    ...exportCallbacks,
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
            <DownloadButton
              format='png'
              variant='outline'
              {...exportHandlers}
            />
            <DownloadButton
              format='pdf'
              variant='default'
              {...exportHandlers}
            />
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
                <TabsTrigger ref={historyTabRef} value='history'>
                  History
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value='details'>
              {loaded ? (
                <CertificateForm
                  data={data}
                  onChange={handleChange}
                  onClear={handleClearForm}
                />
              ) : (
                <CertificateFormSkeleton />
              )}
            </TabsContent>
            <TabsContent value='brand'>
              <BrandSettingsPanel
                settings={brand.settings}
                saveFailed={brand.saveFailed}
                onLogoChange={handleLogoChange}
                onBrandColorChange={handleBrandColorChange}
              />
            </TabsContent>
            <TabsContent value='history'>
              <HistoryPanel
                entries={history.entries}
                saveFailed={history.saveFailed}
                colors={brand.settings.colors}
                logoDataUrl={brand.settings.logoDataUrl}
                clearedFocusRef={historyTabRef}
                onOpen={handleOpen}
                onClear={history.clearHistory}
                {...exportCallbacks}
              />
            </TabsContent>
          </Tabs>
        </aside>
        <CertificatePreview
          data={data}
          colors={brand.settings.colors}
          logoDataUrl={brand.settings.logoDataUrl}
          loading={!loaded}
        />
      </div>
    </>
  );
}
