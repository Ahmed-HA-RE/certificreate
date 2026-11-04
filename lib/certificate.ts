import type {
  BorderOption,
  BorderVariant,
  CertificateData,
  ExportFormat,
} from '@/types/certificate';

export const DEFAULT_BORDER: BorderVariant = 'blue';

export const BORDER_OPTIONS: BorderOption[] = [
  { value: 'blue', label: 'Blue', note: 'Default' },
  { value: 'gold', label: 'Gold', note: 'Premium' },
];

export const PLACEHOLDER_CERTIFICATE: CertificateData = {
  recipientName: 'John Smith',
  courseTitle: 'Advanced React Patterns',
  date: '2026-10-12',
  instructorName: 'Alex Johnson',
  templateId: 'template-1',
  border: DEFAULT_BORDER,
};

/** `certificate-<recipient-slug>.<format>`, ASCII only, e.g. `certificate-john-smith.png`. */
export function certificateFileName(
  data: Pick<CertificateData, 'recipientName'>,
  format: ExportFormat
) {
  const slug = data.recipientName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug ? `certificate-${slug}` : 'certificate'}.${format}`;
}
