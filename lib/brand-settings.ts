import {
  brandSettingsSchema,
  LOGO_MIME_TYPES,
  MAX_LOGO_BYTES,
} from '@/lib/brand-settings-schema';
import type { BrandSettings, LogoFileError } from '@/types/brand-settings';

export const BRAND_SETTINGS_STORAGE_KEY = 'certifcreate:brand-settings';

/** `--color-cert-navy` in `globals.css`, shown when no brand color is set. */
export const DEFAULT_BRAND_COLOR = '#173a7c';

export const DEFAULT_BRAND_SETTINGS: BrandSettings = Object.freeze({
  logoDataUrl: null,
  colors: Object.freeze({}),
});

/** Stored settings, or the defaults when nothing valid is stored. */
export function parseBrandSettings(raw: string | null): BrandSettings {
  if (raw === null) return DEFAULT_BRAND_SETTINGS;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return DEFAULT_BRAND_SETTINGS;
  }
  const parsed = brandSettingsSchema.safeParse(value);
  return parsed.success ? parsed.data : DEFAULT_BRAND_SETTINGS;
}

export function serializeBrandSettings(settings: BrandSettings) {
  return JSON.stringify(settings);
}

/** Why a picked logo file is refused before it is read, or `null` when it may be read. */
export function checkLogoFile(file: Pick<File, 'type' | 'size'>): LogoFileError | null {
  if (!LOGO_MIME_TYPES.includes(file.type)) return 'type';
  if (file.size > MAX_LOGO_BYTES) return 'size';
  return null;
}
