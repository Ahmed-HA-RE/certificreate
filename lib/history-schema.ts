import { z } from 'zod';
import { certificateDataSchema } from '@/lib/certificate-schema';
import type { HistoryEntry } from '@/types/history';

/** One stored history entry; local storage is user-editable, so it is untrusted. */
export const historyEntrySchema = certificateDataSchema.extend({
  id: z.string().min(1),
  createdAt: z.iso.datetime(),
}) satisfies z.ZodType<HistoryEntry>;
