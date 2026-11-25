import { z } from 'zod';
import {
  brandColorsSchema,
  logoDataUrlSchema,
} from '@/lib/brand-settings-schema';
import type {
  CertificateData,
  CertificateFormErrors,
  CertificateFormField,
  ExportRequest,
} from '@/types/certificate';

export const MAX_RECIPIENT_NAME_LENGTH = 20;
export const MAX_COURSE_TITLE_LENGTH = 40;
export const MAX_INSTRUCTOR_NAME_LENGTH = 20;

const RECIPIENT_NAME_TOO_LONG = `Recipient name must be ${MAX_RECIPIENT_NAME_LENGTH} characters or fewer.`;
const COURSE_TITLE_TOO_LONG = `Course must be ${MAX_COURSE_TITLE_LENGTH} characters or fewer.`;
const INSTRUCTOR_NAME_TOO_LONG = `Instructor name must be ${MAX_INSTRUCTOR_NAME_LENGTH} characters or fewer.`;

/**
 * Untrusted export payload and stored data. Empty fields are allowed (saved
 * history and cleared forms have them); lengths share the form's limits.
 */
export const certificateDataSchema = z.object({
  recipientName: z
    .string()
    .max(MAX_RECIPIENT_NAME_LENGTH, RECIPIENT_NAME_TOO_LONG),
  courseTitle: z.string().max(MAX_COURSE_TITLE_LENGTH, COURSE_TITLE_TOO_LONG),
  date: z.union([z.literal(''), z.iso.date()]),
  instructorName: z
    .string()
    .max(MAX_INSTRUCTOR_NAME_LENGTH, INSTRUCTOR_NAME_TOO_LONG),
  templateId: z.enum(['template-1', 'template-2', 'template-3']),
  border: z.enum(['blue', 'gold']),
}) satisfies z.ZodType<CertificateData>;

/** Untrusted export request body: the certificate plus optional brand colors and logo. */
export const exportRequestSchema = certificateDataSchema.extend({
  colors: brandColorsSchema.optional(),
  logoDataUrl: logoDataUrlSchema.nullable().optional(),
}) satisfies z.ZodType<ExportRequest>;

/** Required text, checked trimmed so whitespace alone counts as empty. */
function requiredText(
  max: number,
  emptyMessage: string,
  tooLongMessage: string,
) {
  return z.string().trim().min(1, emptyMessage).max(max, tooLongMessage);
}

/** What the form needs before a download: every detail filled in and within its limit. */
export const certificateFormSchema = z.object({
  recipientName: requiredText(
    MAX_RECIPIENT_NAME_LENGTH,
    "Enter the recipient's name.",
    RECIPIENT_NAME_TOO_LONG,
  ),
  courseTitle: requiredText(
    MAX_COURSE_TITLE_LENGTH,
    'Enter the course or achievement.',
    COURSE_TITLE_TOO_LONG,
  ),
  date: z.iso.date('Choose or type a date.'),
  instructorName: requiredText(
    MAX_INSTRUCTOR_NAME_LENGTH,
    "Enter the instructor's name.",
    INSTRUCTOR_NAME_TOO_LONG,
  ),
}) satisfies z.ZodType<Pick<CertificateData, CertificateFormField>>;

/** The detail fields in form order, so the first invalid one can take focus. */
export const CERTIFICATE_FORM_FIELDS = Object.keys(
  certificateFormSchema.shape,
) as CertificateFormField[];

/** The first message for each invalid detail field of `data`; `{}` when it can be downloaded. */
export function validateCertificateForm(
  data: CertificateData,
): CertificateFormErrors {
  const result = certificateFormSchema.safeParse(data);
  if (result.success) return {};
  const errors: CertificateFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as CertificateFormField;
    errors[field] ??= issue.message;
  }
  return errors;
}
