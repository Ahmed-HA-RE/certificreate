import type {
  BorderOption,
  BorderVariant,
  CertificateData,
  CertificateFormValues,
  ExportFormat,
  TemplateId,
  TemplateOption,
} from '@/types/certificate';

export const DEFAULT_BORDER: BorderVariant = 'blue';

export const BORDER_OPTIONS: BorderOption[] = [
  { value: 'blue', label: 'Blue', note: 'Default' },
  { value: 'gold', label: 'Gold', note: 'Premium' },
];

export const DEFAULT_TEMPLATE_ID: TemplateId = 'template-1';

// A new template also needs a `TemplateId`, a layout in `certificate.tsx`, a
// stylesheet imported in `globals.css`, and an entry in the export schema.
export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: 'template-1', name: 'Template 1' },
  { id: 'template-2', name: 'Template 2' },
  { id: 'template-3', name: 'Template 3' },
];

/** The registered template for `id`, or the default for anything unknown. */
export function resolveTemplateId(id: string): TemplateId {
  const option = TEMPLATE_OPTIONS.find((template) => template.id === id);
  return option ? option.id : DEFAULT_TEMPLATE_ID;
}

export const PLACEHOLDER_CERTIFICATE: CertificateData = {
  recipientName: 'John Smith',
  courseTitle: 'Advanced React Patterns',
  date: '2026-10-12',
  instructorName: 'Alex Johnson',
  templateId: DEFAULT_TEMPLATE_ID,
  border: DEFAULT_BORDER,
};

/** The four details of `data`, as the form holds them. */
export function toFormValues(data: CertificateData): CertificateFormValues {
  return {
    recipientName: data.recipientName,
    courseTitle: data.courseTitle,
    date: data.date,
    instructorName: data.instructorName,
  };
}

/** `data` with its four text fields emptied; the template and border are kept. */
export function clearCertificateText(data: CertificateData): CertificateData {
  return {
    ...data,
    recipientName: '',
    courseTitle: '',
    date: '',
    instructorName: '',
  };
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

// Fixed locale and UTC, so the browser preview and the server export print the same day.
const CERTIFICATE_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

/** ISO `YYYY-MM-DD` as printed on the certificate, e.g. `October 12, 2026`; anything else unchanged. */
export function formatCertificateDate(date: string): string {
  const match = ISO_DATE.exec(date);
  if (!match) return date;
  const [year, month, day] = match.slice(1).map(Number);
  return isRealDay(year, month, day)
    ? CERTIFICATE_DATE_FORMAT.format(new Date(Date.UTC(year, month - 1, day)))
    : date;
}

function isRealDay(year: number, month: number, day: number) {
  const utc = new Date(Date.UTC(year, month - 1, day));
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  );
}

const TYPED_DATE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

/** Typed `M/D/YYYY` or `MM/DD/YYYY` as ISO `YYYY-MM-DD`, or `null` unless it is a real day. */
export function parseTypedDate(text: string): string | null {
  const match = TYPED_DATE.exec(text.trim());
  if (!match) return null;
  const [month, day, year] = match.slice(1).map(Number);
  if (!isRealDay(year, month, day)) return null;
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}`;
}

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
