import { useId, useRef, useState, type RefObject } from 'react';
import { DownloadButton } from '@/components/home/download-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { validateCertificateForm } from '@/lib/certificate-schema';
import { toCertificateData } from '@/lib/history';
import type { BrandColors } from '@/types/brand-settings';
import type { CertificateData, ExportFormat } from '@/types/certificate';
import type { HistoryEntry } from '@/types/history';

const UNNAMED_RECIPIENT = 'Unnamed recipient';
const UNTITLED_COURSE = 'Untitled course';

/** Only ever rendered on the client: the server snapshot of history is empty. */
function formatCreatedAt(createdAt: string) {
  return new Date(createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

interface HistoryPanelProps {
  entries: HistoryEntry[];
  saveFailed: boolean;
  colors: BrandColors;
  logoDataUrl: string | null;
  /** Where focus goes once Clear history removes the list (and its button). */
  clearedFocusRef: RefObject<HTMLElement | null>;
  onOpen: (data: CertificateData) => void;
  onClear: () => void;
  onExportStart: () => void;
  onExportError: (format: ExportFormat) => void;
  onExportSuccess: (data: CertificateData) => void;
}

export function HistoryPanel({
  entries,
  saveFailed,
  colors,
  logoDataUrl,
  clearedFocusRef,
  onOpen,
  onClear,
  onExportStart,
  onExportError,
  onExportSuccess,
}: HistoryPanelProps) {
  const idPrefix = useId();
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Frozen on open, so the text never reads "0 certificates" while the dialog closes.
  const [confirmCount, setConfirmCount] = useState(0);
  const cancelRef = useRef<HTMLButtonElement>(null);
  // Set on confirm, so closing the dialog knows its trigger is gone.
  const clearedRef = useRef(false);
  const count = entries.length;

  const handleOpenChange = (open: boolean) => {
    if (open) setConfirmCount(count);
    setConfirmOpen(open);
  };

  const handleConfirmClear = () => {
    clearedRef.current = true;
    onClear();
    setConfirmOpen(false);
  };

  const finalFocus = () => {
    if (!clearedRef.current) return true;
    clearedRef.current = false;
    return clearedFocusRef.current;
  };

  return (
    <div className='grid gap-6 p-6'>
      <p className='text-xs text-faint'>
        Certificates you download are saved in this browser.
      </p>

      {count === 0 ? (
        <p className='rounded-sm border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground'>
          No certificates yet. Downloads appear here.
        </p>
      ) : (
        <ul aria-label='Downloaded certificates' className='grid divide-y divide-border'>
          {entries.map((entry) => {
            const data = toCertificateData(entry);
            const name = entry.recipientName || UNNAMED_RECIPIENT;
            // Saved before the form rules existed, or with details missing: open it to fix.
            const incomplete = Object.keys(validateCertificateForm(data)).length > 0;
            const noteId = `${idPrefix}-${entry.id}-incomplete`;
            return (
              <li key={entry.id} className='grid gap-2 py-3 first:pt-0 last:pb-0'>
                <div className='grid min-w-0 gap-0.5'>
                  <p
                    title={entry.recipientName || undefined}
                    className={`truncate font-medium ${entry.recipientName ? '' : 'text-faint'}`}
                  >
                    {name}
                  </p>
                  <p
                    title={entry.courseTitle || undefined}
                    className={`truncate text-muted-foreground ${entry.courseTitle ? '' : 'text-faint'}`}
                  >
                    {entry.courseTitle || UNTITLED_COURSE}
                  </p>
                  <time dateTime={entry.createdAt} className='text-xs text-faint'>
                    {formatCreatedAt(entry.createdAt)}
                  </time>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    aria-label={`Open the certificate for ${name}`}
                    onClick={() => onOpen(data)}
                  >
                    Open
                  </Button>
                  {(['png', 'pdf'] as const).map((format) => (
                    <DownloadButton
                      key={format}
                      format={format}
                      data={data}
                      colors={colors}
                      logoDataUrl={logoDataUrl}
                      variant='outline'
                      size='sm'
                      label={format.toUpperCase()}
                      ariaLabel={`Download ${format.toUpperCase()} for ${name}`}
                      disabled={incomplete}
                      ariaDescribedBy={incomplete ? noteId : undefined}
                      onExportStart={onExportStart}
                      onExportError={onExportError}
                      onExportSuccess={onExportSuccess}
                    />
                  ))}
                </div>
                {incomplete && (
                  <p id={noteId} className='text-xs text-muted-foreground'>
                    Missing details. Open it to finish.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Stays mounted after clearing, so the closing dialog can still hand focus on. */}
      <AlertDialog open={confirmOpen} onOpenChange={handleOpenChange}>
        {count > 0 && (
          <AlertDialogTrigger render={<Button variant='outline' />}>
            Clear history
          </AlertDialogTrigger>
        )}
        <AlertDialogContent initialFocus={cancelRef} finalFocus={finalFocus}>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all history?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {confirmCount} saved{' '}
              {confirmCount === 1 ? 'certificate' : 'certificates'} from this
              browser. It can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={handleConfirmClear}>
              Clear history
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <p role='status' className='text-sm text-destructive empty:hidden'>
        {saveFailed ? "Couldn't save history in this browser." : null}
      </p>
    </div>
  );
}
