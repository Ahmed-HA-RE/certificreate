import type {
  BorderOption,
  BorderVariant,
  CertificateData,
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
