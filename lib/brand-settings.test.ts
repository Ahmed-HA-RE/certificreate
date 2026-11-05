import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BRAND_SETTINGS,
  parseBrandSettings,
  serializeBrandSettings,
} from '@/lib/brand-settings';
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
