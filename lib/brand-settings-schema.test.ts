import { describe, expect, it } from 'vitest';
import {
  brandColorsSchema,
  logoDataUrlSchema,
  MAX_LOGO_BYTES,
} from '@/lib/brand-settings-schema';

/** A base64 payload that decodes to exactly `bytes` bytes. */
function base64OfBytes(bytes: number) {
  const full = Math.floor(bytes / 3);
  const rest = bytes % 3;
  return 'AAAA'.repeat(full) + (rest === 1 ? 'AA==' : rest === 2 ? 'AAA=' : '');
}

describe('brandColorsSchema', () => {
  it('accepts no override or a #rrggbb color', () => {
    expect(brandColorsSchema.safeParse({}).success).toBe(true);
    expect(brandColorsSchema.safeParse({ primary: '#a1b2c3' }).success).toBe(
      true,
    );
  });

  it('rejects anything that is not #rrggbb', () => {
    for (const primary of ['red', '#abc', '#12345', 'url(x)', '#a1b2c3;']) {
      expect(brandColorsSchema.safeParse({ primary }).success).toBe(false);
    }
  });

  it('rejects unknown keys', () => {
    expect(brandColorsSchema.safeParse({ accent: '#a1b2c3' }).success).toBe(
      false,
    );
  });
});

describe('logoDataUrlSchema', () => {
  it('accepts base64 PNG and JPEG data URLs', () => {
    expect(
      logoDataUrlSchema.safeParse('data:image/png;base64,iVBORw0KGgo=').success,
    ).toBe(true);
    expect(logoDataUrlSchema.safeParse('data:image/jpeg;base64,/9j/4AA=').success).toBe(
      true,
    );
  });

  it('accepts a logo of exactly the size limit and rejects one byte more', () => {
    const atLimit = `data:image/png;base64,${base64OfBytes(MAX_LOGO_BYTES)}`;
    const overLimit = `data:image/png;base64,${base64OfBytes(MAX_LOGO_BYTES + 1)}`;
    expect(logoDataUrlSchema.safeParse(atLimit).success).toBe(true);
    expect(logoDataUrlSchema.safeParse(overLimit).success).toBe(false);
  });

  it('rejects other formats, non-base64 data, and other URLs', () => {
    for (const value of [
      'data:image/svg+xml;base64,PHN2Zy8+',
      'data:image/gif;base64,R0lGODlh',
      'data:image/png,raw',
      'data:image/png;base64,iVBORw0KGgo',
      'javascript:alert(1)',
      '',
    ]) {
      expect(logoDataUrlSchema.safeParse(value).success).toBe(false);
    }
  });
});
