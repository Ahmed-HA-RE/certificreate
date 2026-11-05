import type { BrandColors } from '@/types/brand-settings';

export type BorderVariant = 'blue' | 'gold';

export type TemplateId = 'template-1' | 'template-2' | 'template-3';

export interface CertificateData {
  recipientName: string;
  courseTitle: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  instructorName: string;
  templateId: string;
  border: BorderVariant;
}

export interface BorderOption {
  value: BorderVariant;
  label: string;
  note: string;
}

export interface TemplateOption {
  id: TemplateId;
  name: string;
}

/** Export payload: the certificate plus the brand overrides that style it. */
export interface ExportRequest extends CertificateData {
  colors?: BrandColors;
  logoDataUrl?: string | null;
}

export type ExportFormat = 'png' | 'pdf';
