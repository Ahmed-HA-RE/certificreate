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

/** The four detail fields the form validates. */
export type CertificateFormField =
  | 'recipientName'
  | 'courseTitle'
  | 'date'
  | 'instructorName';

/** What React Hook Form manages: the four details, without template and border. */
export type CertificateFormValues = Pick<CertificateData, CertificateFormField>;

/** The first error message for each invalid detail field; `{}` when the form is valid. */
export type CertificateFormErrors = Partial<Record<CertificateFormField, string>>;
