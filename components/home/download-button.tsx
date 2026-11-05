import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { certificateFileName } from '@/lib/certificate';
import type { BrandColors } from '@/types/brand-settings';
import type {
  CertificateData,
  ExportFormat,
  ExportRequest,
} from '@/types/certificate';

const LABELS: Record<ExportFormat, string> = {
  png: 'Download PNG',
  pdf: 'Download PDF',
};

// Some browsers cancel a download whose object URL is revoked straight after the click.
const REVOKE_DELAY_MS = 30_000;

interface DownloadButtonProps {
  format: ExportFormat;
  data: CertificateData;
  colors: BrandColors;
  variant: 'default' | 'outline';
  onExportStart: () => void;
  onExportError: (format: ExportFormat) => void;
}

export function DownloadButton({
  format,
  data,
  colors,
  variant,
  onExportStart,
  onExportError,
}: DownloadButtonProps) {
  const [isPending, setIsPending] = useTransition();

  const handleClick = () => {
    onExportStart();
    setIsPending(async () => {
      try {
        const request: ExportRequest = { ...data, colors };
        const response = await fetch(`/api/export/${format}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });
        if (!response.ok) {
          throw new Error(`Export failed with ${response.status}`);
        }
        saveFile(await response.blob(), certificateFileName(data, format));
      } catch {
        onExportError(format);
      }
    });
  };

  return (
    <Button
      variant={variant}
      disabled={isPending}
      aria-busy={isPending}
      onClick={handleClick}
      className='h-10 px-4'
    >
      {isPending ? (
        <>
          <Spinner data-icon='inline-start' aria-hidden='true' />
          Exporting…
        </>
      ) : (
        LABELS[format]
      )}
    </Button>
  );
}

function saveFile(file: Blob, fileName: string) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}
