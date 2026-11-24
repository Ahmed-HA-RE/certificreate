import { PLACEHOLDER_CERTIFICATE } from '@/lib/certificate';
import { certificateDataSchema } from '@/lib/certificate-schema';
import { historyEntrySchema } from '@/lib/history-schema';
import type { CertificateData } from '@/types/certificate';
import type { HistoryEntry } from '@/types/history';

export const HISTORY_STORAGE_KEY = 'certifcreate:history';
export const LAST_FORM_VALUES_STORAGE_KEY = 'certifcreate:last-form-values';

const CERTIFICATE_FIELDS = [
  'recipientName',
  'courseTitle',
  'date',
  'instructorName',
  'templateId',
  'border',
] as const satisfies readonly (keyof CertificateData)[];

function parseJson(raw: string | null): unknown {
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/** Stored history, newest first; invalid entries are dropped one by one. */
export function parseHistory(raw: string | null): HistoryEntry[] {
  const value = parseJson(raw);
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const parsed = historyEntrySchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}

export function serializeHistory(entries: HistoryEntry[]) {
  return JSON.stringify(entries);
}

/**
 * Only the six certificate fields, so an entry's `id` and `createdAt` never reach
 * the form or the strict export schema.
 */
export function toCertificateData(data: CertificateData): CertificateData {
  return {
    recipientName: data.recipientName,
    courseTitle: data.courseTitle,
    date: data.date,
    instructorName: data.instructorName,
    templateId: data.templateId,
    border: data.border,
  };
}

function isSameCertificate(a: CertificateData, b: CertificateData) {
  return CERTIFICATE_FIELDS.every((field) => a[field] === b[field]);
}

/** A new list with `data` first, replacing any entry for the same certificate. */
export function addHistoryEntry(
  entries: HistoryEntry[],
  data: CertificateData,
  { id, createdAt }: Pick<HistoryEntry, 'id' | 'createdAt'>,
): HistoryEntry[] {
  // A re-saved certificate keeps its id, so its row (and the focused button in it)
  // is moved rather than remounted; `id` is only used for a new certificate.
  const existing = entries.find((entry) => isSameCertificate(entry, data));
  const entry: HistoryEntry = {
    ...toCertificateData(data),
    id: existing?.id ?? id,
    createdAt,
  };
  return [
    entry,
    ...entries.filter((existing) => !isSameCertificate(existing, data)),
  ];
}

/** The remembered form values, or the placeholder when nothing valid is stored. */
export function parseLastFormValues(raw: string | null): CertificateData {
  const parsed = certificateDataSchema.safeParse(parseJson(raw));
  return parsed.success ? parsed.data : PLACEHOLDER_CERTIFICATE;
}
