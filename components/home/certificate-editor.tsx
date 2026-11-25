'use client';

import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { clearCertificateText, toFormValues } from '@/lib/certificate';
import { certificateFormSchema } from '@/lib/certificate-schema';
import type {
  CertificateData,
  CertificateFormValues,
  ExportFormat,
} from '@/types/certificate';

type EditorTab = 'details' | 'brand' | 'history';

export function CertificateEditor() {
  const lastFormValues = useLastFormValues();
  // The form starts from its default values, so it mounts again once the saved ones load.
  return <Editor key={String(lastFormValues.loaded)} {...lastFormValues} />;
}

interface EditorProps {
  data: CertificateData;
  loaded: boolean;
  setData: ReturnType<typeof useLastFormValues>['setData'];
}

function Editor({ data, loaded, setData }: EditorProps) {
  // Every local-storage store switches from its server fallback in the same
  // post-hydration render, so `loaded` also covers the brand settings.
  const [failedFormat, setFailedFormat] = useState<ExportFormat | null>(null);
  const brand = useBrandSettings();
  const history = useHistory();
  const historyTabRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<EditorTab>('details');

  // React Hook Form owns the four details: a field is checked on every change and
  // when it is left, never on load. Template and border stay plain form values.
  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateFormSchema),
    mode: 'all',
    shouldFocusError: false,
    defaultValues: toFormValues(data),
  });
  // Checked against the schema on every change, whether or not errors show yet.
  const canDownload = form.formState.isValid;

  // Mirror every change into the remembered values, which drive the preview and exports.
  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) =>
          setData((current) => ({ ...current, ...values })),
      }),
    [form, setData],
  );

  /** Puts `next` in the form and the remembered values, with no errors showing. */
  const replaceData = (next: CertificateData) => {
    form.reset(toFormValues(next));
    setData(next);
  };

  /** Validates as a submit does, so every error shows and then updates while typing. */
  const revealErrors = () => form.handleSubmit(() => {})();

  const handleChange: CertificateFieldChange = (name, value) => {
    setData((current) => ({ ...current, [name]: value }));
  };

  const handleClearForm = () => {
    const previous = data;
    // A freshly cleared form isn't flagged until a field is left or a download is tried.
    replaceData(clearCertificateText(data));
    toast('Form cleared', {
      action: { label: 'Undo', onClick: () => replaceData(previous) },
    });
  };

  const handleOpen = (entry: CertificateData) => {
    replaceData(entry);
    // Flag whatever an older or incomplete entry is missing straight away.
    void revealErrors();
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
    disabled: !canDownload,
    colors: brand.settings.colors,
    logoDataUrl: brand.settings.logoDataUrl,
    ...exportCallbacks,
  };

  return (
    <FormProvider {...form}>
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
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as EditorTab)}
            className='gap-0'
          >
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
    </FormProvider>
  );
}
