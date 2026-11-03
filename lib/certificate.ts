import type {
  BorderOption,
  BorderVariant,
  CertificateData,
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
