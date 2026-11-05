import { z } from 'zod';
import type { BrandColors, BrandSettings } from '@/types/brand-settings';

// Strict `#rrggbb` is what makes a color safe to set as a CSS custom property.
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const brandColorsSchema = z.strictObject({
  primary: hexColor.optional(),
}) satisfies z.ZodType<BrandColors>;

/** Stored brand settings; `logoDataUrl` stays `null` until logo upload lands. */
export const brandSettingsSchema = z.strictObject({
  logoDataUrl: z.null(),
  colors: brandColorsSchema,
}) satisfies z.ZodType<BrandSettings>;
