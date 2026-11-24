import type { CertificateData } from '@/types/certificate';

/** A downloaded certificate, saved so it can be re-opened and re-downloaded. */
export interface HistoryEntry extends CertificateData {
  /** Generated client-side with `crypto.randomUUID()`. */
  id: string;
  /** ISO 8601 UTC timestamp of the download. */
  createdAt: string;
}
