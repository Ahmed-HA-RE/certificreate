import { z } from 'zod';
import type { BrandColors, BrandSettings } from '@/types/brand-settings';

/** 1 MB, the largest logo file accepted. */
export const MAX_LOGO_BYTES = 1024 * 1024;

export const LOGO_MIME_TYPES = ['image/png', 'image/jpeg'];

// Strict `#rrggbb` is what makes a color safe to set as a CSS custom property.
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const brandColorsSchema = z.strictObject({
  primary: hexColor.optional(),
}) satisfies z.ZodType<BrandColors>;

const LOGO_DATA_URL = /^data:image\/(?:png|jpeg);base64,([A-Za-z0-9+/]+={0,2})$/;

function decodedLogoBytes(dataUrl: string) {
  const base64 = LOGO_DATA_URL.exec(dataUrl)?.[1];
  if (!base64 || base64.length % 4 !== 0) return Infinity;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return (base64.length / 4) * 3 - padding;
}

/** A base64 PNG or JPEG data URL of at most `MAX_LOGO_BYTES` once decoded. */
export const logoDataUrlSchema = z
  .string()
  .refine((dataUrl) => decodedLogoBytes(dataUrl) <= MAX_LOGO_BYTES);

export const brandSettingsSchema = z.strictObject({
  logoDataUrl: logoDataUrlSchema.nullable(),
  colors: brandColorsSchema,
}) satisfies z.ZodType<BrandSettings>;
