import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { certificateFileName } from '@/lib/certificate';
import { cn } from '@/lib/utils';
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
  logoDataUrl: string | null;
  variant: 'default' | 'outline';
  /** Compact buttons (history rows) show a short `label` and need an `ariaLabel`. */
  size?: 'default' | 'sm';
  label?: string;
  ariaLabel?: string;
  /** Id of text that explains the button, e.g. why it is disabled. */
  ariaDescribedBy?: string;
  disabled?: boolean;
  onExportStart: () => void;
  onExportError: (format: ExportFormat) => void;
  /** Called with the exact data that was exported, once the file is handed to the browser. */
  onExportSuccess: (data: CertificateData) => void;
}

export function DownloadButton({
  format,
  data,
  colors,
  logoDataUrl,
  variant,
  size = 'default',
  label,
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
  onExportStart,
  onExportError,
  onExportSuccess,
}: DownloadButtonProps) {
  const [isPending, setIsPending] = useTransition();

  const handleClick = () => {
    onExportStart();
    setIsPending(async () => {
      try {
        const request: ExportRequest = { ...data, colors, logoDataUrl };
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
        return;
      }
      onExportSuccess(data);
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isPending || disabled}
      aria-busy={isPending}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onClick={handleClick}
      className={cn(size === 'default' && 'h-10 px-4')}
    >
      {isPending && <Spinner data-icon='inline-start' aria-hidden='true' />}
      {isPending && !label ? 'Exporting…' : (label ?? LABELS[format])}
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
