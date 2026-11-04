import { z } from 'zod';
import type { CertificateData } from '@/types/certificate';

/** Abuse guard for the export route; the form's own limits arrive in feature 7. */
const MAX_TEXT_LENGTH = 200;

const text = z.string().max(MAX_TEXT_LENGTH);

/** Untrusted export payload. Empty fields are allowed, as the form allows them. */
export const certificateDataSchema = z.strictObject({
  recipientName: text,
  courseTitle: text,
  date: z.union([z.literal(''), z.iso.date()]),
  instructorName: text,
  templateId: z.literal('template-1'),
  border: z.enum(['blue', 'gold']),
}) satisfies z.ZodType<CertificateData>;
