export type BorderVariant = 'blue' | 'gold';

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

export type ExportFormat = 'png' | 'pdf';
