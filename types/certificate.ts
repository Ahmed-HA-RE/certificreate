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
