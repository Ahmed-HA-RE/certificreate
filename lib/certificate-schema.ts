import { z } from 'zod';
import { brandColorsSchema } from '@/lib/brand-settings-schema';
import type { CertificateData, ExportRequest } from '@/types/certificate';

/** Abuse guard for the export route; the form's own limits arrive in feature 7. */
const MAX_TEXT_LENGTH = 200;

const text = z.string().max(MAX_TEXT_LENGTH);

/** Untrusted export payload. Empty fields are allowed, as the form allows them. */
export const certificateDataSchema = z.strictObject({
  recipientName: text,
  courseTitle: text,
  date: z.union([z.literal(''), z.iso.date()]),
  instructorName: text,
  templateId: z.enum(['template-1', 'template-2', 'template-3']),
  border: z.enum(['blue', 'gold']),
}) satisfies z.ZodType<CertificateData>;

/** Untrusted export request body: the certificate plus optional brand colors. */
export const exportRequestSchema = certificateDataSchema.extend({
  colors: brandColorsSchema.optional(),
}) satisfies z.ZodType<ExportRequest>;
