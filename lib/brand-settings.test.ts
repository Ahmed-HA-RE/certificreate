import { describe, expect, it } from 'vitest';
import {
  checkLogoFile,
  DEFAULT_BRAND_SETTINGS,
  parseBrandSettings,
  serializeBrandSettings,
} from '@/lib/brand-settings';
import { MAX_LOGO_BYTES } from '@/lib/brand-settings-schema';
import type { BrandSettings } from '@/types/brand-settings';

const STORED: BrandSettings = {
  logoDataUrl: null,
  colors: { primary: '#7a1f3d' },
};

describe('parseBrandSettings', () => {
  it('returns the defaults when nothing is stored', () => {
    expect(parseBrandSettings(null)).toBe(DEFAULT_BRAND_SETTINGS);
  });

  it('returns the defaults for invalid JSON or the wrong shape', () => {
    for (const raw of [
      'not json',
      '[]',
      JSON.stringify({ ...STORED, logoDataUrl: 42 }),
      JSON.stringify({ ...STORED, colors: { primary: 'red' } }),
      JSON.stringify({ ...STORED, extra: true }),
    ]) {
      expect(parseBrandSettings(raw)).toBe(DEFAULT_BRAND_SETTINGS);
    }
  });

  it('keeps valid stored settings', () => {
    expect(parseBrandSettings(JSON.stringify(STORED))).toEqual(STORED);
  });

  it('round-trips through serializeBrandSettings', () => {
    expect(parseBrandSettings(serializeBrandSettings(STORED))).toEqual(STORED);
    expect(
      parseBrandSettings(serializeBrandSettings(DEFAULT_BRAND_SETTINGS)),
    ).toEqual(DEFAULT_BRAND_SETTINGS);
  });
});

describe('checkLogoFile', () => {
  it('accepts a PNG or JPEG up to the size limit', () => {
    expect(checkLogoFile({ type: 'image/png', size: MAX_LOGO_BYTES })).toBeNull();
    expect(checkLogoFile({ type: 'image/jpeg', size: 1 })).toBeNull();
  });

  it('refuses any other type', () => {
    for (const type of ['image/gif', 'image/svg+xml', 'image/webp', '']) {
      expect(checkLogoFile({ type, size: 1 })).toBe('type');
    }
  });

  it('refuses a file over the size limit', () => {
    expect(checkLogoFile({ type: 'image/png', size: MAX_LOGO_BYTES + 1 })).toBe(
      'size',
    );
  });
});

describe('parseBrandSettings with a logo', () => {
  it('keeps a stored PNG logo', () => {
    const stored = { ...STORED, logoDataUrl: 'data:image/png;base64,iVBORw0KGgo=' };
    expect(parseBrandSettings(JSON.stringify(stored))).toEqual(stored);
  });

  it('returns the defaults for an SVG logo', () => {
    const stored = { ...STORED, logoDataUrl: 'data:image/svg+xml;base64,PHN2Zy8+' };
    expect(parseBrandSettings(JSON.stringify(stored))).toBe(DEFAULT_BRAND_SETTINGS);
  });
});
